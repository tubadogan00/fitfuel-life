export type MealFood = {
  name: string;
  grams: number;
  kcalPer100g: number;
  proteinPer100g: number;
};

export const maxFoods = 12;
export const maxPhotoLength = 3_000_000;

export function isMealFood(value: unknown): value is MealFood {
  if (typeof value !== 'object' || value === null) return false;
  const food = value as Partial<MealFood>;
  return typeof food.name === 'string' && food.name.trim().length > 0 && food.name.length <= 80 &&
    typeof food.grams === 'number' && food.grams > 0 && food.grams <= 5000 &&
    typeof food.kcalPer100g === 'number' && food.kcalPer100g >= 0 && food.kcalPer100g <= 1000 &&
    typeof food.proteinPer100g === 'number' && food.proteinPer100g >= 0 && food.proteinPer100g <= 100;
}

export function mealTotals(foods: MealFood[]) {
  const raw = foods.reduce((sum, food) => ({
    calories: sum.calories + food.kcalPer100g * food.grams / 100,
    proteinGrams: sum.proteinGrams + food.proteinPer100g * food.grams / 100,
  }), { calories: 0, proteinGrams: 0 });

  return {
    calories: Math.round(raw.calories),
    proteinGrams: Math.round(raw.proteinGrams * 10) / 10,
  };
}
