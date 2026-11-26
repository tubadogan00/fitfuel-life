import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/components/auth-session';
import { Action, colors, Screen } from '@/components/fitness-ui';

function AppRoutes() {
  const { account, guest, enterGuest, loading, loadError, retry } = useAuth();
  const canBrowse = Boolean(account) || guest;
  if (loading || loadError) {
    return (
      <Screen label="FitFuel Life" title="FitFuel Life" subtitle={loading ? 'Oturum kontrol ediliyor…' : loadError}>
        {loadError !== '' && <Action title="Tekrar dene" onPress={retry} />}
        {loadError !== '' && <Action secondary title="Hesap açmadan devam et" onPress={enterGuest} />}
      </Screen>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={!canBrowse}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={canBrowse}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppRoutes />
    </AuthProvider>
  );
}
