import { sessionAccount } from '@/server/auth-store';
import { cloudEnabled, cloudTransaction } from '@/server/cloud-database';
import { emptyJournal, isJournal, maxJournalRequest, mergeJournal, type Journal } from '@/utils/journal-sync';

function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!cloudEnabled()) return reply({ enabled: false });

  try {
    const account = await sessionAccount(request);
    if (!account) return reply({ error: 'Günlüğü eşitlemek için tekrar giriş yap.' }, 401);
    if (Number(request.headers.get('content-length')) > maxJournalRequest) return reply({ error: 'Günlük isteği çok büyük.' }, 413);

    const body = await request.text();
    if (body.length > maxJournalRequest) return reply({ error: 'Günlük isteği çok büyük.' }, 413);
    const data = JSON.parse(body) as { accountId?: unknown; base?: unknown; local?: unknown } | null;
    if (data?.accountId !== account.id) return reply({ error: 'Hesap oturumu değişti.' }, 403);
    if (!isJournal(data?.base) || !isJournal(data?.local)) return reply({ error: 'Günlük biçimi geçersiz.' }, 400);

    const { base, local } = data;
    const journal = await cloudTransaction(async (client) => {
      await client.query('SELECT id FROM fitfuel_private.accounts WHERE id=$1 FOR UPDATE', [account.id]);
      const { rows: [row] } = await client.query<{ body: Journal }>(
        'SELECT body FROM fitfuel_private.journals WHERE account_id=$1', [account.id],
      );
      const next = mergeJournal(base, local, row?.body ?? emptyJournal);
      await client.query(`
        INSERT INTO fitfuel_private.journals (account_id, body) VALUES ($1,$2)
        ON CONFLICT (account_id) DO UPDATE SET body = excluded.body
        WHERE fitfuel_private.journals.body IS DISTINCT FROM excluded.body
      `, [account.id, JSON.stringify(next)]);
      return next;
    });
    return reply({ enabled: true, journal });
  } catch (error) {
    if (error instanceof SyntaxError) return reply({ error: 'Günlük okunamadı.' }, 400);
    return reply({ error: 'Bulut eşitlemesi şu anda tamamlanamadı.' }, 503);
  }
}
