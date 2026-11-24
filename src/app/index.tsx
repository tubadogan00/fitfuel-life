import { router } from 'expo-router';
import { Action, Card, Copy, Heading, Screen } from '@/components/fitness-ui';
import { dateKey, useJournal } from '@/components/journal';

export default function Today() {
  const { journal, ready, error, reload } = useJournal();
  const today = dateKey();
  const calories = journal.meals.filter((meal) => meal.date === today).reduce((total, meal) => total + meal.calories, 0);
  const workouts = journal.workouts[today]?.length ?? 0;

  return (
    <Screen label="FitFuel Life" title="Bugün" subtitle={new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}>
      {error && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      <Card>
        <Heading>Kalori günlüğü</Heading>
        <Copy>{ready ? `${calories} kcal${journal.goal ? ` / ${journal.goal} kcal` : ''}` : 'Günlük yükleniyor…'}</Copy>
        <Action title="Öğün kaydet" onPress={() => router.push('./calories')} />
      </Card>
      <Card>
        <Heading>Sağlıklı tarifler</Heading>
        <Copy>Malzemeleri ve hazırlık adımlarını gör, yediğin porsiyonu günlüğüne ekle.</Copy>
        <Action secondary title="Tarifleri keşfet" onPress={() => router.push('./recipes')} />
      </Card>
      <Card>
        <Heading>Antrenman</Heading>
        {ready && <Copy>Bugün tamamlanan antrenman: {workouts}</Copy>}
        <Action secondary title="Programları aç" onPress={() => router.push('./coach')} />
      </Card>
    </Screen>
  );
}
