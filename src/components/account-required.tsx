import { useState } from 'react';
import { useAuth } from '@/components/auth-session';
import { Action, Copy } from '@/components/fitness-ui';

export function AccountRequired({ action }: { action?: string }) {
  const { leaveGuest } = useAuth();
  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      {action && <Action secondary title={action} onPress={() => setShowMessage(true)} />}
      {(!action || showMessage) && (
        <>
          <Copy>Bu işlem için hesap açmanız gerekmektedir.</Copy>
          <Action title="Giriş yap veya kayıt ol" onPress={leaveGuest} />
        </>
      )}
    </>
  );
}
