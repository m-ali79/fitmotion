import { Scale, Dumbbell, Target, Zap, BarChart } from "lucide-react";
import { DietaryPreference, ExperienceLevel } from "@prisma/client";

export enum Gender {
  Male = "male",
  Female = "female",
}

export enum ActivityLevel {
  Sedentary = "sedentary",
  LightlyActive = "lightly_active",
  ModeratelyActive = "moderately_active",
  VeryActive = "very_active",
}

export enum FitnessGoal {
  LoseWeight = "lose_weight",
  GainWeight = "gain_weight",
  MaintainWeight = "maintain_weight",
}

export { DietaryPreference };
export { ExperienceLevel };

export const activityLevelDescriptions: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]:
    "Little to no regular exercise with primarily sedentary lifestyle (desk job)",
  [ActivityLevel.LightlyActive]:
    "Light exercise or physical activity 1-3 days per week (walking, yoga)",
  [ActivityLevel.ModeratelyActive]:
    "Moderate exercise or physical activity 3-5 days per week (jogging, recreational sports)",
  [ActivityLevel.VeryActive]:
    "Intense exercise or physical activity 6-7 days per week (strength training, HIIT, endurance sports)",
};

export const activityLevelLabels: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]: "Sedentary",
  [ActivityLevel.LightlyActive]: "Lightly Active",
  [ActivityLevel.ModeratelyActive]: "Moderately Active",
  [ActivityLevel.VeryActive]: "Very Active",
};

export const fitnessGoalLabels: Record<FitnessGoal, string> = {
  [FitnessGoal.LoseWeight]: "Lose Weight",
  [FitnessGoal.GainWeight]: "Gain Weight",
  [FitnessGoal.MaintainWeight]: "Maintain Weight",
};

export const fitnessGoalDescriptions: Record<FitnessGoal, string> = {
  [FitnessGoal.LoseWeight]: "Burn fat and improve overall health",
  [FitnessGoal.GainWeight]: "Increase strength and muscle mass",
  [FitnessGoal.MaintainWeight]: "Stay consistent with a balanced lifestyle",
};

export const fitnessGoalIcons: Record<FitnessGoal, typeof Scale> = {
  [FitnessGoal.LoseWeight]: Scale,
  [FitnessGoal.GainWeight]: Dumbbell,
  [FitnessGoal.MaintainWeight]: Target,
};

export const dietaryPreferenceLabels: Record<DietaryPreference, string> = {
  [DietaryPreference.vegetarian]: "Vegetarian",
  [DietaryPreference.vegan]: "Vegan",
  [DietaryPreference.pescatarian]: "Pescatarian",
  [DietaryPreference.keto]: "Keto",
  [DietaryPreference.paleo]: "Paleo",
  [DietaryPreference.gluten_free]: "Gluten-Free",
  [DietaryPreference.dairy_free]: "Dairy-Free",
  [DietaryPreference.nut_free]: "Nut-Free",
  [DietaryPreference.low_carb]: "Low Carb",
  [DietaryPreference.low_fat]: "Low Fat",
  [DietaryPreference.high_protein]: "High Protein",
};

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.beginner]: "Beginner",
  [ExperienceLevel.intermediate]: "Intermediate",
  [ExperienceLevel.advanced]: "Advanced",
};

export const experienceLevelDescriptions: Record<ExperienceLevel, string> = {
  [ExperienceLevel.beginner]:
    "New to fitness or returning after a long break (0-6 months experience)",
  [ExperienceLevel.intermediate]:
    "Consistent training experience (6 months - 2 years)",
  [ExperienceLevel.advanced]:
    "Significant and consistent training experience (2+ years)",
};

export const experienceLevelIcons: Record<ExperienceLevel, React.ElementType> =
  {
    [ExperienceLevel.beginner]: Zap,
    [ExperienceLevel.intermediate]: BarChart,
    [ExperienceLevel.advanced]: Target,
  };

export interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

export interface GenderStepProps extends StepProps {
  gender: Gender | "";
  setGender: (value: Gender) => void;
  onBack?: never;
}

export interface BodyMetricsStepProps extends StepProps {
  height: number;
  setHeight: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  age: number;
  setAge: (value: number) => void;
  onBack: () => void;
}

export interface ActivityLevelStepProps extends StepProps {
  activityLevel: ActivityLevel | "";
  setActivityLevel: (value: ActivityLevel) => void;
  onBack: () => void;
}

export interface FitnessGoalStepProps extends StepProps {
  goal: FitnessGoal | "";
  setGoal: (value: FitnessGoal) => void;
  onBack: () => void;
}

export interface DietaryPreferencesStepProps extends StepProps {
  preferences: DietaryPreference[];
  setPreferences: (prefs: DietaryPreference[]) => void;
  onBack: () => void;
}

export interface ExperienceStepProps extends StepProps {
  experience: ExperienceLevel | "";
  setExperience: (level: ExperienceLevel) => void;
  onBack: () => void;
}

export interface MedicalStepProps extends StepProps {
  medicalConditions: string;
  setMedicalConditions: (conditions: string) => void;
  onBack: () => void;
}

export interface SummaryStepProps {
  gender: Gender;
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  preferences: DietaryPreference[];
  experience: ExperienceLevel;
  medicalConditions: string;
  onBack: () => void;
  onFinish: () => void;
  isSaving: boolean;
}
