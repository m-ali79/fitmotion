"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Workout, WorkoutType, EffortLevel } from "@prisma/client";
import {
  startOfWeek,
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  subDays,
  isValid,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";
import {
  getStartDateFromRange,
  getPeriodDates,
  calculatePercentageChange,
  formatDuration,
  formatWorkoutTypeLabel,
} from "@/utils/progressUtils";

// Function to fetch workout stats for a given period
async function fetchPeriodStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalWorkouts: number;
  totalDurationMinutes: number;
  totalCaloriesBurned: number;
}> {
  const workouts: Pick<Workout, "duration" | "caloriesBurned">[] =
    await prisma.workout.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        duration: true,
        caloriesBurned: true,
      },
    });

  const totalWorkouts = workouts.length;
  const totalDurationMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCaloriesBurned = workouts.reduce(
    (sum, w) => sum + (w.caloriesBurned ?? 0),
    0
  );

  return { totalWorkouts, totalDurationMinutes, totalCaloriesBurned };
}

interface WorkoutSummaryStats {
  totalWorkouts: number;
  totalDurationFormatted: string;
  totalCaloriesBurned: number;
  avgDurationMinutes: number | null;
  avgCaloriesPerWorkout: number | null;
  // Comparison Stats (null if range is 'all' or previous period has zero data)
  workoutChangePercent: number | null | typeof Infinity;
  durationChangePercent: number | null | typeof Infinity;
  caloriesChangePercent: number | null | typeof Infinity;
}

export async function getWorkoutSummaryStats(
  range: string = "all"
): Promise<WorkoutSummaryStats> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return {
      totalWorkouts: 0,
      totalDurationFormatted: "0m",
      totalCaloriesBurned: 0,
      avgDurationMinutes: null,
      avgCaloriesPerWorkout: null,
      workoutChangePercent: null,
      durationChangePercent: null,
      caloriesChangePercent: null,
    };
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
    const [currentStats, previousStats] = await Promise.all([
      fetchPeriodStats(user.id, currentStart, currentEnd),
      range !== "all" && previousStart && previousEnd
        ? fetchPeriodStats(user.id, previousStart, previousEnd)
        : Promise.resolve({
            totalWorkouts: 0,
            totalDurationMinutes: 0,
            totalCaloriesBurned: 0,
          }), // Default previous if range is 'all'
    ]);

    // Calculate averages for the current period
    const avgDurationMinutes =
      currentStats.totalWorkouts > 0
        ? Math.round(
            currentStats.totalDurationMinutes / currentStats.totalWorkouts
          )
        : null;
    const avgCaloriesPerWorkout =
      currentStats.totalWorkouts > 0
        ? Math.round(
            currentStats.totalCaloriesBurned / currentStats.totalWorkouts
          )
        : null;

    // Calculate percentage changes (only if range is not 'all')
    let workoutChangePercent: number | null | typeof Infinity = null;
    let durationChangePercent: number | null | typeof Infinity = null;
    let caloriesChangePercent: number | null | typeof Infinity = null;

    if (range !== "all") {
      workoutChangePercent = calculatePercentageChange(
        currentStats.totalWorkouts,
        previousStats.totalWorkouts
      );
      durationChangePercent = calculatePercentageChange(
        currentStats.totalDurationMinutes,
        previousStats.totalDurationMinutes
      );
      caloriesChangePercent = calculatePercentageChange(
        currentStats.totalCaloriesBurned,
        previousStats.totalCaloriesBurned
      );
    }

    return {
      totalWorkouts: currentStats.totalWorkouts,
      totalDurationFormatted: formatDuration(currentStats.totalDurationMinutes),
      totalCaloriesBurned: currentStats.totalCaloriesBurned,
      avgDurationMinutes,
      avgCaloriesPerWorkout,
      workoutChangePercent,
      durationChangePercent,
      caloriesChangePercent,
    };
  } catch (error) {
    console.error(
      `Error fetching enhanced workout summary stats (range: ${range}):`,
      error
    );
    return {
      totalWorkouts: 0,
      totalDurationFormatted: "0m",
      totalCaloriesBurned: 0,
      avgDurationMinutes: null,
      avgCaloriesPerWorkout: null,
      workoutChangePercent: null,
      durationChangePercent: null,
      caloriesChangePercent: null,
    };
  }
}

interface DurationDataPoint {
  label: string; // Can be "W/O Oct 21" or "Oct 21"
  duration: number;
}

/**
 * Fetches workout duration data aggregated appropriately (daily/weekly)
 * for the authenticated user within a specified date range.
 */
export async function getWorkoutDurationData(
  range: string = "all"
): Promise<DurationDataPoint[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWorkoutDurationData: User not authenticated");
    return [];
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const rangeStartDate = getStartDateFromRange(range);

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: rangeStartDate ? { gte: rangeStartDate } : undefined,
      },
      select: { date: true, duration: true },
      orderBy: { date: "asc" },
    });

    if (workouts.length === 0) {
      return [];
    }

    const firstWorkoutDate = workouts[0].date;
    const lastWorkoutDate = workouts[workouts.length - 1].date;

    if (!isValid(firstWorkoutDate) || !isValid(lastWorkoutDate)) {
      throw new Error("Invalid start/end date in workout data:");
    }

    //  granularity based on range
    const useDailyGranularity = range === "7d" || range === "30d";

    const aggregatedData: Record<string, number> = {};
    for (const workout of workouts) {
      const workoutDate =
        typeof workout.date === "string"
          ? new Date(workout.date)
          : workout.date;
      if (!isValid(workoutDate)) continue;

      let dateKey: string;
      if (useDailyGranularity) {
        dateKey = format(workoutDate, "yyyy-MM-dd"); // Daily key
      } else {
        const weekStartDate = startOfWeek(workoutDate, { weekStartsOn: 1 });
        dateKey = format(weekStartDate, "yyyy-MM-dd"); // Weekly key
      }
      aggregatedData[dateKey] =
        (aggregatedData[dateKey] || 0) + workout.duration;
    }

    //  labels based on granularity
    let formattedData: DurationDataPoint[];
    if (useDailyGranularity) {
      const days = eachDayOfInterval({
        start: firstWorkoutDate,
        end: lastWorkoutDate,
      });
      formattedData = days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        return {
          label: format(day, "MMM d"), // Daily label
          duration: aggregatedData[dateKey] || 0,
        };
      });
    } else {
      const weeks = eachWeekOfInterval(
        { start: firstWorkoutDate, end: lastWorkoutDate },
        { weekStartsOn: 1 }
      );
      formattedData = weeks.map((weekStartDate) => {
        const dateKey = format(weekStartDate, "yyyy-MM-dd");
        return {
          label: `W/O ${format(weekStartDate, "MMM d")}`, // Weekly label
          duration: aggregatedData[dateKey] || 0,
        };
      });
    }

    return formattedData;
  } catch (error) {
    console.error(
      `Error fetching workout duration data (range: ${range}):`,
      error
    );
    return [];
  }
}

interface WorkoutTypeDistributionDataPoint {
  name: string;
  value: number;
  currentPercent: number;
  changePercent: number | null;
}

function countWorkoutTypes(workouts: Pick<Workout, "type">[]): {
  typeCounts: Record<WorkoutType, number>;
  totalCount: number;
} {
  const typeCounts = workouts.reduce(
    (acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    },
    {} as Record<WorkoutType, number>
  );
  const totalCount = workouts.length;
  return { typeCounts, totalCount };
}

/**
 * Fetches the distribution of workout types for the authenticated user,
 * including percentage and comparison vs previous period.
 */
export async function getWorkoutTypeDistribution(
  range: string = "all"
): Promise<WorkoutTypeDistributionDataPoint[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWorkoutTypeDistribution: User not authenticated");
    return [];
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
    const [currentWorkouts, previousWorkouts] = await Promise.all([
      prisma.workout.findMany({
        where: {
          userId: user.id,
          date: { gte: currentStart, lte: currentEnd },
        },
        select: { type: true },
      }),
      range !== "all" && previousStart && previousEnd
        ? prisma.workout.findMany({
            where: {
              userId: user.id,
              date: { gte: previousStart, lte: previousEnd },
            },
            select: { type: true },
          })
        : Promise.resolve([]),
    ]);

    // Count types for both periods
    const { typeCounts: currentCounts, totalCount: currentTotal } =
      countWorkoutTypes(currentWorkouts);
    const { typeCounts: previousCounts, totalCount: previousTotal } =
      countWorkoutTypes(previousWorkouts);

    if (currentTotal === 0) {
      return []; // No data for the current period
    }

    // Calculate percentages and changes
    const formattedData = Object.entries(currentCounts)
      .map(([type, currentCount]) => {
        const currentPercent = Math.round((currentCount / currentTotal) * 100);

        let changePercent: number | null = null;
        if (range !== "all") {
          const previousCount = previousCounts[type as WorkoutType] || 0;
          const previousPercent =
            previousTotal > 0
              ? Math.round((previousCount / previousTotal) * 100)
              : 0;
          changePercent = currentPercent - previousPercent; // Percentage point change
        }

        return {
          name: formatWorkoutTypeLabel(type as WorkoutType),
          value: currentCount,
          currentPercent,
          changePercent,
        };
      })
      .sort((a, b) => b.value - a.value);

    return formattedData;
  } catch (error) {
    console.error(
      `Error fetching enhanced workout type distribution (range: ${range}):`,
      error
    );
    return [];
  }
}

interface CaloriesData {
  label: string;
  caloriesBurned: number;
}

/**
 * Fetches total calories burned aggregated  (daily/weekly)
 * for the authenticated user within a specified date range.
 */
export async function getCaloriesBurnedData(
  range: string = "all"
): Promise<CaloriesData[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getCaloriesBurnedData: User not authenticated");
    return [];
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const rangeStartDate = getStartDateFromRange(range);

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: rangeStartDate ? { gte: rangeStartDate } : undefined,
        caloriesBurned: { not: null }, // Only include workouts where calories are logged
      },
      select: { date: true, caloriesBurned: true },
      orderBy: { date: "asc" },
    });

    if (workouts.length === 0) {
      return [];
    }

    const firstWorkoutDate = workouts[0].date;
    const lastWorkoutDate = workouts[workouts.length - 1].date;

    if (!isValid(firstWorkoutDate) || !isValid(lastWorkoutDate)) {
      throw new Error("Invalid start/end date in calorie data:");
    }

    const useDailyGranularity = range === "7d" || range === "30d";

    const aggregatedData: Record<string, number> = {};
    for (const workout of workouts) {
      const workoutDate =
        typeof workout.date === "string"
          ? new Date(workout.date)
          : workout.date;
      if (!isValid(workoutDate)) continue;

      let dateKey: string;
      if (useDailyGranularity) {
        dateKey = format(workoutDate, "yyyy-MM-dd");
      } else {
        const weekStartDate = startOfWeek(workoutDate, { weekStartsOn: 1 });
        dateKey = format(weekStartDate, "yyyy-MM-dd");
      }

      aggregatedData[dateKey] =
        (aggregatedData[dateKey] || 0) + (workout.caloriesBurned ?? 0);
    }

    let formattedData: CaloriesData[];
    if (useDailyGranularity) {
      const days = eachDayOfInterval({
        start: firstWorkoutDate,
        end: lastWorkoutDate,
      });
      formattedData = days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        return {
          label: format(day, "MMM d"),
          caloriesBurned: aggregatedData[dateKey] || 0,
        };
      });
    } else {
      const weeks = eachWeekOfInterval(
        { start: firstWorkoutDate, end: lastWorkoutDate },
        { weekStartsOn: 1 }
      );
      formattedData = weeks.map((weekStartDate) => {
        const dateKey = format(weekStartDate, "yyyy-MM-dd");
        return {
          label: `W/O ${format(weekStartDate, "MMM d")}`,
          caloriesBurned: aggregatedData[dateKey] || 0,
        };
      });
    }

    return formattedData;
  } catch (error) {
    console.error(
      `Error fetching calories burned data (range: ${range}):`,
      error
    );
    return [];
  }
}

interface ConsistencyData {
  currentStreak: number;
  longestStreak: number;
  totalDaysWithWorkout: number;
  totalDaysInRange: number;
  avgDaysPerWeek: number | null;
}

/**
 * Calculates workout consistency metrics for the authenticated user.
 */
export async function getWorkoutConsistencyData(
  range: string = "all"
): Promise<ConsistencyData> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWorkoutConsistencyData: User not authenticated");
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysWithWorkout: 0,
      totalDaysInRange: 0,
      avgDaysPerWeek: null,
    };
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const rangeStartDate = getStartDateFromRange(range);
  const rangeEndDate = new Date();

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: rangeStartDate ? { gte: rangeStartDate } : undefined,
      },
      select: { date: true },
      orderBy: { date: "asc" },
    });

    if (workouts.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysWithWorkout: 0,
        totalDaysInRange: 0,
        avgDaysPerWeek: null,
      };
    }

    const workoutDatesSet = new Set<string>();
    workouts.forEach((w) => workoutDatesSet.add(format(w.date, "yyyy-MM-dd")));

    const totalDaysWithWorkout = workoutDatesSet.size;

    const actualStartDate = rangeStartDate ?? workouts[0].date;
    let totalDaysInRange =
      differenceInCalendarDays(rangeEndDate, actualStartDate) + 1;
    if (totalDaysInRange < 0) totalDaysInRange = 0;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Iterate through the days *backwards* from today to the start date for  streak calculation
    const daysToCheck = eachDayOfInterval({
      start: actualStartDate,
      end: rangeEndDate,
    });

    // Check if today has a workout for the current streak calculation
    const todayStr = format(rangeEndDate, "yyyy-MM-dd");
    if (workoutDatesSet.has(todayStr)) {
      tempStreak = 1;
      currentStreak = 1;
    }

    // Check from yesterday backwards
    for (let i = daysToCheck.length - 2; i >= 0; i--) {
      const currentDay = daysToCheck[i];
      const nextDay = daysToCheck[i + 1]; // The day *after* currentDay in the sequence
      const currentDayStr = format(currentDay, "yyyy-MM-dd");

      if (workoutDatesSet.has(currentDayStr)) {
        // Check if it continues the streak from the next day
        if (isSameDay(currentDay, subDays(nextDay, 1))) {
          tempStreak++;
        } else {
          // Streak broken, update longest if needed, reset temp
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        // Day without workout, streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }

      // Update current streak only if we are checking yesterday relative to today
      if (isSameDay(currentDay, subDays(rangeEndDate, 1))) {
        currentStreak = tempStreak;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    // Ensure current streak isn't longer than the calculated longest streak
    // (can happen if the entire period is one long streak ending today)
    longestStreak = Math.max(longestStreak, currentStreak);

    // If today wasn't a workout day, current streak must be 0
    if (!workoutDatesSet.has(todayStr)) {
      currentStreak = 0;
    }

    let avgDaysPerWeek: number | null = null;
    if (totalDaysInRange > 0) {
      // Calculate adherence rate (workouts per day) and multiply by 7
      avgDaysPerWeek = parseFloat(
        ((totalDaysWithWorkout / totalDaysInRange) * 7).toFixed(1)
      );
    }

    return {
      currentStreak,
      longestStreak,
      totalDaysWithWorkout,
      totalDaysInRange,
      avgDaysPerWeek,
    };
  } catch (error) {
    console.error(
      `Error fetching workout consistency data (range: ${range}):`,
      error
    );
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysWithWorkout: 0,
      totalDaysInRange: 0,
      avgDaysPerWeek: null,
    };
  }
}

interface IntensityData {
  date: string;
  count: number;
}

const effortLevelMapping: Record<EffortLevel, number> = {
  easy: 1,
  moderate: 2,
  challenging: 3,
  intense: 4,
  maximum: 5,
};

/**
 * Fetches workout intensity data for a calendar heatmap view.
 */
export async function getWorkoutIntensityData(): Promise<IntensityData[]> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("getWorkoutIntensityData: User not authenticated");
    return [];
  }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
      },
      select: { date: true, effortLevel: true },
      orderBy: { date: "asc" },
    });

    if (workouts.length === 0) {
      return [];
    }

    // Aggregate data by date: Calculate sum of levels and count per day
    const dailyData = workouts.reduce(
      (acc, workout) => {
        const dateStr = format(workout.date, "yyyy-MM-dd");
        if (!acc[dateStr]) {
          acc[dateStr] = { totalLevel: 0, workoutCount: 0 };
        }
        acc[dateStr].workoutCount += 1;
        acc[dateStr].totalLevel += effortLevelMapping[workout.effortLevel] || 0;
        return acc;
      },
      {} as Record<string, { totalLevel: number; workoutCount: number }>
    );

    // Format for heatmap: Calculate average intensity level for each day
    const formattedData = Object.entries(dailyData).map(([date, data]) => ({
      date: date,
      // Calculate average level, round it, and clamp between 1 and 5
      count: Math.max(
        1,
        Math.min(Math.round(data.totalLevel / data.workoutCount), 5)
      ),
    }));

    return formattedData;
  } catch (error) {
    console.error(`Error fetching workout intensity data:`, error);
    return [];
  }
}
