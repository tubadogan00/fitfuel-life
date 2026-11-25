import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Action, Card, Copy, Heading } from '@/components/fitness-ui';
import { useJournal } from '@/components/journal';
import { PlanDayCard } from '@/components/plan-day';
import { locations, workouts } from '@/constants/workouts';
import { buildWeek, weekdays, type WeeklyPlan } from '@/utils/weekly-plan';

const defaultPlan: WeeklyPlan = { location: 'gym', days: [0, 2, 4] };

export function WeeklyPlanEditor() {
  const { journal, update } = useJournal();
  const [draft, setDraft] = useState(journal.weeklyPlan ?? defaultPlan);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const saved = journal.weeklyPlan;
  const unchanged = saved?.location === draft.location &&
    saved.days.length === draft.days.length &&
    draft.days.every((day) => saved.days.includes(day) &&
      saved.workoutByDay?.[day] === draft.workoutByDay?.[day]);
  const draftWeek = buildWeek(draft);

  function assignWorkout(day: number, workoutId?: string) {
    setDraft((current) => {
      const workoutByDay = { ...current.workoutByDay };
      if (workoutId) workoutByDay[day] = workoutId;
      else delete workoutByDay[day];
      return { ...current, workoutByDay };
    });
    setEditingDay(null);
  }

  return (
    <>
      <Card>
        <Heading>Antrenman yeri</Heading>
        <View style={styles.options}>
          {locations.map(({ id, label }) => (
            <View key={id} style={styles.location}>
              <Action title={label} selected={draft.location === id} secondary={draft.location !== id}
                onPress={() => {
                  setDraft((current) => current.location === id ? current : {
                    ...current, location: id, workoutByDay: {},
                  });
                  setEditingDay(null);
                }} />
            </View>
          ))}
        </View>
        <Heading>Antrenman günleri</Heading>
        <View style={styles.options}>
          {weekdays.map((name, day) => {
            const selected = draft.days.includes(day);
            return (
              <Action key={name} title={name} selected={selected} secondary={!selected} onPress={() => {
                setDraft((current) => {
                  if (!current.days.includes(day)) return { ...current, days: [...current.days, day] };
                  const workoutByDay = { ...current.workoutByDay };
                  delete workoutByDay[day];
                  return { ...current, days: current.days.filter((entry) => entry !== day), workoutByDay };
                });
                if (editingDay === day) setEditingDay(null);
              }} />
            );
          })}
        </View>
        <Copy>{draft.days.length === 0 ? 'En az bir antrenman günü seç.' : `Haftada ${draft.days.length} antrenman günü`}</Copy>
        {draftWeek.length > 0 && <Heading>Günlere antrenman seç</Heading>}
        {draftWeek.map(({ day, name, workout }) => (
          <View key={day} style={styles.day}>
            <Copy>{name} · {workout.title}{draft.workoutByDay?.[day] ? '' : ' (otomatik)'}</Copy>
            <Action title={editingDay === day ? 'Seçenekleri kapat' : `${name} antrenmanını değiştir`}
              secondary onPress={() => setEditingDay((open) => open === day ? null : day)} />
            {editingDay === day && (
              <>
                <Action title="Otomatik seç" secondary selected={!draft.workoutByDay?.[day]}
                  onPress={() => assignWorkout(day)} />
                {workouts[draft.location].map((option) => (
                  <Action key={option.id} title={option.title} selected={draft.workoutByDay?.[day] === option.id}
                    secondary={draft.workoutByDay?.[day] !== option.id} onPress={() => assignWorkout(day, option.id)} />
                ))}
              </>
            )}
          </View>
        ))}
        <Action title={unchanged ? 'Plan kaydedildi' : 'Planı kaydet'} disabled={draft.days.length === 0 || unchanged}
          onPress={() => update((current) => ({ ...current, weeklyPlan: draft }))} />
      </Card>
      {saved && buildWeek(saved).map((day) => <PlanDayCard key={day.day} day={day} title={day.name} />)}
    </>
  );
}

const styles = StyleSheet.create({
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  location: { flex: 1 },
  day: { gap: 8, paddingTop: 8 },
});
