import React from "react";
import { ChevronRight, Stethoscope } from "lucide-react";
import { MedicalStepProps } from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MedicalStep = ({
  medicalConditions,
  setMedicalConditions,
  onNext,
  onBack,
}: MedicalStepProps) => {
  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Medical Conditions
        </h2>
        <p className="text-gray-400">
          Please list any relevant medical conditions or injuries we should be
          aware of (optional).
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="medicalConditions"
            className="text-white flex items-center gap-2"
          >
            <Stethoscope className="h-5 w-5 text-fitness-primary" />
            Relevant Conditions / Injuries
          </Label>
          <Textarea
            id="medicalConditions"
            value={medicalConditions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMedicalConditions(e.target.value)
            }
            placeholder="e.g., Knee injury, Asthma, Diabetes... Leave blank if none."
            className="min-h-[100px] bg-[#22222e] border-gray-700 rounded-xl text-white placeholder:text-gray-500"
            rows={4}
          />
          <p className="text-xs text-gray-500">
            This information helps us tailor recommendations. It will be kept
            confidential.
          </p>
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

export default MedicalStep;
