import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Pool, type PoolClient } from 'pg';

let pool: Pool | undefined;
let initialization: Promise<void> | undefined;

export function cloudEnabled() {
  return process.env.FITFUEL_CLOUD_ENABLED === 'true';
}

const schema = `
  CREATE SCHEMA IF NOT EXISTS fitfuel_private;
  REVOKE ALL ON SCHEMA fitfuel_private FROM PUBLIC;
  CREATE TABLE IF NOT EXISTS fitfuel_private.accounts (
    id text PRIMARY KEY, email text NOT NULL UNIQUE, salt text NOT NULL, password_hash text NOT NULL
  );
  CREATE TABLE IF NOT EXISTS fitfuel_private.sessions (
    token_hash text PRIMARY KEY, account_id text NOT NULL REFERENCES fitfuel_private.accounts(id),
    expires_at bigint NOT NULL
  );
  CREATE INDEX IF NOT EXISTS fitfuel_sessions_expiry ON fitfuel_private.sessions(expires_at);
  CREATE TABLE IF NOT EXISTS fitfuel_private.password_resets (
    account_id text PRIMARY KEY REFERENCES fitfuel_private.accounts(id),
    code_hash text NOT NULL, expires_at bigint NOT NULL, next_request_at bigint NOT NULL, failures integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS fitfuel_private.journals (
    account_id text PRIMARY KEY REFERENCES fitfuel_private.accounts(id), body jsonb NOT NULL
  );
  CREATE TABLE IF NOT EXISTS fitfuel_private.migrations (name text PRIMARY KEY);
`;

async function importAccounts(client: PoolClient) {
  const path = resolve(process.env.FITFUEL_AUTH_DB || '.fitfuel/accounts.sqlite');
  if (!existsSync(path)) return;
  const claimed = await client.query(
    "INSERT INTO fitfuel_private.migrations(name) VALUES ('sqlite-accounts-v1') ON CONFLICT DO NOTHING",
  );
  if (!claimed.rowCount) return;

  const sqlite = new DatabaseSync(path, { readOnly: true });
  try {
    const accounts = sqlite.prepare('SELECT id, email, salt, passwordHash FROM accounts').all();
    for (const row of accounts) {
      const result = await client.query(`
        INSERT INTO fitfuel_private.accounts (id, email, salt, password_hash) VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
        WHERE fitfuel_private.accounts.email = EXCLUDED.email RETURNING id
      `, [row.id, row.email, row.salt, row.passwordHash]);
      if (!result.rowCount) throw new Error('Conflicting account during migration');
    }

    const sessions = sqlite.prepare('SELECT tokenHash, accountId, expiresAt FROM sessions WHERE expiresAt > ?').all(Date.now());
    for (const row of sessions) {
      await client.query(`
        INSERT INTO fitfuel_private.sessions (token_hash, account_id, expires_at)
        VALUES ($1, $2, $3) ON CONFLICT DO NOTHING
      `, [row.tokenHash, row.accountId, row.expiresAt]);
    }
  } finally {
    sqlite.close();
  }
}

async function initialize(db: Pool) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(8172401)');
    await client.query(schema);
    await importAccounts(client);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function cloudDatabase() {
  if (!pool) {
    const connection = new URL(process.env.DATABASE_URL ?? '');
    for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) connection.searchParams.delete(key);
    const certificate = process.env.FITFUEL_DB_CA_FILE || '.fitfuel/supabase-ca.crt';
    pool = new Pool({
      connectionString: connection.href,
      ssl: { ca: readFileSync(certificate, 'utf8'), rejectUnauthorized: true },
      max: 4,
      connectionTimeoutMillis: 8_000,
      query_timeout: 15_000,
    });
    pool.on('error', () => console.warn('FitFuel PostgreSQL bağlantısı kesildi.'));
  }
  if (!initialization) {
    initialization = initialize(pool).catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });
  }
  await initialization;
  return pool;
}

export async function cloudTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await (await cloudDatabase()).connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
