import {
  cancelResetCode, createAccount, createSession, endSession, issueResetCode,
  resetPassword, sessionAccount, sessionCookie, sessionLifetimeSeconds, verifyAccount,
} from '@/server/auth-store';

let windowEnd = 0;
let attempts = 0;
let active = 0;

function reply(body: object, status = 200, cookie?: string) {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  if (cookie) headers.set('Set-Cookie', cookie);
  return Response.json(body, { status, headers });
}

async function sendResetCode(email: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FITFUEL_RESET_FROM_EMAIL;
  if (!key || !from) return reply({ error: 'Şifre sıfırlama e-postası için sunucu ayarları gerekli.' }, 503);

  const reset = await issueResetCode(email);
  if (reset) {
    try {
      const sent = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8_000),
        body: JSON.stringify({
          from,
          to: [email],
          subject: 'FitFuel Life şifre sıfırlama kodu',
          text: `FitFuel Life şifre sıfırlama kodun: ${reset.code}. Kod 10 dakika geçerlidir. Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.`,
        }),
      });
      if (!sent.ok) {
        console.warn(`FitFuel şifre sıfırlama e-postası gönderilemedi (HTTP ${sent.status}).`);
        await cancelResetCode(reset.accountId, reset.code);
      }
    } catch {
      console.warn('FitFuel şifre sıfırlama e-posta servisine bağlanamadı.');
      await cancelResetCode(reset.accountId, reset.code);
    }
  }
  return reply({ ok: true }, 202);
}

export async function GET(request: Request) {
  try {
    const account = await sessionAccount(request);
    return account ? reply({ account }) : reply({ account: null }, 401);
  } catch {
    return reply({ error: 'Oturum kontrol edilemedi. Tekrar dene.' }, 503);
  }
}

export async function POST(request: Request) {
  if (Number(request.headers.get('content-length')) > 4096) {
    return reply({ error: 'Form çok uzun.' }, 413);
  }
  let form: { action?: unknown; email?: unknown; password?: unknown; code?: unknown };
  try {
    const body = await request.text();
    if (body.length > 4096) return reply({ error: 'Form çok uzun.' }, 413);
    form = JSON.parse(body);
    if (!form || typeof form !== 'object') throw new Error();
  } catch {
    return reply({ error: 'Form okunamadı.' }, 400);
  }

  if (form.action === 'sign-out') {
    try {
      await endSession(request);
      return reply({ ok: true }, 200, sessionCookie(request, '', 0));
    } catch {
      return reply({ error: 'Oturum kapatılamadı. Tekrar dene.' }, 503);
    }
  }

  const { action, password } = form;
  const email = typeof form.email === 'string' ? form.email.trim().toLowerCase() : '';
  const code = typeof form.code === 'string' ? form.code.replace(/[\s-]/g, '').toUpperCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply({ error: 'Geçerli bir e-posta adresi gir.' }, 400);
  }
  if (action !== 'request-password-reset' &&
    (typeof password !== 'string' || password.length < 8 || password.length > 128)) {
    return reply({ error: 'En az 8 karakterli bir şifre gir.' }, 400);
  }

  const now = Date.now();
  if (now >= windowEnd) {
    windowEnd = now + 60_000;
    attempts = 0;
  }
  if (attempts >= 20 || active >= 2) return reply({ error: 'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.' }, 429);
  attempts += 1;
  active += 1;

  try {
    if (action === 'request-password-reset') return await sendResetCode(email);
    if (typeof password !== 'string') return reply({ error: 'Şifre gir.' }, 400);
    if (action === 'reset-password') {
      if (!/^[a-fA-F0-9]{12}$/.test(code) || !(await resetPassword(email, code, password))) {
        return reply({ error: 'Kod geçersiz veya süresi dolmuş. Yeni bir kod iste.' }, 400);
      }
      return reply({ ok: true }, 200, sessionCookie(request, '', 0));
    }
    if (action !== 'sign-in' && action !== 'sign-up') return reply({ error: 'Form okunamadı.' }, 400);
    const found = action === 'sign-up' ? await createAccount(email, password) : await verifyAccount(email, password);
    if (!found) {
      return action === 'sign-up'
        ? reply({ error: 'Bu e-posta ile kayıtlı bir hesap var. Giriş yapmayı dene.' }, 409)
        : reply({ error: 'E-posta veya şifre yanlış.' }, 401);
    }
    const account = { id: found.id, email: found.email };
    const token = await createSession(account.id, 'passwordHash' in found ? found.passwordHash : undefined);
    if (!token) return reply({ error: 'E-posta veya şifre yanlış.' }, 401);
    if (request.headers.get('X-FitFuel-Client') === 'native') return reply({ account, token });
    return reply({ account }, 200, sessionCookie(request, token, sessionLifetimeSeconds));
  } catch {
    return reply({ error: 'Hesap işlemi tamamlanamadı. Tekrar dene.' }, 503);
  } finally {
    active -= 1;
  }
}
