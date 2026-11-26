import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import * as local from './auth-store-local';
import { cloudDatabase, cloudEnabled, cloudTransaction } from './cloud-database';

export { sessionCookie, sessionLifetimeSeconds } from './auth-store-local';

function equalHex(left: string, right: string) {
  return timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
}

export async function createAccount(email: string, password: string) {
  if (!cloudEnabled()) return local.createAccount(email, password);
  const id = randomUUID();
  const salt = randomBytes(16).toString('hex');
  const hash = (await local.hashPassword(password, salt)).toString('hex');
  const result = await (await cloudDatabase()).query(`
    INSERT INTO fitfuel_private.accounts (id,email,salt,password_hash)
    VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING
  `, [id, email, salt, hash]);
  return result.rowCount ? { id, email } : null;
}

export async function verifyAccount(email: string, password: string) {
  if (!cloudEnabled()) return local.verifyAccount(email, password);
  const { rows: [row] } = await (await cloudDatabase()).query<{
    id: string; email: string; salt: string; password_hash: string;
  }>('SELECT id,email,salt,password_hash FROM fitfuel_private.accounts WHERE email = $1', [email]);
  const actual = (await local.hashPassword(password, row?.salt ?? '00000000000000000000000000000000')).toString('hex');
  if (!row || !equalHex(actual, row.password_hash)) return null;
  return { id: row.id, email: row.email, passwordHash: row.password_hash };
}

export async function createSession(accountId: string, passwordHash?: string) {
  if (!cloudEnabled()) return local.createSession(accountId, passwordHash);
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  return cloudTransaction(async (db) => {
    await db.query('DELETE FROM fitfuel_private.sessions WHERE expires_at <= $1', [now]);
    const result = await db.query(`
      INSERT INTO fitfuel_private.sessions (token_hash,account_id,expires_at)
      SELECT $1,id,$2 FROM fitfuel_private.accounts
      WHERE id = $3 AND ($4::text IS NULL OR password_hash = $4) FOR UPDATE
    `, [local.hashToken(token), now + local.sessionLifetimeSeconds * 1000, accountId, passwordHash ?? null]);
    return result.rowCount ? token : null;
  });
}

export async function sessionAccount(request: Request) {
  if (!cloudEnabled()) return local.sessionAccount(request);
  const token = local.sessionToken(request);
  if (!token) return null;
  const { rows: [row] } = await (await cloudDatabase()).query<local.Account>(`
    SELECT a.id,a.email FROM fitfuel_private.sessions s JOIN fitfuel_private.accounts a ON a.id = s.account_id
    WHERE s.token_hash = $1 AND s.expires_at > $2
  `, [local.hashToken(token), Date.now()]);
  return row ?? null;
}

export async function endSession(request: Request) {
  if (!cloudEnabled()) return local.endSession(request);
  const token = local.sessionToken(request);
  if (token) await (await cloudDatabase()).query(
    'DELETE FROM fitfuel_private.sessions WHERE token_hash = $1', [local.hashToken(token)],
  );
}

export async function issueResetCode(email: string) {
  if (!cloudEnabled()) return local.issueResetCode(email);
  const code = randomBytes(6).toString('hex').toUpperCase();
  const now = Date.now();
  const { rows: [row] } = await (await cloudDatabase()).query<{ account_id: string }>(`
    INSERT INTO fitfuel_private.password_resets (account_id,code_hash,expires_at,next_request_at,failures)
    SELECT id,$2,$3,$4,0 FROM fitfuel_private.accounts WHERE email = $1
    ON CONFLICT (account_id) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,
      next_request_at=excluded.next_request_at,failures=0
    WHERE fitfuel_private.password_resets.next_request_at <= $5 RETURNING account_id
  `, [email, local.hashToken(code), now + 10 * 60_000, now + 60_000, now]);
  return row ? { code, accountId: row.account_id } : null;
}

export async function cancelResetCode(accountId: string, code: string) {
  if (!cloudEnabled()) return local.cancelResetCode(accountId, code);
  await (await cloudDatabase()).query(
    'UPDATE fitfuel_private.password_resets SET expires_at = 0 WHERE account_id = $1 AND code_hash = $2',
    [accountId, local.hashToken(code)],
  );
}

export async function resetPassword(email: string, code: string, password: string) {
  if (!cloudEnabled()) return local.resetPassword(email, code, password);
  const db = await cloudDatabase();
  const codeHash = local.hashToken(code);
  const { rows: [row] } = await db.query<{ account_id: string; code_hash: string }>(`
    SELECT r.account_id,r.code_hash FROM fitfuel_private.password_resets r
    JOIN fitfuel_private.accounts a ON a.id = r.account_id
    WHERE a.email = $1 AND r.expires_at > $2 AND r.failures < 5
  `, [email, Date.now()]);
  if (!row) return false;
  if (!equalHex(row.code_hash, codeHash)) {
    await db.query(
      'UPDATE fitfuel_private.password_resets SET failures = failures + 1 WHERE account_id = $1 AND code_hash = $2',
      [row.account_id, row.code_hash],
    );
    return false;
  }

  const salt = randomBytes(16).toString('hex');
  const hash = (await local.hashPassword(password, salt)).toString('hex');
  return cloudTransaction(async (client) => {
    await client.query('SELECT id FROM fitfuel_private.accounts WHERE id=$1 FOR UPDATE', [row.account_id]);
    const consumed = await client.query(`
      DELETE FROM fitfuel_private.password_resets WHERE account_id=$1 AND code_hash=$2 AND expires_at>$3 AND failures<5
    `, [row.account_id, codeHash, Date.now()]);
    if (!consumed.rowCount) return false;
    await client.query('UPDATE fitfuel_private.accounts SET salt=$1,password_hash=$2 WHERE id=$3', [salt, hash, row.account_id]);
    await client.query('DELETE FROM fitfuel_private.sessions WHERE account_id=$1', [row.account_id]);
    return true;
  });
}
