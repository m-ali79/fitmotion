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
  getWeightSummaryStats,
  getWeightTrendData,
} from "@/actions/dashboard/weight";
import {
  WeightSummaryStats,
  WeightTrendDataPoint,
} from "@/actions/dashboard/weight";

import { WeightSummarySkeleton } from "./weight/WeightSummarySkeleton";
import { WeightTrendChartSkeleton } from "./weight/WeightTrendChartSkeleton";
import { WeightSummaryCards } from "./weight/WeightSummaryCards";
import { WeightTrendChart } from "./weight/WeightTrendChart";

const rangeOptions = [
  { value: "all", label: "All Time" },
  { value: "1y", label: "Last Year" },
  { value: "90d", label: "Last 90 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "7d", label: "Last 7 Days" },
];

export function WeightProgressTab() {
  const [selectedRange, setSelectedRange] = useState<string>("30d");
  const [summaryStats, setSummaryStats] = useState<WeightSummaryStats | null>(
    null
  );
  const [trendData, setTrendData] = useState<WeightTrendDataPoint[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setSummaryStats(null);
    setTrendData(null);

    async function fetchData() {
      try {
        const [summaryResult, trendResult] = await Promise.all([
          getWeightSummaryStats(selectedRange),
          getWeightTrendData(selectedRange),
        ]);

        if (isMounted) {
          setSummaryStats(summaryResult);
          setTrendData(trendResult);
        }
      } catch (error) {
        console.error("Failed to fetch weight progress data:", error);
        if (isMounted) {
          setSummaryStats({
            startingWeight: null,
            currentWeight: null,
            totalChangeKg: null,
            bmi: null,
            weightChangePercent: null,
            bmiChangePercent: null,
          });
          setTrendData([]);
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

  const trendChartTitle = `Weight Trend (${rangeOptions.find((opt) => opt.value === selectedRange)?.label ?? "Custom"})`;

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

      {/* Nested Tabs for Weight */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-[#22222e] rounded-xl p-1 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="summary"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="trend"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Weight Trend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          {isLoading || !summaryStats ? (
            <WeightSummarySkeleton />
          ) : (
            <WeightSummaryCards stats={summaryStats} range={selectedRange} />
          )}
        </TabsContent>

        <TabsContent value="trend">
          {isLoading || !trendData ? (
            <WeightTrendChartSkeleton />
          ) : (
            <WeightTrendChart data={trendData} title={trendChartTitle} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
