import { Image, type ImageSource } from 'expo-image';
import { StyleSheet } from 'react-native';
import { colors } from '@/components/fitness-ui';

export function RecipePhoto({ source, size, detail = false }: {
  source: ImageSource | number;
  size: number;
  detail?: boolean;
}) {
  return (
    <Image
      source={source}
      contentFit="cover"
      style={[styles.photo, detail && styles.detail, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  photo: { flexShrink: 0, backgroundColor: colors.line },
  detail: { alignSelf: 'center', borderRadius: 20 },
});
