import { isMealFood, type MealFood } from './meal-nutrition';
import type { WeeklyPlan } from './weekly-plan';

export type MealNutrition = { proteinGrams: number; foods: MealFood[] };
export type Meal = { id: string; date: string; name: string; calories: number } & Partial<MealNutrition>;
export type Journal = { goal: number | null; meals: Meal[]; workouts: Record<string, string[]>; weeklyPlan?: WeeklyPlan };

export const emptyJournal: Journal = { goal: null, meals: [], workouts: {} };
export const maxJournalRequest = 8 * 1024 * 1024;

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validDate(value: unknown) {
  return typeof value === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
}

function validId(value: unknown) {
  return typeof value === 'string' && /^[a-z0-9-]{1,100}$/i.test(value);
}

function validNonNegative(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function validPlan(value: unknown) {
  if (!object(value) || (value.location !== 'home' && value.location !== 'gym') ||
    !Array.isArray(value.days) || value.days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) return false;
  return value.workoutByDay === undefined || (object(value.workoutByDay) &&
    Object.entries(value.workoutByDay).every(([day, id]) => /^[0-6]$/.test(day) && validId(id)));
}

export function isJournal(value: unknown): value is Journal {
  if (!object(value) || (value.goal !== null && !validNonNegative(value.goal)) ||
    !Array.isArray(value.meals) || !object(value.workouts)) return false;
  return value.meals.every((meal) => object(meal) && validId(meal.id) && validDate(meal.date) &&
    typeof meal.name === 'string' && meal.name.trim().length > 0 && meal.name.length <= 160 &&
    validNonNegative(meal.calories) && (meal.proteinGrams === undefined || validNonNegative(meal.proteinGrams)) &&
    (meal.foods === undefined || (Array.isArray(meal.foods) && meal.foods.every(isMealFood)))) &&
    Object.entries(value.workouts).every(([date, ids]) => validDate(date) && Array.isArray(ids) && ids.every(validId)) &&
    (value.weeklyPlan === undefined || validPlan(value.weeklyPlan));
}

function equal(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => equal(item, right[index]));
  }
  if (!object(left) || !object(right)) return false;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every((key) => Object.hasOwn(right, key) && equal(left[key], right[key]));
}

function mergeItems<T>(base: T[], local: T[], remote: T[], key: (item: T) => string) {
  const baseItems = new Map(base.map((item) => [key(item), item]));
  const localItems = new Map(local.map((item) => [key(item), item]));
  const result = new Map(remote.map((item) => [key(item), item]));
  for (const id of new Set([...baseItems.keys(), ...localItems.keys()])) {
    const item = localItems.get(id);
    if (equal(baseItems.get(id), item)) continue;
    if (item === undefined) result.delete(id);
    else result.set(id, item);
  }
  return [...result.values()];
}

// Apply only changes made on this device since its last successful synchronization.
export function mergeJournal(base: Journal, local: Journal, remote: Journal): Journal {
  const workouts = { ...remote.workouts };
  for (const date of new Set([...Object.keys(base.workouts), ...Object.keys(local.workouts)])) {
    const ids = mergeItems(base.workouts[date] ?? [], local.workouts[date] ?? [], remote.workouts[date] ?? [], (id) => id);
    if (ids.length) workouts[date] = ids;
    else delete workouts[date];
  }

  const weeklyPlan = equal(base.weeklyPlan, local.weeklyPlan) ? remote.weeklyPlan : local.weeklyPlan;
  return {
    goal: base.goal === local.goal ? remote.goal : local.goal,
    meals: mergeItems(base.meals, local.meals, remote.meals, (meal) => meal.id),
    workouts,
    ...(weeklyPlan && { weeklyPlan }),
  };
}
