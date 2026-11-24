import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { submitPasswordReset } from '@/components/auth-session';
import { Action, Card, Copy, Field, Screen } from '@/components/fitness-ui';

export default function ForgotPassword() {
  const [stage, setStage] = useState<'email' | 'code' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);

  async function submit(reset?: { code: string; password: string }) {
    if (pending.current) return;
    if (reset && password !== confirmation) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await submitPasswordReset(email.trim(), reset);
      if (result) setError(result);
      else setStage(reset ? 'done' : 'code');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <Screen label="FitFuel Life" title="Şifremi unuttum"
      subtitle={stage === 'done' ? 'Şifren değiştirildi. Yeni şifrenle giriş yapabilirsin.' : 'Hesabına bağlı e-posta adresiyle yeni bir şifre belirle.'}>
      {stage === 'email' && (
        <Card>
          <Field label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none"
            autoCorrect={false} autoComplete="email" keyboardType="email-address" maxLength={254}
            returnKeyType="go" onSubmitEditing={() => { if (email.trim()) void submit(); }} />
          {error !== '' && <Copy>{error}</Copy>}
          <Action title={busy ? 'Gönderiliyor…' : 'Sıfırlama kodu gönder'}
            disabled={busy || !email.trim()} onPress={() => submit()} />
        </Card>
      )}
      {stage === 'code' && (
        <Card>
          <Copy>Bu adresle bir hesap varsa kod e-postana gelir. Kod 10 dakika geçerlidir.</Copy>
          <Copy>{email.trim()}</Copy>
          <Field label="E-postadaki kod" value={code} maxLength={18} autoCapitalize="characters"
            autoCorrect={false} autoComplete="one-time-code" onChangeText={setCode} />
          <Field label="Yeni şifre" value={password} onChangeText={setPassword} maxLength={128}
            secureTextEntry autoCapitalize="none" autoComplete="new-password" />
          <Field label="Yeni şifreyi tekrar gir" value={confirmation} onChangeText={setConfirmation}
            maxLength={128} secureTextEntry autoCapitalize="none" autoComplete="new-password" />
          <Copy>Yeni şifren en az 8 karakter olmalı.</Copy>
          {error !== '' && <Copy>{error}</Copy>}
          <Action title={busy ? 'Bekle…' : 'Yeni şifreyi kaydet'}
            disabled={busy || !code.trim() || password.length < 8 || !confirmation}
            onPress={() => submit({ code, password })} />
          <Action secondary title="Yeni kod iste" disabled={busy} onPress={() => submit()} />
          <Action secondary title="E-posta adresini değiştir" disabled={busy} onPress={() => {
            setCode('');
            setPassword('');
            setConfirmation('');
            setError('');
            setStage('email');
          }} />
        </Card>
      )}
      <Action secondary title="Giriş ekranına dön" disabled={busy} onPress={() => router.replace('./sign-in')} />
    </Screen>
  );
}
