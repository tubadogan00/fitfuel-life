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
  const rows = Array.from({ length: Math.ceil(matches.length / 2) }, (_, index) =>
    matches.slice(index * 2, index * 2 + 2),
  );

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
        {cardSize > 0 && rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((recipe) => (
              <View key={recipe.id} style={[styles.column, { width: cardSize }]}>
                <Link href={`/recipes/${recipe.id}` as Href} asChild>
                  <Pressable accessibilityLabel={recipe.name} style={styles.card}>
                    <RecipePhoto source={recipe.photo} size={cardSize} />
                    <Text style={styles.name}>{recipe.name}</Text>
                  </Pressable>
                </Link>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { gap: gridGap, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'stretch', columnGap: gridGap },
  column: { flexShrink: 0 },
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' },
  name: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '700', padding: 12, minHeight: 68 },
});
