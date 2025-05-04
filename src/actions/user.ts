"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DietaryPreference } from "@prisma/client";

const profileUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  activityLevel: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active"])
    .optional(),
  fitnessGoal: z
    .enum(["lose_weight", "gain_weight", "maintain_weight"])
    .optional(),
  fitnessExperience: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional(),
  dietaryPreferences: z
    .array(
      z.enum([
        "vegetarian",
        "vegan",
        "pescatarian",
        "keto",
        "paleo",
        "gluten_free",
        "dairy_free",
        "nut_free",
        "low_carb",
        "low_fat",
        "high_protein",
      ])
    )
    .optional(),
  medicalConditions: z.string().optional(),
});

/**
 * Creates a user record in the database after Clerk sign-up
 */
export async function createUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  if (!user) throw new Error("User not found");

  const newUser = await prisma.user.create({
    data: {
      clerkId: userId,
      name: user.firstName
        ? `${user.firstName} ${user.lastName || ""}`
        : undefined,
      email: user.emailAddresses[0]?.emailAddress,
    },
  });

  return newUser;
}

/**
 * Gets the current user's profile from our database
 */
export async function getUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let userWithProfile = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!userWithProfile) {
    await createUser();

    userWithProfile = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!userWithProfile) {
      throw new Error("Failed to retrieve user profile after creation");
    }
  }

  return userWithProfile;
}

/**
 * Updates the user profile in our database
 */

export async function updateUser(data: z.infer<typeof profileUpdateSchema>) {
  const currentUser = await getUserProfile();

  // Validate input data
  const validatedData = profileUpdateSchema.parse(data);

  // Convert dietaryPreferences from string array to proper enum values
  const updateData = {
    ...validatedData,
    dietaryPreferences: validatedData.dietaryPreferences
      ? { set: validatedData.dietaryPreferences as DietaryPreference[] }
      : undefined,
  };

  const updatedUser = await prisma.user.upsert({
    where: {
      clerkId: currentUser.clerkId,
    },
    update: updateData,
    create: {
      clerkId: currentUser.clerkId,
      ...updateData,
    },
    include: {
      profile: true,
    },
  });

  revalidatePath("/dashboard");

  return updatedUser;
}

/**
 * Sets the onboarding completion status in user metadata
 */
export async function completeOnboarding() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerk = await clerkClient();
  await clerk.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");

  return { success: true };
}

/**
 * Deletes a user account from our database
 */
export async function deleteUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.user.delete({
    where: {
      clerkId: userId,
    },
  });

  return { success: true };
}
