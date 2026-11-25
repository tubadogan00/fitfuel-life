import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Action, Card, Copy, Heading } from '@/components/fitness-ui';
import { RecipePhoto } from '@/components/recipe-photo';
import type { PlanDay } from '@/utils/weekly-plan';

export function PlanDayCard({ day, title, completed = false }: {
  day: PlanDay;
  title: string;
  completed?: boolean;
}) {
  return (
    <Card>
      <Heading>{title}</Heading>
      <Copy>{day.workout.title} · {day.workout.detail}</Copy>
      {completed && <Copy>Bugün tamamlandı</Copy>}
      <Action secondary title="Antrenmanı aç"
        onPress={() => router.navigate(`/coach/${day.workout.id}` as Href)} />
      <View style={styles.meal}>
        <View style={styles.photo}>
          <RecipePhoto source={day.meal.photo} size={70} />
        </View>
        <View style={styles.description}>
          <Heading>Spor sonrası öğün</Heading>
          <Copy>{day.meal.name}</Copy>
          <Copy>Yaklaşık {day.meal.calories} kcal · {day.meal.proteinGrams} g protein</Copy>
        </View>
      </View>
      <Action secondary title="Öğün tarifini aç"
        onPress={() => router.navigate(`/recipes/${day.meal.id}` as Href)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  meal: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  photo: { borderRadius: 12, overflow: 'hidden' },
  description: { flex: 1, gap: 2 },
});
