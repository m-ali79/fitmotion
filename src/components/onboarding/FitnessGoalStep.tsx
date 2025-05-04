import React from "react";
import { ChevronRight } from "lucide-react";
import {
  FitnessGoal,
  FitnessGoalStepProps,
  fitnessGoalLabels,
  fitnessGoalDescriptions,
  fitnessGoalIcons,
} from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import StyledRadioOption from "@/components/ui/StyledRadioOption";

const FitnessGoalStep = ({
  goal,
  setGoal,
  onNext,
  onBack,
}: FitnessGoalStepProps) => {
  const handleNext = () => {
    if (goal) {
      onNext();
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Fitness Goal
        </h2>
        <p className="text-gray-400">
          What would you like to achieve with MotionMindset?
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup
          value={goal}
          onValueChange={(value) => setGoal(value as FitnessGoal)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Object.values(FitnessGoal).map((fitnessGoal) => {
            const Icon = fitnessGoalIcons[fitnessGoal];
            return (
              <StyledRadioOption
                key={fitnessGoal}
                id={fitnessGoal}
                value={fitnessGoal}
                label={fitnessGoalLabels[fitnessGoal]}
                description={fitnessGoalDescriptions[fitnessGoal]}
                icon={<Icon className="h-8 w-8 text-fitness-primary" />}
                isCard={true}
                selected={goal === fitnessGoal}
              />
            );
          })}
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
            disabled={!goal}
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

export default FitnessGoalStep;
