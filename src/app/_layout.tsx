import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/components/auth-session';
import { Action, colors, Screen } from '@/components/fitness-ui';

function AppRoutes() {
  const { account, loading, loadError, retry } = useAuth();
  if (loading || loadError) {
    return (
      <Screen label="FitFuel Life" title="FitFuel Life" subtitle={loading ? 'Oturum kontrol ediliyor…' : loadError}>
        {loadError !== '' && <Action title="Tekrar dene" onPress={retry} />}
      </Screen>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={!account}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(account)}>
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
