import { recipes } from '@/constants/recipes';
import { weeklyWorkouts, workouts, type WorkoutLocation } from '@/constants/workouts';

export type WeeklyPlan = {
  location: WorkoutLocation;
  days: number[];
  workoutByDay?: Partial<Record<number, string>>;
};

export const weekdays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const meals = recipes.filter((recipe) => recipe.afterWorkoutMeal);

export function buildWeek(plan: WeeklyPlan) {
  const programs = weeklyWorkouts[plan.location];
  return weekdays
    .map((name, day) => ({ name, day }))
    .filter(({ day }) => plan.days.includes(day))
    .map((entry, index) => ({
      ...entry,
      workout: workouts[plan.location].find((workout) => workout.id === plan.workoutByDay?.[entry.day])
        ?? programs[index % programs.length],
      meal: meals[index % meals.length],
    }));
}

export type PlanDay = ReturnType<typeof buildWeek>[number];

export function weekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}
