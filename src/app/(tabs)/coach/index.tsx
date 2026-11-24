import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Card, colors, Copy, Heading, Screen } from '@/components/fitness-ui';
import { dateKey, useJournal } from '@/components/journal';
import { locations, workouts } from '@/constants/workouts';

export default function Coach() {
  const { journal } = useJournal();
  const [location, setLocation] = useState<(typeof locations)[number]['id']>('home');
  const completed = journal.workouts[dateKey()] ?? [];

  return (
    <Screen label="HAREKET" title="Antrenman" subtitle="Hareketleri izlemek için bir program seç.">
      <Heading>Antrenman yeri</Heading>
      <View style={styles.locations}>
        {locations.map(({ id, label }) => (
          <View key={id} style={styles.option}>
            <Action title={label} selected={location === id} secondary={location !== id} onPress={() => setLocation(id)} />
          </View>
        ))}
      </View>
      {workouts[location].map((workout) => (
        <Link key={workout.id} href={`/coach/${workout.id}` as Href} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={workout.title}
            style={({ pressed }) => pressed && styles.pressed}>
            <Card>
              <Heading>{workout.title}</Heading>
              <Copy>{workout.detail}</Copy>
              {completed.includes(workout.id) && <Copy>Bugün tamamlandı</Copy>}
              <Text style={styles.open}>Hareketleri aç →</Text>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  locations: { flexDirection: 'row', gap: 10 },
  option: { flex: 1 },
  pressed: { opacity: 0.75 },
  open: { color: colors.accent, fontWeight: '700' },
});
