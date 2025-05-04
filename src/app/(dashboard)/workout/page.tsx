import React, { Suspense } from "react";
import WorkoutHistory from "@/components/workout/WorkoutHistroy";
import WorkoutLogger from "@/components/workout/WorkoutLogger";
import { fetchUserWeight, fetchWorkoutHistory } from "@/actions/workout";
import { WorkoutFilters, WorkoutData } from "@/types/workout";
import { WorkoutType, EffortLevel } from "@prisma/client";
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  parseISO,
} from "date-fns";
import WorkoutHistorySkeleton from "@/components/workout/WorkoutHistorySkeleton";

interface WorkoutPageProps {
  searchParams?: Promise<
    | {
        page?: string;
        tab?: string;
        types?: string | string[];
        efforts?: string | string[];
        from?: string;
        to?: string;
        minDuration?: string;
        maxDuration?: string;
      }
    | undefined
  >;
}

const parseFiltersFromParams = (resolvedParams: {
  page?: string;
  tab?: string;
  types?: string | string[];
  efforts?: string | string[];
  from?: string;
  to?: string;
  minDuration?: string;
  maxDuration?: string;
}): WorkoutFilters => {
  const filters: WorkoutFilters = {};

  if (resolvedParams.types) {
    const types = Array.isArray(resolvedParams.types)
      ? resolvedParams.types
      : [resolvedParams.types];
    filters.types = types.filter((t) =>
      Object.values(WorkoutType).includes(t as WorkoutType)
    ) as WorkoutType[];
  }

  if (resolvedParams.efforts) {
    const efforts = Array.isArray(resolvedParams.efforts)
      ? resolvedParams.efforts
      : [resolvedParams.efforts];
    filters.effortLevels = efforts.filter((e) =>
      Object.values(EffortLevel).includes(e as EffortLevel)
    ) as EffortLevel[];
  }

  try {
    const fromDate = resolvedParams.from
      ? parseISO(resolvedParams.from)
      : undefined;
    const toDate = resolvedParams.to ? parseISO(resolvedParams.to) : undefined;
    if (fromDate || toDate) {
      filters.dateRange = { from: fromDate, to: toDate };
    }
  } catch (e) {
    console.warn("Invalid date format in search params", e);
  }

  const minDuration = resolvedParams.minDuration
    ? parseInt(resolvedParams.minDuration, 10)
    : NaN;
  const maxDuration = resolvedParams.maxDuration
    ? parseInt(resolvedParams.maxDuration, 10)
    : NaN;
  if (!isNaN(minDuration) && minDuration >= 0) {
    filters.minDuration = minDuration;
  }
  if (!isNaN(maxDuration) && maxDuration >= 0) {
    filters.maxDuration = maxDuration;
  }

  return filters;
};

const WorkoutPage = async ({ searchParams }: WorkoutPageProps) => {
  const resolvedSearchParams = (await searchParams) ?? {};

  const currentPage = parseInt(resolvedSearchParams.page ?? "1", 10);
  const activeTab = resolvedSearchParams.tab ?? "all";
  const currentFilters = parseFiltersFromParams(resolvedSearchParams);

  const filtersForFetch = { ...currentFilters };
  const now = new Date();
  if (activeTab === "today") {
    filtersForFetch.dateRange = {
      from: startOfDay(now),
      to: endOfDay(now),
    };
  } else if (activeTab === "week") {
    filtersForFetch.dateRange = {
      from: startOfWeek(now, { weekStartsOn: 1 }),
      to: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }

  const userWeightKg = await fetchUserWeight();

  const historyDataPromise: Promise<{
    workouts: WorkoutData[];
    totalCount: number;
  } | null> = fetchWorkoutHistory(filtersForFetch, currentPage);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-fitness-text">
            Workout Log
          </h1>
          <p className="text-fitness-muted">
            Log your exercises and view your workout history.
          </p>
        </div>
        <div className="flex gap-3">
          <WorkoutLogger userWeightKg={userWeightKg} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-fitness-text">History</h2>
        <Suspense fallback={<WorkoutHistorySkeleton />}>
          <WorkoutHistory
            historyDataPromise={historyDataPromise}
            currentPage={currentPage}
            activeTab={activeTab}
            currentFilters={currentFilters}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default WorkoutPage;
