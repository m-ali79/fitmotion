"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { NutritionSummaryStats } from "@/actions/dashboard/nutrition";
import {
  Flame, // Calories
  Target, // Goal / Net
  Beef, // Protein
  Wheat, // Carbs
  CookingPot, // Fat (Using CookingPot as a placeholder, consider a better icon if available)
  // ArrowUp, ArrowDown // Handled internally by StatCard
} from "lucide-react";

interface NutritionSummaryProps {
  stats: NutritionSummaryStats;
  range: string;
}

export function NutritionSummary({ stats, range }: NutritionSummaryProps) {
  // Format Net Calories for display
  let netCaloriesDisplay = "N/A";
  let netCaloriesColor = "text-gray-500"; // Default color
  if (stats.avgDailyNetCalories !== null) {
    netCaloriesDisplay = `${stats.avgDailyNetCalories > 0 ? "+" : ""}${stats.avgDailyNetCalories.toLocaleString()} kcal`;
    if (stats.avgDailyNetCalories > 0) {
      netCaloriesColor = "text-red-500"; // Surplus
    } else if (stats.avgDailyNetCalories < 0) {
      netCaloriesColor = "text-green-500"; // Deficit
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={Flame}
        label="Avg. Daily Calories"
        value={stats.avgDailyCalories?.toLocaleString() ?? "N/A"}
        unit="kcal"
        changePercent={stats.caloriesChangePercent}
        range={range}
        iconColor="text-orange-500" // Use orange for calories
      />
      <StatCard
        icon={Target}
        label="Avg. Daily Net"
        value={netCaloriesDisplay} // Use formatted display
        // unit="kcal"
        // changePercent={stats.netCaloriesChangePercent} // % change for net is complex, omitted
        range={range}
        iconColor={netCaloriesColor} // Dynamic color based on surplus/deficit
      />
      <StatCard
        icon={Beef} // Protein icon
        label="Avg. Daily Protein"
        value={stats.avgDailyProtein?.toLocaleString() ?? "N/A"}
        unit="g"
        changePercent={stats.proteinChangePercent}
        range={range}
        iconColor="text-blue-500" // Use blue for protein
      />
      <StatCard
        icon={Wheat} // Carbs icon
        label="Avg. Daily Carbs"
        value={stats.avgDailyCarbs?.toLocaleString() ?? "N/A"}
        unit="g"
        changePercent={stats.carbsChangePercent}
        range={range}
        iconColor="text-yellow-500" // Use yellow for carbs
      />
      <StatCard
        icon={CookingPot} // Fat icon (placeholder)
        label="Avg. Daily Fat"
        value={stats.avgDailyFat?.toLocaleString() ?? "N/A"}
        unit="g"
        changePercent={stats.fatChangePercent}
        range={range}
        iconColor="text-purple-500" // Use purple for fat
      />
    </div>
  );
}
