import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type Account = { id: string; email: string };
type StoredAccount = Account & { salt: string; passwordHash: string };

export const sessionLifetimeSeconds = 30 * 24 * 60 * 60;
const cookieName = 'fitfuel_session';
let database: DatabaseSync | undefined;

function storage() {
  if (database) return database;
  const path = resolve(process.env.FITFUEL_AUTH_DB || '.fitfuel/accounts.sqlite');
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, passwordHash TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS sessions (
      tokenHash TEXT PRIMARY KEY, accountId TEXT NOT NULL REFERENCES accounts(id), expiresAt INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expiresAt);
    CREATE TABLE IF NOT EXISTS password_resets (
      accountId TEXT PRIMARY KEY REFERENCES accounts(id),
      codeHash TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      nextRequestAt INTEGER NOT NULL,
      failures INTEGER NOT NULL
    ) STRICT;
  `);
  database = db;
  return db;
}

export function hashPassword(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function createAccount(email: string, password: string) {
  const id = randomUUID();
  const salt = randomBytes(16).toString('hex');
  const passwordHash = (await hashPassword(password, salt)).toString('hex');
  const result = storage().prepare(`
    INSERT INTO accounts (id, email, salt, passwordHash) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING
  `).run(id, email, salt, passwordHash);
  return result.changes === 0 ? null : { id, email };
}

export async function verifyAccount(email: string, password: string) {
  const row = storage().prepare('SELECT id, email, salt, passwordHash FROM accounts WHERE email = ?')
    .get(email) as StoredAccount | undefined;
  const actual = await hashPassword(password, row?.salt ?? '00000000000000000000000000000000');
  if (!row || !timingSafeEqual(actual, Buffer.from(row.passwordHash, 'hex'))) return null;
  return { id: row.id, email: row.email, passwordHash: row.passwordHash };
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createSession(accountId: string, passwordHash?: string) {
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  const db = storage();
  db.prepare('DELETE FROM sessions WHERE expiresAt <= ?').run(now);
  const result = passwordHash
    ? db.prepare(`INSERT INTO sessions (tokenHash, accountId, expiresAt)
        SELECT ?, id, ? FROM accounts WHERE id = ? AND passwordHash = ?`)
      .run(hashToken(token), now + sessionLifetimeSeconds * 1000, accountId, passwordHash)
    : db.prepare('INSERT INTO sessions (tokenHash, accountId, expiresAt) VALUES (?, ?, ?)')
      .run(hashToken(token), accountId, now + sessionLifetimeSeconds * 1000);
  return result.changes === 1 ? token : null;
}

export function issueResetCode(email: string) {
  const db = storage();
  const account = db.prepare('SELECT id FROM accounts WHERE email = ?').get(email) as { id: string } | undefined;
  if (!account) return null;

  const now = Date.now();
  const code = randomBytes(6).toString('hex').toUpperCase();
  const result = db.prepare(`
    INSERT INTO password_resets (accountId, codeHash, expiresAt, nextRequestAt, failures)
    VALUES (?, ?, ?, ?, 0)
    ON CONFLICT(accountId) DO UPDATE SET codeHash = excluded.codeHash, expiresAt = excluded.expiresAt,
      nextRequestAt = excluded.nextRequestAt, failures = 0
    WHERE password_resets.nextRequestAt <= ?
  `).run(account.id, hashToken(code), now + 10 * 60_000, now + 60_000, now);
  return result.changes === 1 ? { code, accountId: account.id } : null;
}

export function cancelResetCode(accountId: string, code: string) {
  storage().prepare('UPDATE password_resets SET expiresAt = 0 WHERE accountId = ? AND codeHash = ?')
    .run(accountId, hashToken(code));
}

export async function resetPassword(email: string, code: string, password: string) {
  const db = storage();
  const codeHash = hashToken(code);
  const reset = db.prepare(`
    SELECT password_resets.accountId, password_resets.codeHash
    FROM password_resets JOIN accounts ON accounts.id = password_resets.accountId
    WHERE accounts.email = ? AND expiresAt > ? AND failures < 5
  `).get(email, Date.now()) as { accountId: string; codeHash: string } | undefined;
  if (!reset) return false;

  if (!timingSafeEqual(Buffer.from(reset.codeHash, 'hex'), Buffer.from(codeHash, 'hex'))) {
    db.prepare('UPDATE password_resets SET failures = failures + 1 WHERE accountId = ? AND codeHash = ?')
      .run(reset.accountId, reset.codeHash);
    return false;
  }

  const salt = randomBytes(16).toString('hex');
  const passwordHash = (await hashPassword(password, salt)).toString('hex');
  db.exec('BEGIN IMMEDIATE');
  try {
    const consumed = db.prepare(`
      DELETE FROM password_resets WHERE accountId = ? AND codeHash = ? AND expiresAt > ? AND failures < 5
    `).run(reset.accountId, codeHash, Date.now());
    if (consumed.changes === 0) {
      db.exec('ROLLBACK');
      return false;
    }
    db.prepare('UPDATE accounts SET salt = ?, passwordHash = ? WHERE id = ?').run(salt, passwordHash, reset.accountId);
    db.prepare('DELETE FROM sessions WHERE accountId = ?').run(reset.accountId);
    db.exec('COMMIT');
    return true;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function sessionToken(request: Request) {
  const bearer = request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/i)?.[1];
  const cookie = request.headers.get('cookie')?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  const token = bearer ?? cookie;
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export function sessionAccount(request: Request) {
  const token = sessionToken(request);
  if (!token) return null;
  return storage().prepare(`
    SELECT accounts.id, accounts.email FROM sessions
    JOIN accounts ON accounts.id = sessions.accountId
    WHERE sessions.tokenHash = ? AND sessions.expiresAt > ?
  `).get(hashToken(token), Date.now()) as Account | undefined ?? null;
}

export function endSession(request: Request) {
  const token = sessionToken(request);
  if (token) storage().prepare('DELETE FROM sessions WHERE tokenHash = ?').run(hashToken(token));
}

export function sessionCookie(request: Request, token: string, maxAge: number) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
