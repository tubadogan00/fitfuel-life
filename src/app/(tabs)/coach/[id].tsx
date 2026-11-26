import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AccountRequired } from '@/components/account-required';
import { useAuth } from '@/components/auth-session';
import { ExerciseAnimation } from '@/components/exercise-animation';
import { Action, Card, Copy, Heading, Screen } from '@/components/fitness-ui';
import { dateKey, useJournal } from '@/components/journal';
import { findWorkout } from '@/constants/workouts';

function backToWorkouts() {
  if (router.canGoBack()) router.back();
  else router.replace('./');
}

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account } = useAuth();
  const { journal, ready, update, error, reload } = useJournal();
  const [playing, setPlaying] = useState<number | null>(null);
  const focused = useIsFocused();
  const workout = findWorkout(id);

  if (!workout) {
    return (
      <Screen label="ANTRENMAN" title="Program bulunamadı" subtitle="Listeden bir antrenman seçebilirsin.">
        <Action secondary title="Antrenmanlara dön" onPress={backToWorkouts} />
      </Screen>
    );
  }

  const completed = journal.workouts[dateKey()]?.includes(workout.id) ?? false;

  function toggleWorkout(workoutId: string) {
    update((current) => {
      const day = dateKey();
      const entries = current.workouts[day] ?? [];
      const next = entries.includes(workoutId)
        ? entries.filter((entry) => entry !== workoutId)
        : [...entries, workoutId];
      return { ...current, workouts: { ...current.workouts, [day]: next } };
    });
  }

  return (
    <Screen label="ANTRENMAN" title={workout.title} subtitle={workout.detail}>
      <Action secondary title="Antrenmanlara dön" onPress={backToWorkouts} />
      {error && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      {workout.steps.map((step, index) => {
        if (!step.motion) return <Copy key={step.text}>{step.text}</Copy>;

        const [name, dosage] = step.text.split(' · ');
        const active = playing === index;
        return (
          <Card key={step.text}>
            <Heading>{name}</Heading>
            {dosage && <Copy>{dosage}</Copy>}
            <ExerciseAnimation movement={step.motion} playing={active && focused} />
            <Action secondary title={active ? 'Animasyonu durdur' : 'Animasyonu oynat'}
              onPress={() => setPlaying(active ? null : index)} />
          </Card>
        );
      })}
      {completed && <Copy>Bugün tamamlandı</Copy>}
      {account ? <Action secondary={completed} disabled={!ready}
        title={completed ? 'Tamamlamayı geri al' : 'Tamamlandı olarak işaretle'}
        onPress={() => toggleWorkout(workout.id)} /> : <AccountRequired action="Tamamlandı olarak işaretle" />}
    </Screen>
  );
}
