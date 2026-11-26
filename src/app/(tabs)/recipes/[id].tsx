import { RecipePhoto } from '@/components/recipe-photo';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AccountRequired } from '@/components/account-required';
import { useAuth } from '@/components/auth-session';
import { Action, Card, Copy, Heading, Screen } from '@/components/fitness-ui';
import { addMeal, useJournal } from '@/components/journal';
import { recipes } from '@/constants/recipes';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account } = useAuth();
  const { ready, update, error, reload } = useJournal();
  const [addedId, setAddedId] = useState('');
  const [photoWidth, setPhotoWidth] = useState(0);
  const recipe = recipes.find((entry) => entry.id === id);

  function backToRecipes() {
    if (router.canGoBack()) router.back();
    else router.replace('/recipes');
  }

  if (!recipe) {
    return (
      <Screen label="BESLENME" title="Tarif bulunamadı" subtitle="Galeriden başka bir tarif seçebilirsin.">
        <Action secondary title="Tariflere dön" onPress={backToRecipes} />
      </Screen>
    );
  }

  return (
    <Screen label="TARİF" title={recipe.name} subtitle={`1 porsiyon · ${recipe.time} · yaklaşık ${recipe.calories} kcal · ${recipe.proteinGrams} g protein`}>
      <Action secondary title="Tariflere dön" onPress={backToRecipes} />
      <View onLayout={(event) => setPhotoWidth(Math.min(440, Math.floor(event.nativeEvent.layout.width)))}>
        {photoWidth > 0 && <RecipePhoto source={recipe.photo} size={photoWidth} detail />}
      </View>
      {error && <Card><Copy>{error}</Copy><Action title="Tekrar dene" onPress={reload} /></Card>}
      <Card>
        <Heading>Malzemeler</Heading>
        <Copy>{recipe.ingredients}</Copy>
        <Heading>Hazırlık</Heading>
        {recipe.steps.map((step, index) => <Copy key={step}>{index + 1}. {step}</Copy>)}
        {account ? <Action title="1 porsiyonu günlüğe ekle" disabled={!ready} onPress={() => {
          update((current) => addMeal(current, recipe.name, recipe.calories));
          setAddedId(recipe.id);
        }} /> : <AccountRequired action="1 porsiyonu günlüğe ekle" />}
        {addedId === recipe.id && <Copy>Bugünün günlüğüne eklendi.</Copy>}
      </Card>
    </Screen>
  );
}
