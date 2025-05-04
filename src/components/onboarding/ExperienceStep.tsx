import React from "react";
import { ChevronRight } from "lucide-react";
import {
  ExperienceLevel,
  ExperienceStepProps,
  experienceLevelLabels,
  experienceLevelDescriptions,
  experienceLevelIcons,
} from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import StyledRadioOption from "@/components/ui/StyledRadioOption";

const ExperienceStep = ({
  experience,
  setExperience,
  onNext,
  onBack,
}: ExperienceStepProps) => {
  const handleNext = () => {
    if (experience) {
      onNext();
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Fitness Experience
        </h2>
        <p className="text-gray-400">
          How long have you been consistently working out?
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup
          value={experience}
          onValueChange={(value) => setExperience(value as ExperienceLevel)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {Object.values(ExperienceLevel).map((level) => {
            const Icon = experienceLevelIcons[level];
            return (
              <StyledRadioOption
                key={level}
                id={level}
                value={level}
                label={experienceLevelLabels[level]}
                description={experienceLevelDescriptions[level]}
                icon={<Icon className="h-8 w-8 text-fitness-primary" />}
                isCard={true}
                selected={experience === level}
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
            disabled={!experience}
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

export default ExperienceStep;
