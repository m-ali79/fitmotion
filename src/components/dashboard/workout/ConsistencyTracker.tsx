"use client"; // Needs client for potential future interactions if any

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import recharts components
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface ConsistencyData {
  currentStreak: number;
  longestStreak: number;
  totalDaysWithWorkout: number;
  totalDaysInRange: number;
  avgDaysPerWeek: number | null;
}

interface Props {
  data: ConsistencyData;
}

interface RadialProgressProps {
  percentage: number;
  size?: number;
  color?: string;
  trackColor?: string;
}

function RadialProgress({
  percentage,
  size = 120,
  color = "#ec407a",
  trackColor = "hsl(var(--muted))",
}: RadialProgressProps) {
  const chartData = [{ name: "percentage", value: percentage, fill: color }];
  const outerRadius = size / 2;
  const innerRadius = outerRadius - 12;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90} // Start from top
          endAngle={-270} // Go full circle clockwise
          barSize={outerRadius - innerRadius}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]} // Percentage scale
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            angleAxisId={0}
            dataKey="value"
            background={{ fill: trackColor }}
            cornerRadius={(outerRadius - innerRadius) / 2}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Percentage Text */}
      <span className="absolute text-2xl font-bold text-foreground">
        {percentage}%
      </span>
    </div>
  );
}

export function ConsistencyTracker({ data }: Props) {
  const consistencyPercentage =
    data.totalDaysInRange > 0
      ? Math.round((data.totalDaysWithWorkout / data.totalDaysInRange) * 100)
      : 0;

  const currentStreakText = `day${data.currentStreak !== 1 ? "s" : ""}`;
  const longestStreakText = `day${data.longestStreak !== 1 ? "s" : ""}`;

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Workout Consistency</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-6">
        <div className="grid grid-cols-2 gap-x-6 w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-400 mb-1">Current Streak</p>
            <p className="text-3xl font-bold">
              {data.currentStreak}
              <span className="text-lg font-normal ml-1">
                {currentStreakText}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-400 mb-1">Longest Streak</p>
            <p className="text-3xl font-bold">
              {data.longestStreak}
              <span className="text-lg font-normal ml-1">
                {longestStreakText}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-sm text-gray-400">Workout Adherence</p>
          <RadialProgress percentage={consistencyPercentage} size={150} />
          <p className="text-xs text-gray-500">
            ({data.totalDaysWithWorkout} / {data.totalDaysInRange} days in
            period)
          </p>
        </div>

        {data.avgDaysPerWeek !== null && (
          <div className="flex flex-col items-center text-center pt-2">
            <p className="text-sm text-gray-400 mb-1">Average Workouts</p>
            <p className="text-2xl font-semibold">
              {data.avgDaysPerWeek.toFixed(1)}
              <span className="text-base font-normal ml-1">days/week</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
