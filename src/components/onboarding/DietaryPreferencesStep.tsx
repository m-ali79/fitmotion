import React from "react";
import { ChevronRight } from "lucide-react";
import {
  DietaryPreference,
  DietaryPreferencesStepProps,
  dietaryPreferenceLabels,
} from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DietaryPreferencesStep = ({
  preferences,
  setPreferences,
  onNext,
  onBack,
}: DietaryPreferencesStepProps) => {
  const handleCheckboxChange = (
    preference: DietaryPreference,
    checked: boolean
  ) => {
    if (checked) {
      setPreferences([...preferences, preference]);
    } else {
      setPreferences(preferences.filter((p) => p !== preference));
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Dietary Preferences
        </h2>
        <p className="text-gray-400">
          Select any dietary restrictions or preferences you have.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(DietaryPreference).map((preference) => (
            <div
              key={preference}
              className="flex items-center space-x-2 p-4 bg-[#22222e] rounded-xl border border-transparent hover:border-fitness-primary transition-colors"
            >
              <Checkbox
                id={preference}
                checked={preferences.includes(preference)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(preference, Boolean(checked))
                }
              />
              <Label
                htmlFor={preference}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white cursor-pointer flex-1"
              >
                {dietaryPreferenceLabels[preference]}
              </Label>
            </div>
          ))}
        </div>

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
            onClick={onNext}
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default DietaryPreferencesStep;
