import { RecipePhoto } from '@/components/recipe-photo';
import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, colors, Copy, Field, Screen } from '@/components/fitness-ui';
import { recipes } from '@/constants/recipes';

const gridGap = 14;

function searchable(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

export default function Recipes() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [gridWidth, setGridWidth] = useState(0);
  const cardSize = Math.max(0, Math.floor((gridWidth - gridGap) / 2));
  const terms = searchable(query).trim().split(/\s+/).filter(Boolean);
  const matches = recipes.filter((recipe) => {
    const text = searchable(`${recipe.name} ${recipe.ingredients}`);
    return terms.every((term) => text.includes(term));
  });

  return (
    <Screen label="BESLENME" title="Sağlıklı tarifler" subtitle="Tarifin fotoğrafına dokunarak malzemeleri ve hazırlık adımlarını gör.">
      <Field label="Tarif veya malzeme ara" value={input} onChangeText={setInput}
        placeholder="Örn. yulaf, nohut" returnKeyType="search" onSubmitEditing={() => setQuery(input)} />
      <Action title="Ara" onPress={() => setQuery(input)} />
      {query.trim() !== '' && <Action secondary title="Aramayı temizle" onPress={() => {
        setInput('');
        setQuery('');
      }} />}
      <Copy>{matches.length === 0 ? 'Aramana uygun tarif bulunamadı.' : `${matches.length} tarif`}</Copy>
      <View style={styles.grid} onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}>
        {cardSize > 0 && matches.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}` as Href} asChild>
            <Pressable accessibilityLabel={recipe.name} style={({ pressed }) => [styles.card, { width: cardSize }, pressed && styles.pressed]}>
              <RecipePhoto source={recipe.photo} size={cardSize} />
              <Text style={styles.name}>{recipe.name}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: gridGap, width: '100%' },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' },
  pressed: { opacity: 0.75 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', padding: 12 },
});
