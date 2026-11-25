import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '@/components/auth-session';
import { JournalProvider } from '@/components/journal';
import { colors } from '@/components/fitness-ui';

const tabs = [
  { name: '(today)', title: 'Bugün', icon: '⌂' },
  { name: 'recipes', title: 'Tarifler', icon: '≡' },
  { name: 'calories', title: 'Kalori', icon: '◉' },
  { name: 'coach', title: 'Antrenman', icon: '↗' },
];

export default function Layout() {
  const { account } = useAuth();
  if (!account) return null;

  return (
    <JournalProvider key={account.id} accountId={account.id}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}>
        {tabs.map(({ name, title, icon }) => (
          <Tabs.Screen key={name} name={name} options={{
            title,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23 }}>{icon}</Text>,
          }} />
        ))}
      </Tabs>
    </JournalProvider>
  );
}
