import { MealType as PrismaMealType } from "@prisma/client";

export type MealType = PrismaMealType;

export interface NutritionTargets {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface ConsumedNutrients {
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
}

export interface NutritionSummary {
  targets: NutritionTargets;
  consumed: ConsumedNutrients;
}

export interface FoodItemData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string | null;
  imageUrl?: string | null;
}

export interface MealData {
  id: string;
  name: string;
  mealType: MealType;
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string | null;
  notes?: string | null;
  foodItems: FoodItemData[];
}

export interface FoodFilters {
  dateRange?: { from?: Date; to?: Date };
  mealTypes?: MealType[];
  searchQuery?: string;
}

export type {
  FoodAnalysisResult,
  AnalyzedFoodItem,
} from "@/actions/ai/food-analysis";
