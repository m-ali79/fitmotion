import React, { Suspense } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import {
  getTodaysNutritionSummary,
  fetchFoodHistory,
} from "@/actions/nutrition";
import { FoodFilters } from "@/types/nutrition";
import { DailyTargets } from "@/components/nutrition/DailyTargets";
import { ConsumedMacrosChart } from "@/components/nutrition/ConsumedMacrosChart";
import { FoodHistory } from "@/components/nutrition/FoodHistory";
import { FoodHistorySkeleton } from "@/components/nutrition/FoodHistorySkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { MealType } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

const parseFoodFiltersFromParams = (
  params: Record<string, string | string[] | undefined>
): FoodFilters => {
  const filters: FoodFilters = {};

  try {
    const fromDate = params.dateFrom
      ? parseISO(params.dateFrom as string)
      : undefined;
    const toDate = params.dateTo
      ? parseISO(params.dateTo as string)
      : undefined;
    if (fromDate || toDate) {
      filters.dateRange = { from: fromDate, to: toDate };
    }
  } catch (e) {
    console.warn("Invalid date format in search params", e);
  }

  if (params.mealTypes) {
    const types = Array.isArray(params.mealTypes)
      ? params.mealTypes
      : [params.mealTypes];
    filters.mealTypes = types.filter((t) =>
      Object.values(MealType).includes(t as MealType)
    ) as MealType[];
  }

  if (typeof params.search === "string" && params.search.trim() !== "") {
    filters.searchQuery = params.search.trim();
  }

  return filters;
};

interface FoodTrackerPageProps {
  searchParams?: Promise<
    Record<string, string | string[] | undefined> | undefined
  >;
}

const FoodTrackerPage = async ({ searchParams }: FoodTrackerPageProps) => {
  const resolvedSearchParams = (await searchParams) ?? {};

  const initialNutritionData = await getTodaysNutritionSummary();

  const currentPage = parseInt(
    (resolvedSearchParams.page as string) ?? "1",
    10
  );
  const activeTab = (resolvedSearchParams.tab as string) ?? "today";
  const currentFilters = parseFoodFiltersFromParams(resolvedSearchParams);

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  const now = new Date();

  if (currentFilters.dateRange?.from || currentFilters.dateRange?.to) {
    startDate = currentFilters.dateRange.from;
    endDate = currentFilters.dateRange.to;
  } else if (activeTab === "today") {
    startDate = startOfDay(now);
    endDate = endOfDay(now);
  } else if (activeTab === "week") {
    startDate = startOfWeek(now, { weekStartsOn: 1 });
    endDate = endOfWeek(now, { weekStartsOn: 1 });
  }

  const filtersForFetch: FoodFilters = {
    ...currentFilters,
    dateRange:
      startDate || endDate ? { from: startDate, to: endDate } : undefined,
  };

  const mealsDataPromise = fetchFoodHistory(
    filtersForFetch,
    currentPage,
    ITEMS_PER_PAGE
  );

  const consumed = initialNutritionData?.consumed ?? {
    consumedCalories: 0,
    consumedProtein: 0,
    consumedCarbs: 0,
    consumedFat: 0,
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-fitness-text">
            Nutrition Tracker
          </h1>
          <p className="text-fitness-muted">
            Track, analyze, and optimize your nutrition
          </p>
        </div>
        <Link href="/nutrition/scan" passHref>
          <Button className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90 h-12 btn-hover-effect">
            <Camera className="h-5 w-5 mr-2" />
            Scan Food
          </Button>
        </Link>
      </div>

      {/* Overview and Macronutrients Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DailyTargets
            nutritionData={initialNutritionData}
            isLoading={false}
            error={null}
          />
        </div>
        <div className="xl:col-span-1">
          <ConsumedMacrosChart consumed={consumed} />
        </div>
      </div>

      {/* Food History Section */}
      <Suspense fallback={<FoodHistorySkeleton />}>
        <FoodHistory
          mealsDataPromise={mealsDataPromise}
          currentPage={currentPage}
          activeTab={activeTab}
          currentFilters={currentFilters}
        />
      </Suspense>
    </div>
  );
};

export default FoodTrackerPage;
