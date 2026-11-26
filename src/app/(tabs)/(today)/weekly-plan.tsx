import { router } from 'expo-router';
import { AccountRequired } from '@/components/account-required';
import { useAuth } from '@/components/auth-session';
import { Action, Card, Copy, Screen } from '@/components/fitness-ui';
import { useJournal } from '@/components/journal';
import { WeeklyPlanEditor } from '@/components/weekly-plan-editor';

export default function WeeklyPlan() {
  const { ready, error, reload } = useJournal();
  const { account } = useAuth();

  return (
    <Screen label="PROGRAM" title="Haftalık plan" subtitle="Antrenman yerini ve günlerini seç, haftalık programını düzenle.">
      <Action secondary title="Bugün’e dön" onPress={() => router.dismissTo('/')} />
      {error !== '' && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      {!account && <Card><AccountRequired /></Card>}
      {account && ready && <WeeklyPlanEditor />}
    </Screen>
  );
}
