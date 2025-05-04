"use client";

import React, { useState, useEffect, use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { FoodFilters, MealData } from "@/types/nutrition";
import { FoodFiltersPopover } from "./FoodFiltersPopover";
import { FoodListRenderer } from "./FoodListRenderer";
import { FoodLogPagination } from "./FoodLogPagination";

const ITEMS_PER_PAGE = 10;

interface HistoryData {
  meals: MealData[] | null;
  totalCount: number;
}

interface FoodHistoryProps {
  mealsDataPromise: Promise<HistoryData | null>;
  currentPage: number;
  activeTab: string;
  currentFilters: FoodFilters;
}

export const FoodHistory = ({
  mealsDataPromise,
  currentPage,
  activeTab: initialActiveTab,
  currentFilters,
}: FoodHistoryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Resolve data promise
  const mealsData = use(mealsDataPromise);
  const meals = mealsData?.meals ?? null;
  const totalCount = mealsData?.totalCount ?? 0;

  // Ensure initial tab state is valid
  const validInitialTab = ["today", "week", "all"].includes(initialActiveTab)
    ? (initialActiveTab as "today" | "week" | "all")
    : "today"; // Default to today if invalid
  const [activeTab, setActiveTab] = useState<"today" | "week" | "all">(
    validInitialTab
  );

  // State for controlled search input
  const [searchInputValue, setSearchInputValue] = useState(
    currentFilters.searchQuery || ""
  );

  const debouncedUpdateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset page on search
    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchInputValue(value);
    debouncedUpdateSearch(value);
  };

  useEffect(() => {
    setSearchInputValue(currentFilters.searchQuery || "");
  }, [currentFilters.searchQuery]);

  const navigateWithParams = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleApplyFilters = (newFilters: FoodFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset page when filters change

    // Apply new date range
    if (newFilters.dateRange?.from) {
      params.set(
        "dateFrom",
        newFilters.dateRange.from.toISOString().split("T")[0]
      );
    } else {
      params.delete("dateFrom");
    }
    if (newFilters.dateRange?.to) {
      params.set("dateTo", newFilters.dateRange.to.toISOString().split("T")[0]);
    } else {
      params.delete("dateTo");
    }

    params.delete("mealTypes");
    if (newFilters.mealTypes && newFilters.mealTypes.length > 0) {
      newFilters.mealTypes.forEach((type) => params.append("mealTypes", type));
    }

    if (currentFilters.searchQuery) {
      params.set("search", currentFilters.searchQuery);
    }

    params.set("tab", activeTab);

    navigateWithParams(params);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("mealTypes");
    params.set("page", "1");
    if (currentFilters.searchQuery) {
      params.set("search", currentFilters.searchQuery);
    }
    params.set("tab", activeTab);
    navigateWithParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    navigateWithParams(params);
  };

  const handleTabChange = (value: string) => {
    if (value === "today" || value === "week" || value === "all") {
      const newTab = value as "today" | "week" | "all";
      setActiveTab(newTab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newTab);
      params.set("page", "1");
      params.delete("dateFrom");
      params.delete("dateTo");
      navigateWithParams(params);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Tabs First */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card p-1 rounded-xl border border-border h-auto inline-flex mb-4">
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

        {/* Search and Filters*/}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:flex-grow sm:max-w-md">
            <Search className="h-5 w-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-fitness-muted" />
            <Input
              placeholder="Search meals or foods..."
              value={searchInputValue}
              onChange={handleSearchInputChange}
              className="h-11 pl-10 bg-card border-border rounded-lg input-focus-effect w-full text-base"
            />
          </div>
          <FoodFiltersPopover
            currentFilters={currentFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Content Area */}
        <TabsContent value={activeTab} className="mt-0 min-h-[300px]">
          <FoodListRenderer meals={meals} activeTab={activeTab} />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <FoodLogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
