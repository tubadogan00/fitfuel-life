import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  background: '#101513', card: '#19221e', line: '#34443b',
  text: '#f3f7ef', muted: '#b4c4b8', accent: '#c4f77a',
};

export function Screen({ label, title, subtitle, children }: PropsWithChildren<{
  label: string; title: string; subtitle: string;
}>) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={styles.page}>
        <View style={styles.heading}>
          <Text style={styles.label}>{label}</Text>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Copy>{subtitle}</Copy>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function Heading({ children }: PropsWithChildren) {
  return <Text accessibilityRole="header" style={styles.section}>{children}</Text>;
}

export function Copy({ children }: PropsWithChildren) {
  return <Text style={styles.copy}>{children}</Text>;
}

export function Action({ title, onPress, secondary = false, disabled = false, selected }: {
  title: string; onPress: () => void; secondary?: boolean; disabled?: boolean; selected?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled, selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.faded]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.copy}>{label}</Text>
      <TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.muted} style={styles.field} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 14 },
  heading: { gap: 8, marginBottom: 8 },
  label: { color: colors.accent, fontSize: 13, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 42, fontWeight: '800', letterSpacing: -1.5 },
  section: { color: colors.text, fontSize: 21, fontWeight: '700' },
  copy: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: 22, padding: 18, gap: 10 },
  button: { backgroundColor: colors.accent, minHeight: 46, justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 12 },
  buttonText: { color: colors.background, fontWeight: '800', textAlign: 'center' },
  secondary: { backgroundColor: colors.background, borderColor: colors.line, borderWidth: 1 },
  secondaryText: { color: colors.accent },
  faded: { opacity: 0.6 },
  fieldGroup: { gap: 5 },
  field: { color: colors.text, backgroundColor: colors.background, borderColor: colors.line, borderWidth: 1, minHeight: 46, padding: 12, borderRadius: 12 },
});
