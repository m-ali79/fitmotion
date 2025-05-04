import { WorkoutType, EffortLevel } from "@prisma/client";
import {
  Dumbbell,
  HeartPulse,
  StretchVertical,
  Briefcase,
  Home,
  PersonStanding,
  Users,
  MountainSnow,
  Activity,
} from "lucide-react";
import React from "react";

export interface WorkoutData {
  id: string;
  date: Date;
  type: WorkoutType;
  duration: number;
  effortLevel: EffortLevel;
  caloriesBurned: number | null;
  notes?: string | null;
}

export interface WorkoutFilters {
  types?: WorkoutType[];
  effortLevels?: EffortLevel[];
  dateRange?: { from?: Date; to?: Date };
  minDuration?: number;
  maxDuration?: number;
  sortBy?: "date" | "duration" | "calories";
  sortOrder?: "asc" | "desc";
}

//  Constants

// Mapping for display names and icons
export const workoutTypeDetails: Record<
  WorkoutType,
  { name: string; icon: React.ElementType }
> = {
  [WorkoutType.gym]: { name: "Gym", icon: Dumbbell },
  [WorkoutType.cardio]: { name: "Cardio", icon: HeartPulse },
  [WorkoutType.stretching_mobility]: {
    name: "Stretching & Mobility",
    icon: StretchVertical,
  },
  [WorkoutType.occupational_activity]: {
    name: "Occupational Activity",
    icon: Briefcase,
  },
  [WorkoutType.household_activity]: {
    name: "Household Activity",
    icon: Home,
  },
  [WorkoutType.individual_sport]: {
    name: "Individual Sport",
    icon: PersonStanding,
  },
  [WorkoutType.team_sport]: { name: "Team Sport", icon: Users },
  [WorkoutType.outdoor_activity]: {
    name: "Outdoor Activity",
    icon: MountainSnow,
  },
};

// Approximate MET values for different workout types
// Source: Compendium of Physical Activities
export const WORKOUT_MET_VALUES: Record<WorkoutType, number> = {
  [WorkoutType.gym]: 5.0, // General strength training / weightlifting
  [WorkoutType.cardio]: 7.0, // General cardio (e.g., jogging)
  [WorkoutType.stretching_mobility]: 2.5, // Stretching, Yoga Hatha
  [WorkoutType.occupational_activity]: 3.5, // Light effort (e.g., cleaning) - Highly variable!
  [WorkoutType.household_activity]: 3.0, // Light cleaning, cooking - Highly variable!
  [WorkoutType.individual_sport]: 6.5, // e.g., Tennis (general) - Highly variable!
  [WorkoutType.team_sport]: 7.5, // e.g., Basketball (general) - Highly variable!
  [WorkoutType.outdoor_activity]: 4.0, // e.g., Hiking (general) - Highly variable!
};

// Multipliers based on perceived effort level
export const EFFORT_MULTIPLIERS: Record<EffortLevel, number> = {
  [EffortLevel.easy]: 0.9, // Slightly less than average MET?
  [EffortLevel.moderate]: 1.0, // Around the average MET estimate
  [EffortLevel.challenging]: 1.15, // Higher end for the activity
  [EffortLevel.intense]: 1.3, // Significantly higher intensity
  [EffortLevel.maximum]: 1.5, // Peak effort for short bursts (use carefully)
};

export const DefaultWorkoutIcon = Activity;

export const getWorkoutIcon = (type: WorkoutType): React.ElementType => {
  return workoutTypeDetails[type]?.icon || DefaultWorkoutIcon;
};
