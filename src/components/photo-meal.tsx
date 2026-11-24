import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { sessionHeaders } from '@/components/auth-session';
import { Action, colors, Copy, Field, Heading } from '@/components/fitness-ui';
import { isMealFood, maxFoods, maxPhotoLength, mealTotals, type MealFood } from '@/utils/meal-nutrition';

type FoodDraft = { id: number; name: string; grams: string; kcalPer100g: string; proteinPer100g: string };

function numberFromInput(value: string) {
  return /^\d+(?:[.,]\d+)?$/.test(value.trim()) ? Number(value.trim().replace(',', '.')) : NaN;
}

function toFood(draft: FoodDraft): MealFood {
  return {
    name: draft.name.trim(),
    grams: numberFromInput(draft.grams),
    kcalPer100g: numberFromInput(draft.kcalPer100g),
    proteinPer100g: numberFromInput(draft.proteinPer100g),
  };
}

async function preparePhoto(asset: ImagePicker.ImagePickerAsset) {
  const context = ImageManipulator.manipulate(asset.uri);
  try {
    if (Math.max(asset.width, asset.height) > 1024) {
      context.resize(asset.width >= asset.height ? { width: 1024 } : { height: 1024 });
    }
    const image = await context.renderAsync();
    try {
      return (await image.saveAsync({ base64: true, format: SaveFormat.JPEG, compress: 0.78 })).base64;
    } finally {
      image.release();
    }
  } finally {
    context.release();
  }
}

export function PhotoMeal({ ready, onSave }: {
  ready: boolean;
  onSave: (name: string, foods: MealFood[]) => void;
}) {
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [drafts, setDrafts] = useState<FoodDraft[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<'picker' | 'analysis' | null>(null);
  const inProgress = useRef(false);
  const nextId = useRef(0);

  const foods = drafts.map(toFood);
  const valid = foods.length > 0 && foods.every(isMealFood);
  const totals = mealTotals(foods.filter(isMealFood));

  function clear() {
    setPhoto(null);
    setDrafts([]);
    setName('');
    setError('');
    setMessage('');
  }

  async function selectPhoto(source: 'camera' | 'library') {
    if (inProgress.current) return;
    inProgress.current = true;
    setBusy('picker');
    setError('');
    setMessage('');
    try {
      if (source === 'camera' && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Fotoğraf çekmek için cihaz ayarlarından kamera iznini açabilir veya galeriden seçebilirsin.');
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], exif: false };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0]);
        setDrafts([]);
        setName('');
      }
    } catch {
      setError('Fotoğraf açılamadı. Galeriden başka bir fotoğraf seçebilirsin.');
    } finally {
      inProgress.current = false;
      setBusy(null);
    }
  }

  async function analyzePhoto() {
    if (!photo || inProgress.current) return;
    inProgress.current = true;
    setBusy('analysis');
    setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const data = await preparePhoto(photo);
      if (!data || data.length > maxPhotoLength) {
        setError('Fotoğraf hazırlanamadı. Daha küçük bir görsel seçip tekrar dene.');
        return;
      }

      const response = await fetch('/meal-photo', {
        method: 'POST',
        headers: { ...await sessionHeaders(), 'Content-Type': 'text/plain' },
        body: data,
        signal: controller.signal,
      });
      const result = await response.json() as { foods?: unknown; error?: string };
      if (!response.ok) {
        setError(result.error ?? 'Fotoğraf analizi tamamlanamadı.');
        return;
      }
      if (!Array.isArray(result.foods) || result.foods.length === 0 ||
        result.foods.length > maxFoods || !result.foods.every(isMealFood)) {
        setError('Öğün analizi okunamadı. Tekrar deneyebilirsin.');
        return;
      }

      const detectedFoods = result.foods;
      setName(detectedFoods.map((food) => food.name).join(', ').slice(0, 80));
      setDrafts(detectedFoods.map((food) => ({
        id: nextId.current++,
        name: food.name,
        grams: String(food.grams),
        kcalPer100g: String(food.kcalPer100g),
        proteinPer100g: String(food.proteinPer100g),
      })));
    } catch {
      setError('Analiz sunucusuna bağlanılamadı. Expo sunucusunun açık olduğunu kontrol edip tekrar dene.');
    } finally {
      clearTimeout(timeout);
      inProgress.current = false;
      setBusy(null);
    }
  }

  function changeFood(id: number, field: keyof Omit<FoodDraft, 'id'>, value: string) {
    setDrafts((current) => current.map((food) => food.id === id ? { ...food, [field]: value } : food));
  }

  return (
    <>
      <Action secondary title="Fotoğraf çek" disabled={busy !== null} onPress={() => selectPhoto('camera')} />
      <Action secondary title="Galeriden seç" disabled={busy !== null} onPress={() => selectPhoto('library')} />
      {photo && (
        <>
          <Image source={photo.uri} accessibilityLabel="Seçilen öğün fotoğrafı" contentFit="contain" style={styles.preview} />
          {drafts.length === 0 && (
            <>
              <Copy>Analiz için seçtiğin fotoğraf Google Gemini’ye gönderilir.</Copy>
              <Action title={busy === 'analysis' ? 'Öğün analiz ediliyor…' : 'Fotoğrafı analiz et'}
                disabled={busy !== null} onPress={analyzePhoto} />
            </>
          )}
          <Action secondary title="Fotoğrafı kaldır" disabled={busy !== null} onPress={clear} />
        </>
      )}
      {error !== '' && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{error}</Text>}
      {message !== '' && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{message}</Text>}
      {drafts.length > 0 && (
        <>
          <Heading>Öğün tahmini</Heading>
          <Copy>Porsiyonları kontrol et. Gramajı değiştirince kalori ve protein toplamı yeniden hesaplanır.</Copy>
          <Field label="Öğün adı" value={name} onChangeText={setName} maxLength={80} />
          {drafts.map((food, index) => {
            const portion = foods[index];
            const estimate = isMealFood(portion) ? mealTotals([portion]) : null;
            return (
              <View key={food.id} style={styles.food}>
                <Field label="Yiyecek adı" value={food.name} onChangeText={(value) => changeFood(food.id, 'name', value)} maxLength={80} />
                <Field label="Porsiyon (gram)" value={food.grams} onChangeText={(value) => changeFood(food.id, 'grams', value)}
                  keyboardType="decimal-pad" maxLength={8} />
                <Field label="100 g başına kalori (kcal)" value={food.kcalPer100g}
                  onChangeText={(value) => changeFood(food.id, 'kcalPer100g', value)} keyboardType="decimal-pad" maxLength={8} />
                <Field label="100 g başına protein (g)" value={food.proteinPer100g}
                  onChangeText={(value) => changeFood(food.id, 'proteinPer100g', value)} keyboardType="decimal-pad" maxLength={8} />
                {estimate && <Copy>Porsiyon yaklaşık {estimate.calories} kcal · {estimate.proteinGrams} g protein</Copy>}
                <Action secondary title="Yiyeceği çıkar"
                  onPress={() => setDrafts((current) => current.filter((entry) => entry.id !== food.id))} />
              </View>
            );
          })}
          <Action secondary title="Başka yiyecek ekle" disabled={drafts.length >= maxFoods} onPress={() => {
            const id = nextId.current++;
            setDrafts((current) => [...current, { id, name: '', grams: '', kcalPer100g: '', proteinPer100g: '' }]);
          }} />
          {valid
            ? <Heading>Yaklaşık {totals.calories} kcal · {totals.proteinGrams} g protein</Heading>
            : <Copy>Toplamı görmek için her yiyeceğin adını ve besin değerlerini doldur.</Copy>}
          <Action title="Öğünü günlüğe kaydet" disabled={!ready || !valid || !name.trim()} onPress={() => {
            if (!ready || !valid || !name.trim()) return;
            onSave(name.trim(), foods);
            clear();
            setMessage('Öğün bugünün günlüğüne eklendi.');
          }} />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  preview: { width: '100%', height: 220, borderRadius: 12, backgroundColor: colors.background },
  food: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 12, gap: 8 },
  feedback: { color: colors.text, fontSize: 15, lineHeight: 22 },
});
