"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Meal } from "@prisma/client";
import {
  startOfWeek,
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  subDays,
  isValid,
  differenceInCalendarDays,
} from "date-fns";
import {
  getStartDateFromRange,
  getPeriodDates,
  calculatePercentageChange,
  getDaysInRange,
} from "@/utils/progressUtils";

interface CalorieBalanceDataPoint {
  label: string;
  intake: number;
  goal: number | null;
}

/**
 * Fetches calorie intake data and the user's daily calorie goal,
 * aggregated appropriately (daily/weekly) for the specified date range.
 */
export async function getCalorieBalanceData(
  range: string = "all"
): Promise<CalorieBalanceDataPoint[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getCalorieBalanceData: User not authenticated");
    return [];
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, profile: { select: { dailyCalories: true } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userGoal = user.profile?.dailyCalories ?? null;

  const rangeStartDate = getStartDateFromRange(range);

  try {
    const meals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        date: rangeStartDate ? { gte: rangeStartDate } : undefined,
      },
      select: { date: true, calories: true },
      orderBy: { date: "asc" },
    });

    if (meals.length === 0 && range !== "all") {
      // If a specific range is selected and there are no meals,
      //  still return the date range with 0 intake and the goal line.
      const endDate = new Date();
      const startDate = rangeStartDate ? rangeStartDate : subDays(endDate, 1);

      if (!isValid(startDate) || !isValid(endDate)) {
        throw new Error("Invalid start/end date in meal data:");
      }

      const useDaily = range === "7d" || range === "30d";
      if (useDaily) {
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        return days.map((day) => ({
          label: format(day, "MMM d"),
          intake: 0,
          goal: userGoal,
        }));
      } else {
        const intervalStart = startOfWeek(startDate, { weekStartsOn: 1 });
        const intervalEnd = startOfWeek(endDate, { weekStartsOn: 1 });
        const weeks = eachWeekOfInterval(
          { start: intervalStart, end: intervalEnd },
          { weekStartsOn: 1 }
        );
        return weeks.map((weekStart) => ({
          label: `W/O ${format(weekStart, "MMM d")}`,
          intake: 0,
          goal: userGoal ? userGoal * 7 : null,
        }));
      }
    } else if (meals.length === 0) {
      return [];
    }

    const firstMealDate = meals[0].date;

    const lastDate =
      range === "all" ? meals[meals.length - 1].date : new Date();

    if (!isValid(firstMealDate) || !isValid(lastDate)) {
      throw new Error("Invalid start/end date in meal data");
    }

    const actualStartDate =
      rangeStartDate && rangeStartDate > firstMealDate
        ? rangeStartDate
        : firstMealDate;

    const useDailyGranularity = range === "7d" || range === "30d";

    const aggregatedIntake: Record<string, number> = {};
    for (const meal of meals) {
      const mealDate =
        typeof meal.date === "string" ? new Date(meal.date) : meal.date;
      if (!isValid(mealDate)) continue;

      let dateKey: string;
      if (useDailyGranularity) {
        dateKey = format(mealDate, "yyyy-MM-dd");
      } else {
        const weekStartDate = startOfWeek(mealDate, { weekStartsOn: 1 });
        dateKey = format(weekStartDate, "yyyy-MM-dd");
      }
      aggregatedIntake[dateKey] =
        (aggregatedIntake[dateKey] || 0) + meal.calories;
    }

    let formattedData: CalorieBalanceDataPoint[];
    if (useDailyGranularity) {
      const days = eachDayOfInterval({ start: actualStartDate, end: lastDate });
      formattedData = days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        return {
          label: format(day, "MMM d"),
          intake: aggregatedIntake[dateKey] || 0,
          goal: userGoal,
        };
      });
    } else {
      const intervalStart = startOfWeek(actualStartDate, { weekStartsOn: 1 });
      const intervalEnd = startOfWeek(lastDate, { weekStartsOn: 1 });
      const weeks = eachWeekOfInterval(
        { start: intervalStart, end: intervalEnd },
        { weekStartsOn: 1 }
      );
      formattedData = weeks.map((weekStartDate) => {
        const dateKey = format(weekStartDate, "yyyy-MM-dd");
        return {
          label: `W/O ${format(weekStartDate, "MMM d")}`,
          intake: aggregatedIntake[dateKey] || 0,
          goal: userGoal,
        };
      });
    }

    return formattedData;
  } catch (error) {
    console.error(
      `Error fetching calorie balance data (range: ${range}):`,
      error
    );
    return [];
  }
}

function calculateMacroStats(
  meals: Pick<Meal, "protein" | "carbs" | "fat">[]
): {
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatGrams: number;
  totalCaloriesFromMacros: number;
  proteinCaloriePercent: number;
  carbsCaloriePercent: number;
  fatCaloriePercent: number;
} {
  const totalProteinGrams = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbsGrams = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFatGrams = meals.reduce((sum, m) => sum + m.fat, 0);

  const caloriesFromProtein = totalProteinGrams * 4;
  const caloriesFromCarbs = totalCarbsGrams * 4;
  const caloriesFromFat = totalFatGrams * 9;
  const totalCaloriesFromMacros =
    caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;

  let proteinCaloriePercent =
    totalCaloriesFromMacros > 0
      ? Math.round((caloriesFromProtein / totalCaloriesFromMacros) * 100)
      : 0;
  let carbsCaloriePercent =
    totalCaloriesFromMacros > 0
      ? Math.round((caloriesFromCarbs / totalCaloriesFromMacros) * 100)
      : 0;
  let fatCaloriePercent =
    totalCaloriesFromMacros > 0
      ? Math.round((caloriesFromFat / totalCaloriesFromMacros) * 100)
      : 0;

  // rounding to ensure total is 100%
  const totalPercent =
    proteinCaloriePercent + carbsCaloriePercent + fatCaloriePercent;
  if (totalCaloriesFromMacros > 0 && totalPercent !== 100) {
    const diff = 100 - totalPercent;
    // difference to the largest component
    if (
      carbsCaloriePercent >= proteinCaloriePercent &&
      carbsCaloriePercent >= fatCaloriePercent
    ) {
      carbsCaloriePercent += diff;
    } else if (proteinCaloriePercent >= fatCaloriePercent) {
      proteinCaloriePercent += diff;
    } else {
      fatCaloriePercent += diff;
    }
  }

  return {
    totalProteinGrams,
    totalCarbsGrams,
    totalFatGrams,
    totalCaloriesFromMacros,
    proteinCaloriePercent,
    carbsCaloriePercent,
    fatCaloriePercent,
  };
}

export interface MacroDistributionDataPoint {
  name: "Protein" | "Carbs" | "Fat";
  grams: number;
  caloriePercent: number;
  changePercent: number | null;
}

export interface MacroDistributionSummary {
  totalCalories: number;
}

export interface MacroDistributionResult {
  distribution: MacroDistributionDataPoint[];
  summary: MacroDistributionSummary;
}

/**
 * Fetches macronutrient distribution (based on calories) for the user,
 * including comparison to the previous period.
 */
export async function getMacroDistributionData(
  range: string = "all"
): Promise<MacroDistributionResult> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getMacroDistributionData: User not authenticated");
    return { distribution: [], summary: { totalCalories: 0 } };
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodDates(range);

  try {
    const [currentMeals, previousMeals] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId: user.id,
          date: { gte: currentStart, lte: currentEnd },
        },
        select: { protein: true, carbs: true, fat: true },
      }),
      range !== "all" && previousStart && previousEnd
        ? prisma.meal.findMany({
            where: {
              userId: user.id,
              date: { gte: previousStart, lte: previousEnd },
            },
            select: { protein: true, carbs: true, fat: true },
          })
        : Promise.resolve([]),
    ]);

    const currentStats = calculateMacroStats(currentMeals);
    const previousStats = calculateMacroStats(previousMeals);

    if (currentStats.totalCaloriesFromMacros === 0) {
      return { distribution: [], summary: { totalCalories: 0 } };
    }

    const distribution: MacroDistributionDataPoint[] = [
      {
        name: "Protein",
        grams: Math.round(currentStats.totalProteinGrams),
        caloriePercent: currentStats.proteinCaloriePercent,
        changePercent:
          range !== "all"
            ? currentStats.proteinCaloriePercent -
              previousStats.proteinCaloriePercent
            : null,
      },
      {
        name: "Carbs",
        grams: Math.round(currentStats.totalCarbsGrams),
        caloriePercent: currentStats.carbsCaloriePercent,
        changePercent:
          range !== "all"
            ? currentStats.carbsCaloriePercent -
              previousStats.carbsCaloriePercent
            : null,
      },
      {
        name: "Fat",
        grams: Math.round(currentStats.totalFatGrams),
        caloriePercent: currentStats.fatCaloriePercent,
        changePercent:
          range !== "all"
            ? currentStats.fatCaloriePercent - previousStats.fatCaloriePercent
            : null,
      },
    ];

    const summary: MacroDistributionSummary = {
      totalCalories: Math.round(currentStats.totalCaloriesFromMacros),
    };

    return { distribution, summary };
  } catch (error) {
    console.error(
      `Error fetching macro distribution data (range: ${range}):`,
      error
    );
    return { distribution: [], summary: { totalCalories: 0 } };
  }
}

export interface NutritionSummaryStats {
  avgDailyCalories: number | null;
  avgDailyNetCalories: number | null;
  avgDailyProtein: number | null;
  avgDailyCarbs: number | null;
  avgDailyFat: number | null;
  // Comparison stats
  caloriesChangePercent: number | null | typeof Infinity;
  netCaloriesChangePercent: number | null | typeof Infinity; // Change in surplus/deficit
  proteinChangePercent: number | null | typeof Infinity;
  carbsChangePercent: number | null | typeof Infinity;
  fatChangePercent: number | null | typeof Infinity;
  userGoalCalories: number | null;
}

function calculateAverages(
  meals: Pick<Meal, "calories" | "protein" | "carbs" | "fat">[],
  periodDays: number
): {
  avgCalories: number | null;
  avgProtein: number | null;
  avgCarbs: number | null;
  avgFat: number | null;
} {
  if (periodDays <= 0) {
    return {
      avgCalories: null,
      avgProtein: null,
      avgCarbs: null,
      avgFat: null,
    };
  }
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  return {
    avgCalories: Math.round(totalCalories / periodDays),
    avgProtein: Math.round(totalProtein / periodDays),
    avgCarbs: Math.round(totalCarbs / periodDays),
    avgFat: Math.round(totalFat / periodDays),
  };
}

/**
 * Fetches summary statistics for nutrition, including averages and comparisons.
 */
export async function getNutritionSummaryStats(
  range: string = "all"
): Promise<NutritionSummaryStats> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getNutritionSummaryStats: User not authenticated");
    return {
      avgDailyCalories: null,
      avgDailyNetCalories: null,
      avgDailyProtein: null,
      avgDailyCarbs: null,
      avgDailyFat: null,
      caloriesChangePercent: null,
      netCaloriesChangePercent: null,
      proteinChangePercent: null,
      carbsChangePercent: null,
      fatChangePercent: null,
      userGoalCalories: null,
    };
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, profile: { select: { dailyCalories: true } } },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const userGoalCalories = user.profile?.dailyCalories ?? null;
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodDates(range);

  // Determine number of days in each period
  let currentPeriodDays = 0;
  let previousPeriodDays = 0;

  try {
    // Fetch all meals for the current period determination
    const allMealsForPeriod = await prisma.meal.findMany({
      where: {
        userId: user.id,
        date: { gte: currentStart, lte: currentEnd },
      },
      select: {
        date: true, // Need date to determine actual range for 'all'
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
      orderBy: { date: "asc" },
    });

    // Calculate current period days based on actual data if 'all' range
    if (range === "all" && allMealsForPeriod.length > 0) {
      const actualFirstDate = allMealsForPeriod[0].date;
      const actualLastDate =
        allMealsForPeriod[allMealsForPeriod.length - 1].date;
      currentPeriodDays =
        differenceInCalendarDays(actualLastDate, actualFirstDate) + 1;
    } else if (range !== "all") {
      currentPeriodDays = getDaysInRange(currentStart, currentEnd);
    }
    currentPeriodDays = Math.max(0, currentPeriodDays); // Ensure non-negative

    // Fetch previous period meals only if needed
    const previousMeals = await (async () => {
      if (range !== "all" && previousStart && previousEnd) {
        previousPeriodDays = getDaysInRange(previousStart, previousEnd);
        previousPeriodDays = Math.max(0, previousPeriodDays);
        return prisma.meal.findMany({
          where: {
            userId: user.id,
            date: { gte: previousStart, lte: previousEnd },
          },
          select: { calories: true, protein: true, carbs: true, fat: true },
        });
      } else {
        previousPeriodDays = 0;
        return [];
      }
    })();

    // Calculate averages using allMealsForPeriod for current stats
    const currentAvgs = calculateAverages(allMealsForPeriod, currentPeriodDays);
    const previousAvgs = calculateAverages(previousMeals, previousPeriodDays);

    // Calculate net calories for current period
    const avgDailyNetCalories =
      userGoalCalories !== null && currentAvgs.avgCalories !== null
        ? currentAvgs.avgCalories - userGoalCalories
        : null;

    // Calculate percentage changes
    let caloriesChangePercent: number | null | typeof Infinity = null;
    const netCaloriesChangePercent: number | null | typeof Infinity = null;
    let proteinChangePercent: number | null | typeof Infinity = null;
    let carbsChangePercent: number | null | typeof Infinity = null;
    let fatChangePercent: number | null | typeof Infinity = null;

    if (range !== "all") {
      caloriesChangePercent = calculatePercentageChange(
        currentAvgs.avgCalories ?? 0,
        previousAvgs.avgCalories ?? 0
      );
      proteinChangePercent = calculatePercentageChange(
        currentAvgs.avgProtein ?? 0,
        previousAvgs.avgProtein ?? 0
      );
      carbsChangePercent = calculatePercentageChange(
        currentAvgs.avgCarbs ?? 0,
        previousAvgs.avgCarbs ?? 0
      );
      fatChangePercent = calculatePercentageChange(
        currentAvgs.avgFat ?? 0,
        previousAvgs.avgFat ?? 0
      );
    }

    return {
      avgDailyCalories: currentAvgs.avgCalories,
      avgDailyNetCalories: avgDailyNetCalories,
      avgDailyProtein: currentAvgs.avgProtein,
      avgDailyCarbs: currentAvgs.avgCarbs,
      avgDailyFat: currentAvgs.avgFat,
      caloriesChangePercent,
      netCaloriesChangePercent,
      proteinChangePercent,
      carbsChangePercent,
      fatChangePercent,
      userGoalCalories,
    };
  } catch (error) {
    console.error(
      `Error fetching nutrition summary stats (range: ${range}):`,
      error
    );
    return {
      avgDailyCalories: null,
      avgDailyNetCalories: null,
      avgDailyProtein: null,
      avgDailyCarbs: null,
      avgDailyFat: null,
      caloriesChangePercent: null,
      netCaloriesChangePercent: null,
      proteinChangePercent: null,
      carbsChangePercent: null,
      fatChangePercent: null,
      userGoalCalories: null,
    };
  }
}
