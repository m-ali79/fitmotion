import React from "react";
import { ChevronRight } from "lucide-react";
import { Gender, GenderStepProps } from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import StyledRadioOption from "@/components/ui/StyledRadioOption";

const GenderStep = ({ gender, setGender, onNext }: GenderStepProps) => {
  const handleNext = () => {
    if (gender) {
      onNext();
    }
  };

  const GenderIcon = () => (
    <svg
      className="h-8 w-8 text-fitness-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Let&apos;s get to know you
        </h2>
        <p className="text-gray-400">
          We&apos;ll use this information to create your personalized fitness
          plan
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as Gender)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <StyledRadioOption
              id="male"
              value={Gender.Male}
              label="Male"
              icon={<GenderIcon />}
              isCard={true}
              selected={gender === Gender.Male}
            />
            <StyledRadioOption
              id="female"
              value={Gender.Female}
              label="Female"
              icon={<GenderIcon />}
              isCard={true}
              selected={gender === Gender.Female}
            />
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button
            className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90"
            disabled={!gender}
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

export default GenderStep;
