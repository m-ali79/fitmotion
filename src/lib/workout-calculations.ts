import { EffortLevel, Gender, WorkoutType } from "@prisma/client";
import { WORKOUT_MET_VALUES, EFFORT_MULTIPLIERS } from "@/types/workout";

//  Basal Metabolic Rate (BMR) Calculation
export function calculateBMR({
  weightKg,
  heightCm,
  age,
  sex,
}: {
  weightKg: number | null;
  heightCm: number | null;
  age: number | null;
  sex: Gender | null;
}): number | null {
  if (
    !weightKg ||
    !heightCm ||
    !age ||
    !sex ||
    weightKg <= 0 ||
    heightCm <= 0 ||
    age <= 0
  ) {
    return null;
  }

  return sex === Gender.male
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

// Workout Calorie Calculation
export function calculateWorkoutCalories({
  workoutType,
  duration,
  effortLevel,
  userWeightKg,
}: {
  workoutType: WorkoutType;
  duration: number;
  effortLevel: EffortLevel;
  userWeightKg: number | null;
}): number | null {
  if (!userWeightKg || userWeightKg <= 0 || duration <= 0) {
    return null;
  }

  const met = WORKOUT_MET_VALUES[workoutType];
  const baseMet = met ?? 3.0;

  const effortMultiplier = EFFORT_MULTIPLIERS[effortLevel] ?? 1.0;

  const caloriesPerMinute = (baseMet * userWeightKg * 3.5) / 200;

  const totalCalories = caloriesPerMinute * duration * effortMultiplier;

  return Math.round(totalCalories);
}
