"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  getPeriodDates,
  calculatePercentageChange,
  getStartDateFromRange,
} from "@/utils/progressUtils";
import { WeightEntry } from "@prisma/client";
import {
  format,
  startOfWeek,
  eachWeekOfInterval,
  eachDayOfInterval,
  isValid,
} from "date-fns";

/**
 * Calculates BMI given weight in kg and height in cm.
 */
function calculateBMI(
  weightKg: number,
  heightCm: number | null
): number | null {
  if (!heightCm || heightCm <= 0 || weightKg <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

export interface WeightSummaryStats {
  startingWeight: number | null;
  currentWeight: number | null;
  totalChangeKg: number | null;
  bmi: number | null;
  weightChangePercent: number | null | typeof Infinity;
  bmiChangePercent: number | null | typeof Infinity;
}

/**
 * Fetches the last weight entry within a given date range.
 */
async function getLastWeightEntry(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<WeightEntry | null> {
  return prisma.weightEntry.findFirst({
    where: { userId, date: { gte: startDate, lte: endDate } },
    orderBy: { date: "desc" },
  });
}

/**
 * Fetches summary statistics for weight progress.
 */
export async function getWeightSummaryStats(
  range: string = "all"
): Promise<WeightSummaryStats> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWeightSummaryStats: User not authenticated");
    return {
      startingWeight: null,
      currentWeight: null,
      totalChangeKg: null,
      bmi: null,
      weightChangePercent: null,
      bmiChangePercent: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, height: true, weight: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const startingWeight = user.weight ?? null;

  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodDates(range);

  try {
    const [currentLastEntry, previousLastEntry] = await Promise.all([
      getLastWeightEntry(user.id, currentStart, currentEnd),
      range !== "all" && previousStart && previousEnd
        ? getLastWeightEntry(user.id, previousStart, previousEnd)
        : Promise.resolve(null),
    ]);
    const currentWeight = currentLastEntry?.weightKg ?? null;

    const totalChangeKg =
      startingWeight !== null && currentWeight !== null
        ? parseFloat((currentWeight - startingWeight).toFixed(1))
        : null;

    const currentBmi = currentWeight
      ? calculateBMI(currentWeight, user.height)
      : null;

    const previousWeight = previousLastEntry?.weightKg ?? null;
    const previousBmi = previousWeight
      ? calculateBMI(previousWeight, user.height)
      : null;

    let weightChangePercent: number | null | typeof Infinity = null;
    let bmiChangePercent: number | null | typeof Infinity = null;

    if (range !== "all") {
      weightChangePercent = calculatePercentageChange(
        currentWeight,
        previousWeight
      );
      bmiChangePercent = calculatePercentageChange(currentBmi, previousBmi);
    }

    return {
      startingWeight,
      currentWeight,
      totalChangeKg,
      bmi: currentBmi,
      weightChangePercent,
      bmiChangePercent,
    };
  } catch (error) {
    console.error(
      `Error fetching weight summary stats (range: ${range}):`,
      error
    );
    return {
      startingWeight: startingWeight,
      currentWeight: null,
      totalChangeKg: null,
      bmi: null,
      weightChangePercent: null,
      bmiChangePercent: null,
    };
  }
}

export interface WeightTrendDataPoint {
  label: string; // e.g., "Oct 21" or "W/O Oct 21"
  weight: number | null; // Average or recorded weight for the period
  bmi: number | null; // Calculated BMI for the period
}

/**
 * Fetches weight data aggregated appropriately (daily/weekly)
 * for the authenticated user within a specified date range.
 */
export async function getWeightTrendData(
  range: string = "all"
): Promise<WeightTrendDataPoint[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWeightTrendData: User not authenticated");
    return [];
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, height: true }, // Need height for BMI
  });
  if (!user) {
    throw new Error("User not found");
  }

  const rangeStartDate = getStartDateFromRange(range);

  try {
    const weightEntries = await prisma.weightEntry.findMany({
      where: {
        userId: user.id,
        date: rangeStartDate ? { gte: rangeStartDate } : undefined,
      },
      select: { date: true, weightKg: true },
      orderBy: { date: "asc" },
    });

    if (weightEntries.length === 0) {
      return [];
    }

    const firstEntryDate = weightEntries[0].date;
    const lastEntryDate = weightEntries[weightEntries.length - 1].date;

    if (!isValid(firstEntryDate) || !isValid(lastEntryDate)) {
      throw new Error("Invalid start/end date in weight entries");
    }

    const useDailyGranularity = range === "7d" || range === "30d";

    // Aggregate weight and count entries per period (day or week)
    const aggregatedData: Record<
      string,
      { totalWeight: number; count: number }
    > = {};
    for (const entry of weightEntries) {
      const entryDate =
        typeof entry.date === "string" ? new Date(entry.date) : entry.date;
      if (!isValid(entryDate)) continue;

      let dateKey: string;
      if (useDailyGranularity) {
        dateKey = format(entryDate, "yyyy-MM-dd");
      } else {
        const weekStartDate = startOfWeek(entryDate, { weekStartsOn: 1 });
        dateKey = format(weekStartDate, "yyyy-MM-dd");
      }

      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { totalWeight: 0, count: 0 };
      }
      aggregatedData[dateKey].totalWeight += entry.weightKg;
      aggregatedData[dateKey].count += 1;
    }

    // Create data points for the chart
    let formattedData: WeightTrendDataPoint[];
    if (useDailyGranularity) {
      const days = eachDayOfInterval({
        start: firstEntryDate,
        end: lastEntryDate,
      });
      formattedData = days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const data = aggregatedData[dateKey];
        const avgWeight = data ? data.totalWeight / data.count : null;
        const bmi = avgWeight ? calculateBMI(avgWeight, user.height) : null;
        return {
          label: format(day, "MMM d"),
          weight: avgWeight ? parseFloat(avgWeight.toFixed(1)) : null,
          bmi: bmi,
        };
      });
    } else {
      const weeks = eachWeekOfInterval(
        { start: firstEntryDate, end: lastEntryDate },
        { weekStartsOn: 1 }
      );
      formattedData = weeks.map((weekStartDate) => {
        const dateKey = format(weekStartDate, "yyyy-MM-dd");
        const data = aggregatedData[dateKey];
        const avgWeight = data ? data.totalWeight / data.count : null;
        const bmi = avgWeight ? calculateBMI(avgWeight, user.height) : null;
        return {
          label: `W/O ${format(weekStartDate, "MMM d")}`,
          weight: avgWeight ? parseFloat(avgWeight.toFixed(1)) : null,
          bmi: bmi,
        };
      });
    }

    return formattedData;
  } catch (error) {
    console.error(`Error fetching weight trend data (range: ${range}):`, error);
    return [];
  }
}
