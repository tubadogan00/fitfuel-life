import { Stack } from 'expo-router';
import { colors } from '@/components/fitness-ui';

export default function RecipesLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
