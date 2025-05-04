"use client";

import React, { useState, use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutData, WorkoutFilters } from "@/types/workout";
import { WorkoutType, EffortLevel } from "@prisma/client";
import { DateRange } from "react-day-picker";
import WorkoutFiltersPopover from "./WorkoutFiltersPopover";
import { WorkoutListRenderer } from "./WorkoutListRenderer";
import { WorkoutPagination } from "./WorkoutPagination";
import { useRouter, usePathname } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface HistoryData {
  workouts: WorkoutData[] | null;
  totalCount: number;
}

interface WorkoutHistoryProps {
  historyDataPromise: Promise<HistoryData | null>;
  currentPage: number;
  activeTab: string;
  currentFilters: WorkoutFilters;
}

interface PopoverFilterState {
  selectedTypes: Set<WorkoutType>;
  selectedEfforts: Set<EffortLevel>;
  dateRange: DateRange | undefined;
  minDuration: string;
  maxDuration: string;
}

const WorkoutHistory = ({
  historyDataPromise,
  currentPage,
  activeTab: initialActiveTab,
  currentFilters,
}: WorkoutHistoryProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const historyData = use(historyDataPromise);
  const workouts = historyData?.workouts ?? null;
  const totalCount = historyData?.totalCount ?? 0;

  const validInitialTab = ["today", "week", "all"].includes(initialActiveTab)
    ? (initialActiveTab as "today" | "week" | "all")
    : "all";
  const [activeTab, setActiveTab] = useState<"today" | "week" | "all">(
    validInitialTab
  );

  const navigateWithParams = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleApplyFilters = (popoverFilters: PopoverFilterState) => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    params.set("page", "1");

    if (popoverFilters.selectedTypes.size > 0) {
      Array.from(popoverFilters.selectedTypes).forEach((v) =>
        params.append("types", v)
      );
    }
    if (popoverFilters.selectedEfforts.size > 0) {
      Array.from(popoverFilters.selectedEfforts).forEach((v) =>
        params.append("efforts", v)
      );
    }
    if (popoverFilters.dateRange?.from) {
      params.set(
        "from",
        popoverFilters.dateRange.from.toISOString().split("T")[0]
      );
    }
    if (popoverFilters.dateRange?.to) {
      params.set("to", popoverFilters.dateRange.to.toISOString().split("T")[0]);
    }
    if (popoverFilters.minDuration) {
      params.set("minDuration", popoverFilters.minDuration);
    }
    if (popoverFilters.maxDuration) {
      params.set("maxDuration", popoverFilters.maxDuration);
    }

    navigateWithParams(params);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    params.set("page", "1");
    navigateWithParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);

    if (currentFilters.types && currentFilters.types.length > 0) {
      currentFilters.types.forEach((v) => params.append("types", v));
    }
    if (currentFilters.effortLevels && currentFilters.effortLevels.length > 0) {
      currentFilters.effortLevels.forEach((v) => params.append("efforts", v));
    }
    if (currentFilters.dateRange?.from) {
      params.set(
        "from",
        currentFilters.dateRange.from.toISOString().split("T")[0]
      );
    }
    if (currentFilters.dateRange?.to) {
      params.set("to", currentFilters.dateRange.to.toISOString().split("T")[0]);
    }
    if (currentFilters.minDuration !== undefined) {
      params.set("minDuration", String(currentFilters.minDuration));
    }
    if (currentFilters.maxDuration !== undefined) {
      params.set("maxDuration", String(currentFilters.maxDuration));
    }

    params.set("page", String(newPage));
    navigateWithParams(params);
  };

  const handleTabChange = (value: string) => {
    if (value === "today" || value === "week" || value === "all") {
      const newTab = value as "today" | "week" | "all";
      setActiveTab(newTab);
      const params = new URLSearchParams();
      params.set("tab", newTab);
      params.set("page", "1");
      navigateWithParams(params);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <WorkoutFiltersPopover
          currentFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card p-1 rounded-xl border border-border h-auto mb-4 inline-flex">
          {["today", "week", "all"].map((tabValue) => (
            <TabsTrigger
              key={tabValue}
              value={tabValue}
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-1.5 text-sm font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0 capitalize"
            >
              {tabValue === "week" ? "This Week" : tabValue}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <WorkoutListRenderer workouts={workouts} activeTab={activeTab} />
        </TabsContent>
      </Tabs>

      <WorkoutPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        activeTab={activeTab}
      />
    </div>
  );
};

export default WorkoutHistory;
