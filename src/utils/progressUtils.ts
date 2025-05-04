import {
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  addDays,
  differenceInCalendarDays,
} from "date-fns";

/**
 * Calculates the start date based on a relative range string.
 */
export function getStartDateFromRange(range: string): Date | undefined {
  const now = new Date();
  switch (range) {
    case "7d":
      return subDays(now, 7); // Go back 7 full days from today
    case "30d":
      return subDays(now, 30); // Go back 30 full days
    case "90d":
      return subMonths(now, 3); // Go back 3 months
    case "1y":
      return subYears(now, 1); // Go back 1 year
    case "all":
    default:
      return undefined; // No start date for 'all time'
  }
}

/**
 * Calculates the date ranges for the current and previous periods based on a range string.
 */
export function getPeriodDates(range: string): {
  currentStart: Date | undefined;
  currentEnd: Date;
  previousStart: Date | undefined;
  previousEnd: Date | undefined;
} {
  const currentEnd = new Date(); // Today (end of day)
  let currentStart: Date | undefined;
  let previousStart: Date | undefined;
  let previousEnd: Date | undefined;

  const now = startOfDay(new Date());

  switch (range) {
    case "7d":
      currentStart = subDays(now, 6); // Last 7 days including today
      previousEnd = subDays(currentStart, 1); // Day before current period started
      previousStart = subDays(previousEnd, 6); // Previous 7 days
      break;
    case "30d":
      currentStart = subDays(now, 29); // Last 30 days including today
      previousEnd = subDays(currentStart, 1);
      previousStart = subDays(previousEnd, 29); // Previous 30 days
      break;
    case "90d":
      // Approx last 90 days (start of day 3 months ago + 1 day)
      currentStart = startOfDay(addDays(subMonths(now, 3), 1));
      previousEnd = subDays(currentStart, 1);
      previousStart = startOfDay(addDays(subMonths(previousEnd, 3), 1));
      break;
    case "1y":
      // Approx last year (start of day 1 year ago + 1 day)
      currentStart = startOfDay(addDays(subYears(now, 1), 1));
      previousEnd = subDays(currentStart, 1);
      previousStart = startOfDay(addDays(subYears(previousEnd, 1), 1));
      break;
    case "all":
    default:
      currentStart = undefined; // Fetch all data for current
      previousStart = undefined;
      previousEnd = undefined;
      break;
  }

  return {
    currentStart: currentStart ? startOfDay(currentStart) : undefined,
    currentEnd: endOfDay(currentEnd),
    previousStart: previousStart ? startOfDay(previousStart) : undefined,
    previousEnd: previousEnd ? endOfDay(previousEnd) : undefined,
  };
}

/**
 * Calculates percentage change between two values, handling zero and infinity cases.
 */
export function calculatePercentageChange(
  current: number | null | undefined,
  previous: number | null | undefined
): number | null | typeof Infinity {
  const currentVal = current ?? 0;
  const previousVal = previous ?? 0;

  if (previousVal === 0) {
    return currentVal > 0 ? Infinity : 0;
  }
  // Avoid division by zero if previous is non-zero but current is zero
  if (currentVal === 0 && previousVal !== 0) {
    return -100;
  }
  return Math.round(((currentVal - previousVal) / previousVal) * 100);
}

/**
 * Formats a duration given in total minutes into a string like "1h 30m" or "45m".
 */
export function formatDuration(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes < 0) {
    return "0m";
  }
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
}

/**
 * Formats a WorkoutType enum value into a readable string.
 * e.g., "STRENGTH_TRAINING" -> "Strength Training"
 */
export function formatWorkoutTypeLabel(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Calculates the number of days within a given date range.
 * Returns 0 if start date is missing or invalid range.
 */
export function getDaysInRange(
  startDate: Date | undefined,
  endDate: Date | undefined
): number {
  if (!startDate || !endDate) {
    return 0;
  }
  try {
    const days = differenceInCalendarDays(endDate, startDate) + 1;
    return Math.max(0, days); // Ensure non-negative
  } catch (error) {
    console.error("Error calculating days in range:", error);
    return 0;
  }
}
