"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import GenderStep from "@/components/onboarding/GenderStep";
import BodyMetricsStep from "@/components/onboarding/BodyMetricsStep";
import ActivityLevelStep from "@/components/onboarding/ActivityLevelStep";
import FitnessGoalStep from "@/components/onboarding/FitnessGoalStep";
import SummaryStep from "@/components/onboarding/SummaryStep";
import DietaryPreferencesStep from "@/components/onboarding/DietaryPreferencesStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import MedicalStep from "@/components/onboarding/MedicalStep";
import CompletionStep from "@/components/onboarding/CompletionStep";
import {
  Gender,
  ActivityLevel,
  FitnessGoal,
  DietaryPreference,
  ExperienceLevel,
} from "@/types/onboarding";
import { saveOnboardingData } from "@/actions/onboarding";
import { calculateAndSaveNutritionPlan } from "@/actions/ai/nutrition-calculator";
import { toast } from "sonner";

interface NutritionPlan {
  tdee: number;
  bmr: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  explanation: string;
  profileId: string;
}

enum OnboardingStep {
  Gender = 0,
  BodyMetrics = 1,
  ActivityLevel = 2,
  FitnessGoal = 3,
  DietaryPreferences = 4,
  Experience = 5,
  Medical = 6,
  Summary = 7,
  Completion = 8,
}

const OnboardingStepWrapper = ({
  children,
  isActive,
}: {
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <div
      className={`transition-opacity duration-500 ${
        isActive ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      {children}
    </div>
  );
};

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    OnboardingStep.Gender
  );
  const [isSaving, setIsSaving] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(
    null
  );

  // State for user data
  const [gender, setGender] = useState<Gender | "">("");
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");
  const [goal, setGoal] = useState<FitnessGoal | "">("");
  const [preferences, setPreferences] = useState<DietaryPreference[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [medicalConditions, setMedicalConditions] = useState<string>("");

  const totalSteps = Object.keys(OnboardingStep).length / 2;

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    if (!gender || !activityLevel || !goal || !experience) {
      toast.error("Incomplete Data", {
        description:
          "Please ensure all required fields are filled before finishing.",
      });
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving your profile...");

    try {
      const onboardingData = {
        gender,
        height,
        weight,
        age,
        activityLevel,
        goal,
        preferences,
        experience,
        medicalConditions,
      };

      const saveResult = await saveOnboardingData(onboardingData);

      if (saveResult.success) {
        toast.loading("Profile Saved! Calculating nutrition plan...", {
          id: toastId,
        });

        try {
          const plan = await calculateAndSaveNutritionPlan();
          setNutritionPlan(plan);
          toast.success("Success!", {
            id: toastId,
            description: "Onboarding complete! Your plan is ready.",
          });
          await user?.reload();
          setCurrentStep(OnboardingStep.Completion);
        } catch (nutritionError) {
          console.error("Nutrition calculation error:", nutritionError);
          toast.error("Nutrition Plan Failed", {
            id: toastId,
            description:
              nutritionError instanceof Error
                ? nutritionError.message
                : "Could not calculate nutrition plan.",
          });
          await user?.reload();
          setCurrentStep(OnboardingStep.Completion);
        }
      } else {
        toast.error("Error Saving Profile", {
          id: toastId,
          description: saveResult.message || "Failed to save onboarding data.",
        });
      }
    } catch (error) {
      console.error("Onboarding finish error:", error);
      toast.error("Error Saving Profile", {
        id: toastId,
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Gender:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.Gender}
          >
            <GenderStep
              gender={gender}
              setGender={setGender}
              onNext={handleNext}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.BodyMetrics:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.BodyMetrics}
          >
            <BodyMetricsStep
              height={height}
              setHeight={setHeight}
              weight={weight}
              setWeight={setWeight}
              age={age}
              setAge={setAge}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.ActivityLevel:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.ActivityLevel}
          >
            <ActivityLevelStep
              activityLevel={activityLevel}
              setActivityLevel={setActivityLevel}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.FitnessGoal:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.FitnessGoal}
          >
            <FitnessGoalStep
              goal={goal}
              setGoal={setGoal}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.DietaryPreferences:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.DietaryPreferences}
          >
            <DietaryPreferencesStep
              preferences={preferences}
              setPreferences={setPreferences}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.Experience:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.Experience}
          >
            <ExperienceStep
              experience={experience}
              setExperience={setExperience}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.Medical:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.Medical}
          >
            <MedicalStep
              medicalConditions={medicalConditions}
              setMedicalConditions={setMedicalConditions}
              onNext={handleNext}
              onBack={handleBack}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.Summary:
        if (!gender || !activityLevel || !goal || !experience) {
          console.error(
            "Attempted to render SummaryStep with incomplete data."
          );
          return null;
        }
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.Summary}
          >
            <SummaryStep
              gender={gender}
              height={height}
              weight={weight}
              age={age}
              activityLevel={activityLevel}
              goal={goal}
              preferences={preferences}
              experience={experience}
              medicalConditions={medicalConditions}
              onBack={handleBack}
              onFinish={handleFinish}
              isSaving={isSaving}
            />
          </OnboardingStepWrapper>
        );
      case OnboardingStep.Completion:
        return (
          <OnboardingStepWrapper
            isActive={currentStep === OnboardingStep.Completion}
          >
            {nutritionPlan && (
              <CompletionStep
                plan={nutritionPlan}
                onGoToDashboard={handleGoToDashboard}
              />
            )}
          </OnboardingStepWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B25] flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-center border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-7 w-7 text-fitness-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-lg font-bold bg-clip-text bg-gradient-to-r from-fitness-primary to-white text-transparent">
            Motion
            <span className="font-light">Mindset</span>
          </span>
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="w-full px-4 sm:px-6 py-4">
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-fitness-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>
            {currentStep === OnboardingStep.Completion
              ? "Plan Generated!"
              : currentStep === OnboardingStep.Summary
                ? "Final Review"
                : "Tell us about yourself"}
          </span>
          <span>{`${currentStep + 1}/${totalSteps}`}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">{renderStep()}</div>
      </div>
    </div>
  );
}
