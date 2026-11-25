import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Action, Card, Copy, Heading, Screen } from '@/components/fitness-ui';
import { dateKey, useJournal } from '@/components/journal';
import { PlanDayCard } from '@/components/plan-day';
import { buildWeek, weekdayIndex } from '@/utils/weekly-plan';

export default function Today() {
  const { journal, ready, error, reload } = useJournal();
  const date = new Date();
  const today = dateKey(date);
  const plan = journal.weeklyPlan;
  const planDay = plan && buildWeek(plan).find((day) => day.day === weekdayIndex(date));
  const calories = journal.meals.filter((meal) => meal.date === today).reduce((total, meal) => total + meal.calories, 0);
  const workouts = journal.workouts[today] ?? [];

  return (
    <Screen label="FitFuel Life" title="Bugün"
      subtitle={date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}>
      {error && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      {ready && planDay && <PlanDayCard day={planDay} title="Bugünün planı" completed={workouts.includes(planDay.workout.id)} />}
      {ready && !planDay && (
        <Card>
          <Heading>{plan ? 'Dinlenme günü' : 'Haftalık plan'}</Heading>
          <Copy>{plan ? 'Bugün için antrenman planlanmadı.' : 'Antrenman günlerini seç ve spor sonrası öğün önerilerine ulaş.'}</Copy>
          {!plan && <Action title="Haftalık plan oluştur" onPress={() => router.navigate('/weekly-plan' as Href)} />}
        </Card>
      )}
      <Card>
        <Heading>Kalori özeti</Heading>
        <Copy>{ready ? `${calories} kcal${journal.goal ? ` / ${journal.goal} kcal` : ''}` : 'Günlük yükleniyor…'}</Copy>
        {workouts.length > 0 && <Copy>Bugün tamamlanan antrenman: {workouts.length}</Copy>}
        <Action secondary title="Öğün kaydet" onPress={() => router.navigate('/calories')} />
      </Card>
      <View style={styles.links}>
        {ready && plan && <View style={styles.link}>
          <Action secondary title="Haftalık plan" onPress={() => router.navigate('/weekly-plan' as Href)} />
        </View>}
        <View style={styles.link}>
          <Action secondary title="Hesabım" onPress={() => router.navigate('/account' as Href)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  link: { flexGrow: 1 },
});
