import React from "react";
import {
  ChevronRight,
  CheckCircle2,
  Utensils,
  Stethoscope,
  Loader2,
} from "lucide-react";
import {
  SummaryStepProps,
  activityLevelLabels,
  fitnessGoalLabels,
  dietaryPreferenceLabels,
  experienceLevelLabels,
} from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SummaryStep = ({
  gender,
  height,
  weight,
  age,
  activityLevel,
  goal,
  preferences,
  experience,
  medicalConditions,
  onBack,
  onFinish,
  isSaving,
}: SummaryStepProps) => {
  const SummaryItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | React.ReactNode;
  }) => (
    <div className="space-y-1">
      <p className="text-gray-400 text-sm">{label}</p>
      <div className="font-medium text-white">{value}</div>
    </div>
  );

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Ready to Start Your Journey!
        </h2>
        <p className="text-gray-400">
          We&apos;ve created a personalized fitness plan just for you
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#22222e] rounded-3xl p-6 space-y-6">
          <h3 className="font-medium text-xl text-white">Your Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <SummaryItem
              label="Gender"
              value={gender.charAt(0).toUpperCase() + gender.slice(1)}
            />
            <SummaryItem label="Age" value={`${age} years`} />
            <SummaryItem label="Height" value={`${height} cm`} />
            <SummaryItem label="Weight" value={`${weight} kg`} />
            <SummaryItem
              label="Activity Level"
              value={activityLevel ? activityLevelLabels[activityLevel] : "N/A"}
            />
            <SummaryItem
              label="Fitness Goal"
              value={goal ? fitnessGoalLabels[goal] : "N/A"}
            />
            <SummaryItem
              label="Experience Level"
              value={experience ? experienceLevelLabels[experience] : "N/A"}
            />
          </div>
        </div>

        {preferences.length > 0 && (
          <div className="bg-[#22222e] rounded-3xl p-6 space-y-4">
            <h3 className="font-medium text-xl text-white flex items-center gap-2">
              <Utensils className="h-5 w-5 text-fitness-primary" /> Dietary
              Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <Badge
                  key={pref}
                  variant="secondary"
                  className="bg-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/30"
                >
                  {dietaryPreferenceLabels[pref]}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {medicalConditions && (
          <div className="bg-[#22222e] rounded-3xl p-6 space-y-4">
            <h3 className="font-medium text-xl text-white flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-fitness-primary" /> Medical
              Conditions
            </h3>
            <p className="text-gray-300 text-sm">{medicalConditions}</p>
          </div>
        )}

        <div className="bg-fitness-primary/10 rounded-3xl p-6 border border-fitness-primary/20">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-fitness-primary/20 p-2 mt-1">
              <CheckCircle2 className="h-6 w-6 text-fitness-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 text-white">
                Your AI fitness plan is ready!
              </h3>
              <p className="text-gray-400">
                Based on your profile, we&apos;ve created a personalized plan
                with workouts, nutrition advice, and progress tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="rounded-xl border-gray-700 text-white hover:bg-[#2a2a36] hover:text-white"
            onClick={onBack}
            disabled={isSaving}
          >
            Back
          </Button>
          <Button
            className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90 min-w-[160px]"
            onClick={onFinish}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Go to Dashboard
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SummaryStep;
