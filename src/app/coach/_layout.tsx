import { Stack } from 'expo-router';
import { colors } from '@/components/fitness-ui';

export default function CoachLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
