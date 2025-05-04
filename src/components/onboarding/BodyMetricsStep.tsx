import React from "react";
import { Scale, Ruler, ChevronRight } from "lucide-react";
import { BodyMetricsStepProps } from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const BodyMetricsStep = ({
  height,
  setHeight,
  weight,
  setWeight,
  age,
  setAge,
  onNext,
  onBack,
}: BodyMetricsStepProps) => {
  const handleNext = () => {
    if (height && weight && age) {
      onNext();
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Body Metrics
        </h2>
        <p className="text-gray-400">
          These details help us calculate your caloric needs and training
          intensity
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Scale className="h-6 w-6 text-fitness-primary" />
            <Label className="text-lg text-white">Weight</Label>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={[weight]}
              onValueChange={(value) => setWeight(value[0])}
              min={30}
              max={200}
              step={1}
              className="flex-1"
            />
            <div className="w-24 flex items-center gap-1">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="h-10 bg-[#22222e] border-gray-700 rounded-xl text-white"
              />
              <span className="text-gray-400">kg</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Ruler className="h-6 w-6 text-fitness-primary" />
            <Label className="text-lg text-white">Height</Label>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={[height]}
              onValueChange={(value) => setHeight(value[0])}
              min={120}
              max={220}
              step={1}
              className="flex-1"
            />
            <div className="w-24 flex items-center gap-1">
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="h-10 bg-[#22222e] border-gray-700 rounded-xl text-white"
              />
              <span className="text-gray-400">cm</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <svg
              className="h-6 w-6 text-fitness-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <Label className="text-lg text-white">Age</Label>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={[age]}
              onValueChange={(value) => setAge(value[0])}
              min={16}
              max={100}
              step={1}
              className="flex-1"
            />
            <div className="w-24 flex items-center gap-1">
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="h-10 bg-[#22222e] border-gray-700 rounded-xl text-white"
              />
              <span className="text-gray-400">yrs</span>
            </div>
          </div>
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
            disabled={!height || !weight || !age}
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

export default BodyMetricsStep;
