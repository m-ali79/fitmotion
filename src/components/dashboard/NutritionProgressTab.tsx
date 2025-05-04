"use client";

import { useState, useEffect, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getCalorieBalanceData,
  getMacroDistributionData,
  getNutritionSummaryStats,
} from "@/actions/dashboard/nutrition";

import { CalorieBalanceChart } from "./nutrition/CalorieBalanceChart";

import { CalorieBalanceChartSkeleton } from "./nutrition/CalorieBalanceChartSkeleton";
import { MacroDistributionChart } from "./nutrition/MacroDistributionChart";
import { MacroDistributionChartSkeleton } from "./nutrition/MacroDistributionChartSkeleton";
import { NutritionSummary } from "./nutrition/NutritionSummary";
import { NutritionSummarySkeleton } from "./nutrition/NutritionSummarySkeleton";
import {
  MacroDistributionResult,
  NutritionSummaryStats,
} from "@/actions/dashboard/nutrition";

interface CalorieBalanceData {
  label: string;
  intake: number;
  goal: number | null;
}

const rangeOptions = [
  { value: "all", label: "All Time" },
  { value: "1y", label: "Last Year" },
  { value: "90d", label: "Last 90 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "7d", label: "Last 7 Days" },
];

export function NutritionProgressTab() {
  const [selectedRange, setSelectedRange] = useState<string>("30d");
  const [calorieData, setCalorieData] = useState<CalorieBalanceData[] | null>(
    null
  );
  const [macroResultData, setMacroResultData] =
    useState<MacroDistributionResult | null>(null);
  const [summaryStats, setSummaryStats] =
    useState<NutritionSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setCalorieData(null);
    setMacroResultData(null);
    setSummaryStats(null);

    async function fetchData() {
      try {
        const [balanceResult, macroResult, summaryResult] = await Promise.all([
          getCalorieBalanceData(selectedRange),
          getMacroDistributionData(selectedRange),
          getNutritionSummaryStats(selectedRange),
        ]);

        if (isMounted) {
          setCalorieData(balanceResult);
          setMacroResultData(macroResult);
          setSummaryStats(summaryResult);
        }
      } catch (error) {
        console.error("Failed to fetch nutrition progress data:", error);
        if (isMounted) {
          setCalorieData([]);
          setMacroResultData({
            distribution: [],
            summary: { totalCalories: 0 },
          });
          setSummaryStats({
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
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedRange]);

  const handleRangeChange = (value: string) => {
    startTransition(() => {
      setSelectedRange(value);
    });
  };

  const calorieChartTitle = `Calorie Intake vs Goal (${rangeOptions.find((opt) => opt.value === selectedRange)?.label ?? "Custom"})`;
  const macroChartTitle = `Macronutrient Distribution (${rangeOptions.find((opt) => opt.value === selectedRange)?.label ?? "Custom"})`;

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <Select
          value={selectedRange}
          onValueChange={handleRangeChange}
          disabled={isPending || isLoading}
        >
          <SelectTrigger className="w-[180px] rounded-xl bg-[#22222e] border-gray-700 focus:ring-fitness-primary">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-[#22222e] border-gray-700">
            {rangeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="focus:bg-fitness-primary/20 focus:text-white"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* --- Nested Tabs for Nutrition --- */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-[#22222e] rounded-xl p-1 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="summary"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="calorie-balance"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Calorie Balance
          </TabsTrigger>
          <TabsTrigger
            value="macro-distribution"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Macro Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          {isLoading || !summaryStats ? (
            <NutritionSummarySkeleton />
          ) : (
            <NutritionSummary stats={summaryStats} range={selectedRange} />
          )}
        </TabsContent>

        <TabsContent value="calorie-balance">
          {isLoading || !calorieData ? (
            <CalorieBalanceChartSkeleton />
          ) : (
            <CalorieBalanceChart data={calorieData} title={calorieChartTitle} />
          )}
        </TabsContent>

        <TabsContent value="macro-distribution">
          {isLoading || !macroResultData ? (
            <MacroDistributionChartSkeleton />
          ) : (
            <MacroDistributionChart
              data={macroResultData}
              title={macroChartTitle}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
