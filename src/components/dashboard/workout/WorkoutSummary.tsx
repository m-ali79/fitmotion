import { StatCard } from "@/components/dashboard/StatCard";
import { Dumbbell, Clock, Flame, Activity, Target } from "lucide-react";

interface WorkoutSummaryStats {
  totalWorkouts: number;
  totalDurationFormatted: string;
  totalCaloriesBurned: number;
  avgDurationMinutes: number | null;
  avgCaloriesPerWorkout: number | null;
  workoutChangePercent: number | null | typeof Infinity;
  durationChangePercent: number | null | typeof Infinity;
  caloriesChangePercent: number | null | typeof Infinity;
}

interface WorkoutSummaryProps {
  stats: WorkoutSummaryStats;
  range: string;
}

export function WorkoutSummary({ stats, range }: WorkoutSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={Dumbbell}
        label="Total Workouts"
        value={stats.totalWorkouts}
        changePercent={stats.workoutChangePercent}
        range={range}
        iconColor="text-blue-500"
      />
      <StatCard
        icon={Clock}
        label="Total Time"
        value={stats.totalDurationFormatted}
        changePercent={stats.durationChangePercent}
        range={range}
        iconColor="text-purple-500"
      />
      <StatCard
        icon={Flame}
        label="Total Calories Burned"
        value={stats.totalCaloriesBurned.toLocaleString()}
        changePercent={stats.caloriesChangePercent}
        range={range}
        iconColor="text-orange-500"
      />
      <StatCard
        icon={Activity}
        label="Avg. Workout Duration"
        value={stats.avgDurationMinutes ?? "N/A"}
        unit={stats.avgDurationMinutes !== null ? "min" : undefined}
        range={range}
        iconColor="text-teal-500"
      />
      <StatCard
        icon={Target}
        label="Avg. Calories / Workout"
        value={stats.avgCaloriesPerWorkout?.toLocaleString() ?? "N/A"}
        unit={stats.avgCaloriesPerWorkout !== null ? "kcal" : undefined}
        range={range}
        iconColor="text-pink-500"
      />
    </div>
  );
}
