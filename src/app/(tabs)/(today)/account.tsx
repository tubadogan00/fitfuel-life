import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/components/auth-session';
import { Action, Card, Copy, Screen } from '@/components/fitness-ui';

export default function Account() {
  const { account, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  return (
    <Screen label="FitFuel Life" title="Hesabım" subtitle={account?.email ?? ''}>
      <Action secondary title="Bugün’e dön" disabled={signingOut} onPress={() => router.dismissTo('/')} />
      <Card>
        {error !== '' && <Copy>{error}</Copy>}
        <Action secondary title={signingOut ? 'Oturum kapatılıyor…' : 'Çıkış yap'}
          disabled={signingOut} onPress={async () => {
            setSigningOut(true);
            setError('');
            const result = await signOut();
            if (result) {
              setError(result);
              setSigningOut(false);
            }
          }} />
      </Card>
    </Screen>
  );
}
