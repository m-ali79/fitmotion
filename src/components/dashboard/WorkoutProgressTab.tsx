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

import { WorkoutSummarySkeleton } from "@/components/dashboard/workout/WorkoutSummarySkeleton";
import { DurationChartSkeleton } from "@/components/dashboard/workout/DurationChartSkeleton";
import { TypeDistributionSkeleton } from "@/components/dashboard/workout/TypeDistributionSkeleton";
import { CaloriesBurnedSkeleton } from "@/components/dashboard/workout/CaloriesBurnedSkeleton";
import { ConsistencyTrackerSkeleton } from "@/components/dashboard/workout/ConsistencyTrackerSkeleton";
import { IntensityHeatmapSkeleton } from "@/components/dashboard/workout/IntensityHeatmapSkeleton";

import {
  getWorkoutSummaryStats,
  getWorkoutDurationData,
  getWorkoutTypeDistribution,
  getCaloriesBurnedData,
  getWorkoutConsistencyData,
  getWorkoutIntensityData,
} from "@/actions/dashboard/workout";

import { WorkoutSummary } from "@/components/dashboard/workout/WorkoutSummary";
import { DurationChart } from "@/components/dashboard/workout/DurationChart";
import { TypeDistributionChart } from "@/components/dashboard/workout/TypeDistributionChart";
import { CaloriesBurnedChart } from "@/components/dashboard/workout/CaloriesBurnedChart";
import { IntensityHeatmap } from "@/components/dashboard/workout/IntensityHeatmap";
import { ConsistencyTracker } from "@/components/dashboard/workout/ConsistencyTracker";

interface SummaryStats {
  totalWorkouts: number;
  totalDurationFormatted: string;
  totalCaloriesBurned: number;
  avgDurationMinutes: number | null;
  avgCaloriesPerWorkout: number | null;
  workoutChangePercent: number | null | typeof Infinity;
  durationChangePercent: number | null | typeof Infinity;
  caloriesChangePercent: number | null | typeof Infinity;
}

interface DurationData {
  label: string;
  duration: number;
}

interface TypeDistributionData {
  name: string;
  value: number;
  currentPercent: number;
  changePercent: number | null;
}

interface CaloriesData {
  label: string;
  caloriesBurned: number;
}

interface ConsistencyData {
  currentStreak: number;
  longestStreak: number;
  totalDaysWithWorkout: number;
  totalDaysInRange: number;
  avgDaysPerWeek: number | null;
}

interface IntensityData {
  date: string;
  count: number;
}

const rangeOptions = [
  { value: "all", label: "All Time" },
  { value: "1y", label: "Last Year" },
  { value: "90d", label: "Last 90 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "7d", label: "Last 7 Days" },
];

export function WorkoutProgressTab() {
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [durationData, setDurationData] = useState<DurationData[] | null>(null);
  const [typeDistributionData, setTypeDistributionData] = useState<
    TypeDistributionData[] | null
  >(null);
  const [caloriesData, setCaloriesData] = useState<CaloriesData[] | null>(null);
  const [consistencyData, setConsistencyData] =
    useState<ConsistencyData | null>(null);
  const [intensityData, setIntensityData] = useState<IntensityData[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setSummaryStats(null);
    setDurationData(null);
    setTypeDistributionData(null);
    setCaloriesData(null);
    setConsistencyData(null);
    setIntensityData(null);

    async function fetchData() {
      try {
        const [
          summaryResult,
          durationResult,
          typeResult,
          caloriesResult,
          consistencyResult,
          intensityResult,
        ] = await Promise.all([
          getWorkoutSummaryStats(selectedRange),
          getWorkoutDurationData(selectedRange),
          getWorkoutTypeDistribution(selectedRange),
          getCaloriesBurnedData(selectedRange),
          getWorkoutConsistencyData(selectedRange),
          getWorkoutIntensityData(),
        ]);

        if (isMounted) {
          setSummaryStats(summaryResult);
          setDurationData(durationResult);
          setTypeDistributionData(typeResult);
          setCaloriesData(caloriesResult);
          setConsistencyData(consistencyResult);
          setIntensityData(intensityResult);
        }
      } catch (error) {
        console.error("Failed to fetch workout progress data:", error);
        if (isMounted) {
          setSummaryStats({
            totalWorkouts: 0,
            totalDurationFormatted: "0m",
            totalCaloriesBurned: 0,
            avgDurationMinutes: null,
            avgCaloriesPerWorkout: null,
            workoutChangePercent: null,
            durationChangePercent: null,
            caloriesChangePercent: null,
          });
          setDurationData([]);
          setTypeDistributionData([]);
          setCaloriesData([]);
          setConsistencyData({
            currentStreak: 0,
            longestStreak: 0,
            totalDaysWithWorkout: 0,
            totalDaysInRange: 0,
            avgDaysPerWeek: null,
          });
          setIntensityData([]);
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

  const durationChartTitle = `Workout Duration Trend (${selectedRange === "7d" || selectedRange === "30d" ? "Daily" : "Weekly"})`;
  const caloriesChartTitle = `Calories Burned Trend (${selectedRange === "7d" || selectedRange === "30d" ? "Daily" : "Weekly"})`;

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

      {/* Nested Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-[#22222e] rounded-xl p-1 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="summary"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="duration"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Duration Chart
          </TabsTrigger>
          <TabsTrigger
            value="type-distribution"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Types Distribution
          </TabsTrigger>
          <TabsTrigger
            value="calories-burned"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Calories Burned
          </TabsTrigger>
          <TabsTrigger
            value="consistency"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Consistency
          </TabsTrigger>
          <TabsTrigger
            value="intensity"
            className="rounded-lg data-[state=active]:bg-fitness-primary/20 data-[state=active]:text-fitness-primary flex-shrink-0"
          >
            Intensity
          </TabsTrigger>
        </TabsList>

        {/* Nested Tabs Content */}
        <TabsContent value="summary">
          {isLoading || !summaryStats ? (
            <WorkoutSummarySkeleton />
          ) : (
            <WorkoutSummary stats={summaryStats} range={selectedRange} />
          )}
        </TabsContent>

        <TabsContent value="duration">
          {isLoading || !durationData ? (
            <DurationChartSkeleton />
          ) : (
            <DurationChart data={durationData} title={durationChartTitle} />
          )}
        </TabsContent>

        <TabsContent value="type-distribution">
          {isLoading || !typeDistributionData ? (
            <TypeDistributionSkeleton />
          ) : (
            <TypeDistributionChart data={typeDistributionData} />
          )}
        </TabsContent>

        <TabsContent value="calories-burned">
          {isLoading || !caloriesData ? (
            <CaloriesBurnedSkeleton />
          ) : (
            <CaloriesBurnedChart
              data={caloriesData}
              title={caloriesChartTitle}
            />
          )}
        </TabsContent>

        <TabsContent value="consistency">
          {isLoading || !consistencyData ? (
            <ConsistencyTrackerSkeleton />
          ) : (
            <ConsistencyTracker data={consistencyData} />
          )}
        </TabsContent>

        <TabsContent value="intensity">
          {isLoading || !intensityData ? (
            <IntensityHeatmapSkeleton />
          ) : (
            <IntensityHeatmap data={intensityData} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
