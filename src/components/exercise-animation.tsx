import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseFrames, type ExerciseMotion } from '@/constants/exercise-motions';

export function ExerciseAnimation({ movement, playing }: { movement: ExerciseMotion; playing: boolean }) {
  const [showEnd, setShowEnd] = useState(false);
  const [start, end] = exerciseFrames[movement];

  useEffect(() => {
    if (!playing) return;

    const isCardio = movement === 'walk' || movement === 'treadmill' || movement === 'bike';
    const timer = setInterval(() => setShowEnd((current) => !current), isCardio ? 420 : 850);
    return () => clearInterval(timer);
  }, [movement, playing]);

  return (
    <View style={styles.frame} aria-hidden>
      <Image source={start} contentFit="contain" style={styles.photo} />
      <Image source={end} contentFit="contain" style={[styles.photo, !showEnd && styles.hidden]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    height: 260,
    backgroundColor: '#f2e8de',
    borderRadius: 15,
    overflow: 'hidden',
  },
  photo: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  hidden: { opacity: 0 },
});
