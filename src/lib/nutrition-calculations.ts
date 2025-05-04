interface MealNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const calculateDailyConsumption = (meals: MealNutrients[]) => {
  return meals.reduce(
    (totals, meal) => {
      totals.consumedCalories += meal.calories;
      totals.consumedProtein += meal.protein;
      totals.consumedCarbs += meal.carbs;
      totals.consumedFat += meal.fat;
      return totals;
    },
    {
      consumedCalories: 0,
      consumedProtein: 0,
      consumedCarbs: 0,
      consumedFat: 0,
    }
  );
};
