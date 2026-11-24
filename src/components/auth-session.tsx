import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

type Account = { id: string; email: string };
export type AuthAction = 'sign-in' | 'sign-up';

type AuthSession = {
  account: Account | null;
  loading: boolean;
  loadError: string;
  retry: () => void;
  authenticate: (action: AuthAction, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

const storageKey = 'fitfuel-session-v1';
const native = Platform.OS !== 'web';
const AuthContext = createContext<AuthSession | null>(null);
const connectionError = 'Oturum sunucusuna bağlanılamadı. Expo sunucusunun açık olduğunu kontrol et.';

export async function sessionHeaders(): Promise<Record<string, string>> {
  if (!native) return {};
  const token = await SecureStore.getItemAsync(storageKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(body?: object) {
  const headers = await sessionHeaders();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    return await fetch('/auth', {
      method: body ? 'POST' : 'GET',
      headers: { ...headers, ...(body && { 'Content-Type': 'application/json' }),
        ...(native && { 'X-FitFuel-Client': 'native' }) },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitPasswordReset(email: string, reset?: { code: string; password: string }) {
  try {
    const response = await request(reset
      ? { action: 'reset-password', email, ...reset }
      : { action: 'request-password-reset', email });
    if (response.ok) return null;
    const result = await response.json() as { error?: string };
    return result.error ?? 'Şifre sıfırlama tamamlanamadı.';
  } catch {
    return connectionError;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        if (native && !(await SecureStore.getItemAsync(storageKey))) return;
        const response = await request();
        if (response.status === 401) {
          if (native) await SecureStore.deleteItemAsync(storageKey);
          return;
        }
        if (!response.ok) throw new Error();
        const result = await response.json() as { account: Account };
        if (active) setAccount(result.account);
      } catch {
        if (active) setLoadError(connectionError);
      } finally {
        if (active) setLoading(false);
      }
    }
    void restore();
    return () => { active = false; };
  }, [attempt]);

  function retry() {
    setLoadError('');
    setLoading(true);
    setAttempt((value) => value + 1);
  }

  async function authenticate(action: AuthAction, email: string, password: string) {
    try {
      const response = await request({ action, email, password });
      const result = await response.json() as { account?: Account; token?: string; error?: string };
      if (!response.ok || !result.account) return result.error ?? 'Hesap işlemi tamamlanamadı.';
      if (native) {
        if (!result.token) return 'Oturum anahtarı alınamadı.';
        await SecureStore.setItemAsync(storageKey, result.token);
      }
      setAccount(result.account);
      return null;
    } catch {
      return connectionError;
    }
  }

  async function signOut() {
    try {
      const response = await request({ action: 'sign-out' });
      if (!response.ok) return 'Oturum kapatılamadı. Tekrar dene.';
      if (native) await SecureStore.deleteItemAsync(storageKey);
      setAccount(null);
      return null;
    } catch {
      return connectionError;
    }
  }

  return <AuthContext.Provider value={{ account, loading, loadError, retry, authenticate, signOut }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider is required');
  return context;
}
