import { StatCard } from "@/components/dashboard/StatCard";
import { WeightSummaryStats } from "@/actions/dashboard/weight";
import { Scale, ArrowRightLeft, TrendingUp } from "lucide-react";

interface WeightSummaryCardsProps {
  stats: WeightSummaryStats;
  range: string;
}

export function WeightSummaryCards({ stats, range }: WeightSummaryCardsProps) {
  let changeColor = "text-gray-500";
  let changePrefix = "";
  if (stats.totalChangeKg !== null) {
    if (stats.totalChangeKg > 0) {
      changeColor = "text-red-500"; // Weight gain
      changePrefix = "+";
    } else if (stats.totalChangeKg < 0) {
      changeColor = "text-green-500"; // Weight loss
    }
  }

  const bmiValue = stats.bmi?.toFixed(1) ?? "N/A";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        icon={Scale}
        label="Starting Weight"
        value={stats.startingWeight?.toFixed(1) ?? "N/A"}
        unit="kg"
        range={range}
        iconColor="text-gray-400"
      />
      <StatCard
        icon={Scale}
        label="Current Weight"
        value={stats.currentWeight?.toFixed(1) ?? "N/A"}
        unit="kg"
        changePercent={stats.weightChangePercent}
        range={range}
        iconColor="text-blue-500"
      />
      <StatCard
        icon={ArrowRightLeft}
        label="Total Change"
        value={`${changePrefix}${stats.totalChangeKg?.toFixed(1) ?? "N/A"}`}
        unit="kg"
        range={range}
        iconColor={changeColor}
      />
      <StatCard
        icon={TrendingUp}
        label="Current BMI"
        value={bmiValue}
        changePercent={stats.bmiChangePercent}
        range={range}
        iconColor="text-teal-500"
      />
    </div>
  );
}
