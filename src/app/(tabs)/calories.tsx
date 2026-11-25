import { useState } from 'react';
import { Action, Card, Copy, Field, Heading, Screen } from '@/components/fitness-ui';
import { addMeal, dateKey, useJournal } from '@/components/journal';
import { PhotoMeal } from '@/components/photo-meal';
import { mealTotals } from '@/utils/meal-nutrition';

function positiveInteger(value: string) {
  const number = Number(value);
  return /^\d+$/.test(value.trim()) && Number.isSafeInteger(number) && number > 0 ? number : null;
}

export default function Calories() {
  const { journal, update, ready, error, reload } = useJournal();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState('');
  const [offset, setOffset] = useState(0);
  const selected = new Date();
  selected.setDate(selected.getDate() + offset);
  const meals = journal.meals.filter((meal) => meal.date === dateKey(selected));
  const total = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const mealCalories = positiveInteger(calories);
  const dailyGoal = positiveInteger(goal);

  return (
    <Screen label="BESLENME" title="Kalori günlüğü" subtitle="Öğünlerini kaydet ve günlük toplamını gör.">
      {error && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      <Card>
        <Heading>Günlük hedef</Heading>
        <Copy>{journal.goal ? `${journal.goal} kcal` : 'Henüz hedef belirlenmedi.'}</Copy>
        <Field label="Hedef (kcal)" value={goal} onChangeText={setGoal} keyboardType="number-pad" maxLength={6} />
        <Action secondary title="Hedefi kaydet" disabled={!ready || dailyGoal === null} onPress={() => {
          if (dailyGoal === null) return;
          update((current) => ({ ...current, goal: dailyGoal }));
          setGoal('');
        }} />
        {journal.goal !== null && (
          <Action secondary title="Hedefi kaldır" disabled={!ready} onPress={() => update((current) => ({ ...current, goal: null }))} />
        )}
      </Card>
      <Card>
        <Heading>Fotoğrafla öğün ekle</Heading>
        <PhotoMeal ready={ready} onSave={(mealName, foods) => {
          const { calories: estimatedCalories, proteinGrams } = mealTotals(foods);
          update((current) => addMeal(current, mealName, estimatedCalories, { proteinGrams, foods }));
          setOffset(0);
        }} />
      </Card>
      <Card>
        <Heading>Bugüne öğün ekle</Heading>
        <Field label="Öğün adı" value={name} onChangeText={setName} maxLength={80} />
        <Field label="Kalori (kcal)" value={calories} onChangeText={setCalories} keyboardType="number-pad" maxLength={6} />
        <Action title="Öğünü ekle" disabled={!ready || !name.trim() || mealCalories === null} onPress={() => {
          if (!name.trim() || mealCalories === null) return;
          update((current) => addMeal(current, name.trim(), mealCalories));
          setName('');
          setCalories('');
          setOffset(0);
        }} />
      </Card>
      <Card>
        <Heading>{offset === 0 ? 'Bugün' : selected.toLocaleDateString('tr-TR')}</Heading>
        <Copy>{ready ? `Toplam ${total} kcal` : 'Yükleniyor…'}</Copy>
        <Action secondary title="Önceki gün" onPress={() => setOffset((value) => value - 1)} />
        {offset < 0 && <Action secondary title="Sonraki gün" onPress={() => setOffset((value) => value + 1)} />}
        {ready && meals.length === 0 && <Copy>Bu güne ait öğün kaydı yok.</Copy>}
      </Card>
      {meals.map((meal) => (
        <Card key={meal.id}>
          <Heading>{meal.name}</Heading>
          <Copy>{meal.calories} kcal{meal.proteinGrams !== undefined ? ` · ${meal.proteinGrams} g protein` : ''}</Copy>
          {meal.foods?.map((food, index) => <Copy key={index}>{food.name} · {food.grams} g</Copy>)}
          <Action secondary title={`${meal.name} kaydını sil`} onPress={() =>
            update((current) => ({ ...current, meals: current.meals.filter((entry) => entry.id !== meal.id) }))
          } />
        </Card>
      ))}
    </Screen>
  );
}
