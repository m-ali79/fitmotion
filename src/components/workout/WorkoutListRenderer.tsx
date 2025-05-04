"use client";

import React from "react";
import { WorkoutData } from "@/types/workout";
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutCardSkeleton } from "./WorkoutCardSkeleton";
import { EmptyStateFood } from "../nutrition/EmptyStateFood";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

interface WorkoutListRendererProps {
  workouts: WorkoutData[] | null;
  activeTab: string;
}

const groupWorkoutsByDate = (
  workouts: WorkoutData[]
): Record<string, WorkoutData[]> => {
  return workouts.reduce(
    (acc, workout) => {
      const dateStr = format(workout.date, "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(workout);
      return acc;
    },
    {} as Record<string, WorkoutData[]>
  );
};

export const WorkoutListRenderer = ({
  workouts,
  activeTab,
}: WorkoutListRendererProps) => {
  if (workouts === null) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <WorkoutCardSkeleton key={`skel-list-loading-${i}`} />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    let title = "No Workouts Found";
    let description = "No workouts match your current filters.";
    if (activeTab === "today") {
      title = "No workouts logged today";
      description = "Log a workout to see it appear here.";
    } else if (activeTab === "week") {
      title = "No workouts logged this week";
      description = "Keep up the great work logging your sessions!";
    }
    return (
      <EmptyStateFood title={title} description={description} icon={Dumbbell} />
    );
  }

  const groupedWorkouts = groupWorkoutsByDate(workouts);
  const sortedDates = Object.keys(groupedWorkouts).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-5">
      {sortedDates.map((dateStr) => (
        <div key={dateStr}>
          <h2 className="text-xl font-semibold text-fitness-text mb-4 sticky top-0  py-2 z-10">
            {format(new Date(dateStr + "T00:00:00"), "EEEE, MMMM do")}
          </h2>
          <div className="space-y-3">
            {groupedWorkouts[dateStr].map((workout, index) => (
              <motion.div
                key={workout.id}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              >
                <WorkoutCard workout={workout} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
