"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateUser, completeOnboarding } from "@/actions/user";
import {
  Gender,
  ActivityLevel,
  FitnessGoal,
  DietaryPreference,
  ExperienceLevel,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

const OnboardingDataSchema = z.object({
  gender: z.nativeEnum(Gender),
  height: z.number().positive(),
  weight: z.number().positive(),
  age: z.number().int().positive(),
  activityLevel: z.nativeEnum(ActivityLevel),
  goal: z.nativeEnum(FitnessGoal),
  preferences: z.array(z.nativeEnum(DietaryPreference)),
  experience: z.nativeEnum(ExperienceLevel),
  medicalConditions: z.string().optional(),
});

type OnboardingData = z.infer<typeof OnboardingDataSchema>;

export async function saveOnboardingData(data: OnboardingData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User must be logged in.");
  }

  //  validate the incoming data
  const validation = OnboardingDataSchema.safeParse(data);
  if (!validation.success) {
    console.error("Invalid onboarding data:", validation.error.format());
    throw new Error(`Invalid onboarding data: ${validation.error.message}`);
  }

  const validatedData = validation.data;

  try {
    await updateUser({
      gender: validatedData.gender,
      height: validatedData.height,
      weight: validatedData.weight,
      age: validatedData.age,
      activityLevel: validatedData.activityLevel,
      fitnessGoal: validatedData.goal,
      dietaryPreferences: validatedData.preferences,
      fitnessExperience: validatedData.experience,
      medicalConditions: validatedData.medicalConditions || undefined,
    });

    await completeOnboarding();

    revalidatePath("/dashboard");

    return { success: true, message: "Onboarding completed successfully!" };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to save onboarding data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while saving onboarding data.");
  }
}
