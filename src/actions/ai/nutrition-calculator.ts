"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { gemini } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  ActivityLevel,
  DietaryPreference,
  FitnessGoal,
  Gender,
} from "@prisma/client";

const UserDataSchema = z.object({
  gender: z.nativeEnum(Gender),
  age: z.number().int().positive(),
  height: z.number().positive(), // cm
  weight: z.number().positive(), // kg
  activityLevel: z.nativeEnum(ActivityLevel),
  fitnessGoal: z.nativeEnum(FitnessGoal),
  dietaryPreferences: z.array(z.nativeEnum(DietaryPreference)).optional(),
  medicalConditions: z.string().nullish(),
});

const NutritionPlanSchema = z.object({
  tdee: z
    .number()
    .int()
    .positive()
    .describe("Total Daily Energy Expenditure (calories)"),
  bmr: z.number().int().positive().describe("Basal Metabolic Rate (calories)"),
  dailyCalories: z
    .number()
    .int()
    .positive()
    .describe("Target daily calorie intake"),
  dailyProtein: z
    .number()
    .int()
    .positive()
    .describe("Target daily protein intake (grams)"),
  dailyCarbs: z
    .number()
    .int()
    .positive()
    .describe("Target daily carbohydrate intake (grams)"),
  dailyFat: z
    .number()
    .int()
    .positive()
    .describe("Target daily fat intake (grams)"),
  explanation: z
    .string()
    .describe(
      "Brief explanation of the calculated targets and how they align with the user's goal."
    ),
});

type NutritionPlan = z.infer<typeof NutritionPlanSchema>;

/**
 * Generates a static nutrition plan using AI based on user data.
 * @param userData - User's physical and goal data, including optional preferences/conditions.
 * @returns The calculated nutrition plan.
 */
async function generateNutritionPlan(
  userData: z.infer<typeof UserDataSchema>
): Promise<NutritionPlan> {
  let goalInstruction = "";
  switch (userData.fitnessGoal) {
    case FitnessGoal.lose_weight:
      goalInstruction =
        "To support the goal of losing weight, the daily calorie target should be approximately 500 calories below the calculated TDEE, ensuring it doesn't fall below the BMR.";
      break;
    case FitnessGoal.gain_weight:
      goalInstruction =
        "To support the goal of gaining weight, the daily calorie target should be approximately 300-500 calories above the calculated TDEE.";
      break;
    case FitnessGoal.maintain_weight:
      goalInstruction =
        "To support the goal of maintaining weight, the daily calorie target should be approximately equal to the calculated TDEE.";
      break;
  }

  //  optional parts of the prompt
  const dietaryPrefsString =
    userData.dietaryPreferences && userData.dietaryPreferences.length > 0
      ? `- Dietary Preferences: ${userData.dietaryPreferences.join(", ")}`
      : "";
  const medicalCondsString = userData.medicalConditions
    ? `- Relevant Medical Conditions: ${userData.medicalConditions}`
    : "";

  const prompt = `Calculate the TDEE (Total Daily Energy Expenditure) and BMR (Basal Metabolic Rate) for a user with the following details. Based on these and their fitness goal, recommend specific daily targets for calories, protein (grams), carbohydrates (grams), and fat (grams). Consider any provided dietary preferences or medical conditions when suggesting the plan and explanation.

User Details:
- Gender: ${userData.gender}
- Age: ${userData.age} years
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Activity Level: ${userData.activityLevel} (Consider standard multipliers: sedentary=1.2, lightly_active=1.375, moderately_active=1.55, very_active=1.725)
- Fitness Goal: ${userData.fitnessGoal}
${dietaryPrefsString}
${medicalCondsString}

Instructions:
1. Calculate BMR (e.g., using Mifflin-St Jeor formula).
2. Calculate TDEE by multiplying BMR by the activity level factor.
3. Determine the target daily calories based on the TDEE and the user's fitness goal: ${goalInstruction}
4. Recommend a balanced macronutrient split (e.g., 40% Carbs, 30% Protein, 30% Fat) to reach the target daily calories. Convert these percentages into grams. Adjust the split slightly if necessary based on dietary preferences or medical conditions (e.g., lower carbs for keto preference if specified).
5. Provide the results as a JSON object strictly conforming to the following schema: { "tdee": number, "bmr": number, "dailyCalories": number, "dailyProtein": number, "dailyCarbs": number, "dailyFat": number, "explanation": string }.
6. The 'explanation' should be a brief, user-friendly summary (2-3 sentences) explaining the calculated targets and how they support the user's goal, mentioning any specific considerations for dietary preferences or medical conditions if they were provided and relevant.`;

  //  error handling for AI call
  try {
    const result = await generateObject({
      model: gemini,
      schema: NutritionPlanSchema,
      prompt: prompt,
    });
    return result.object;
  } catch (error) {
    console.error("Error generating nutrition plan from AI:", error);
    throw new Error(
      "Failed to generate nutrition plan due to an AI service error."
    );
  }
}

/**
 * Calculates and saves the static nutrition plan for the currently authenticated user.
 * Fetches user data, generates the plan via AI, and updates the user's profile.
 * This is intended to be called once, typically at the end of the onboarding process.
 * @returns The updated user profile containing the nutrition plan.
 */
export async function calculateAndSaveNutritionPlan(): Promise<
  NutritionPlan & { profileId: string }
> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized: User must be logged in.");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkId },
    select: {
      id: true,
      gender: true,
      age: true,
      height: true,
      weight: true,
      activityLevel: true,
      fitnessGoal: true,
      dietaryPreferences: true,
      medicalConditions: true,
    },
  });

  //  checks for incomplete *required* data
  if (
    !user ||
    !user.gender ||
    !user.age ||
    !user.height ||
    !user.weight ||
    !user.activityLevel ||
    !user.fitnessGoal ||
    !user.dietaryPreferences
  ) {
    throw new Error(
      "Incomplete essential user profile data. Please complete onboarding to calculate nutrition plan."
    );
  }

  //  validate fetched data (including optional fields )
  const validatedUserData = UserDataSchema.parse(user);

  //  generate the nutrition plan via AI
  const nutritionPlan = await generateNutritionPlan(validatedUserData);

  //  save the plan to the user's profile
  const savedProfile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      tdee: nutritionPlan.tdee,
      bmr: nutritionPlan.bmr,
      dailyCalories: nutritionPlan.dailyCalories,
      dailyProtein: nutritionPlan.dailyProtein,
      dailyCarbs: nutritionPlan.dailyCarbs,
      dailyFat: nutritionPlan.dailyFat,
    },
    create: {
      userId: user.id,
      tdee: nutritionPlan.tdee,
      bmr: nutritionPlan.bmr,
      dailyCalories: nutritionPlan.dailyCalories,
      dailyProtein: nutritionPlan.dailyProtein,
      dailyCarbs: nutritionPlan.dailyCarbs,
      dailyFat: nutritionPlan.dailyFat,
    },
  });

  return {
    ...nutritionPlan,
    profileId: savedProfile.id,
  };
}
