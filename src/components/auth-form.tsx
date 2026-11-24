import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useAuth, type AuthAction } from '@/components/auth-session';
import { Action, Card, Copy, Field, Screen } from '@/components/fitness-ui';

export function AuthForm({ mode }: { mode: AuthAction }) {
  const signUp = mode === 'sign-up';
  const { authenticate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const title = signUp ? 'Kayıt ol' : 'Giriş yap';

  async function submit() {
    if (submitting.current) return;
    if (signUp && password !== confirmation) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    const result = await authenticate(mode, email, password);
    submitting.current = false;
    setBusy(false);
    if (result) setError(result);
  }

  return (
    <Screen label="FitFuel Life" title={title}
      subtitle={signUp ? 'Öğün ve antrenman takibine başlamak için hesabını oluştur.' : 'Öğün ve antrenman takibine kaldığın yerden devam et.'}>
      <Card>
        <Field label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none"
          autoCorrect={false} autoComplete="email" keyboardType="email-address" maxLength={254} />
        <Field label="Şifre" value={password} onChangeText={setPassword} secureTextEntry
          autoCapitalize="none" autoComplete={signUp ? 'new-password' : 'current-password'}
          maxLength={128} returnKeyType={signUp ? 'next' : 'go'}
          onSubmitEditing={signUp || !email.trim() || !password ? undefined : submit} />
        {signUp && (
          <>
            <Copy>Şifren en az 8 karakter olmalı.</Copy>
            <Field label="Şifreyi tekrar gir" value={confirmation} onChangeText={setConfirmation}
              secureTextEntry autoCapitalize="none" autoComplete={Platform.OS === 'web' ? 'new-password' : 'off'}
              maxLength={128} returnKeyType="go"
              onSubmitEditing={!email.trim() || !password || !confirmation ? undefined : submit} />
          </>
        )}
        {error !== '' && <Copy>{error}</Copy>}
        <Action title={busy ? 'Bekle…' : title} disabled={busy || !email.trim() || !password || (signUp && !confirmation)}
          onPress={submit} />
        {!signUp && <Action secondary title="Şifremi unuttum"
          disabled={busy} onPress={() => router.push('./forgot-password')} />}
        <Action secondary title={signUp ? 'Zaten hesabım var · Giriş yap' : 'Hesap oluştur · Kayıt ol'}
          disabled={busy} onPress={() => router.replace(signUp ? './sign-in' : './sign-up')} />
      </Card>
    </Screen>
  );
}
