import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutData, getWorkoutIcon } from "@/types/workout";
import { format } from "date-fns";
import { Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface WorkoutCardProps {
  workout: WorkoutData;
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const IconComponent = getWorkoutIcon(workout.type);
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          key={workout.id}
          className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden transition-colors duration-200"
        >
          <CardContent className="px-4 py-6 sm:py-4 flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-grow space-y-0.5 min-w-0 overflow-hidden w-full sm:w-auto">
              <p className="text-sm font-semibold capitalize text-card-foreground truncate">
                {workout.type.replace("_", " ")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(workout.date, "p")}
              </p>
            </div>
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 sm:gap-4 text-sm text-muted-foreground sm:flex-shrink-0 mt-2 sm:mt-0">
              <div className="flex items-center gap-1" title="Duration">
                <Clock className="h-4 w-4" />
                <span>
                  {workout.duration}
                  <span className="hidden sm:inline"> min</span>
                </span>
              </div>
              <div className="flex items-center gap-1" title="Calories Burned">
                <Flame className="h-4 w-4" />
                <span>
                  {workout.caloriesBurned ?? "-"}{" "}
                  <span className="hidden sm:inline"> Kcal</span>
                </span>
              </div>
              <Badge
                variant="outline"
                className="capitalize text-xs py-0.5 px-1.5 ml-auto sm:ml-0"
                title="Effort Level"
              >
                {workout.effortLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
