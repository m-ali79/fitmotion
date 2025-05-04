import React from "react";
import { Activity, ChevronRight } from "lucide-react";
import {
  ActivityLevel,
  ActivityLevelStepProps,
  activityLevelLabels,
  activityLevelDescriptions,
} from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import StyledRadioOption from "@/components/ui/StyledRadioOption";

const ActivityLevelStep = ({
  activityLevel,
  setActivityLevel,
  onNext,
  onBack,
}: ActivityLevelStepProps) => {
  const handleNext = () => {
    if (activityLevel) {
      onNext();
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Activity Level</h2>
        <p className="text-gray-400">
          Tell us about your current activity level to tailor your workouts
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup
          value={activityLevel}
          onValueChange={(value) => setActivityLevel(value as ActivityLevel)}
          className="grid grid-cols-1 gap-4"
        >
          {Object.values(ActivityLevel).map((level) => (
            <StyledRadioOption
              key={level}
              id={level}
              value={level}
              label={activityLevelLabels[level]}
              description={activityLevelDescriptions[level]}
              icon={<Activity className="h-6 w-6 text-fitness-primary" />}
              selected={activityLevel === level}
            />
          ))}
        </RadioGroup>

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="rounded-xl border-gray-700 text-white hover:bg-[#2a2a36] hover:text-white"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90"
            disabled={!activityLevel}
            onClick={handleNext}
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ActivityLevelStep;
