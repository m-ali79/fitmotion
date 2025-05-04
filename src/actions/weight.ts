"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  LogWeightSchema,
  LogWeightFormData,
  WeightEntryWithComputed,
} from "@/types/weight";
import { revalidatePath } from "next/cache";

/**
 * Logs a new weight entry for the authenticated user.
 * Validates input using LogWeightSchema.
 */
export async function logWeightEntry(formData: LogWeightFormData): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, message: "User not authenticated" };
  }

  const validatedFields = LogWeightSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid input data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { weightKg, notes } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    await prisma.weightEntry.create({
      data: {
        userId: user.id,
        weightKg: weightKg,
        notes: notes,
      },
    });

    revalidatePath("/weight");

    return { success: true, message: "Weight logged successfully." };
  } catch (error) {
    console.error("Error logging weight:", error);
    return {
      success: false,
      message: "Failed to log weight. Please try again.",
    };
  }
}

const ITEMS_PER_PAGE =  10;

/**
 * Calculates BMI given weight in kg and height in cm.
 */
function calculateBMI(
  weightKg: number,
  heightCm: number | null
): number | null {
  if (!heightCm || heightCm <= 0 || weightKg <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1)); // Return BMI rounded to one decimal place
}

/**
 * Fetches paginated weight history for the authenticated user,
 * calculating change from the previous entry and BMI.
 */
export async function fetchWeightHistory(page: number = 1): Promise<{
  entries: WeightEntryWithComputed[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.warn("fetchWeightHistory: User not authenticated");
    return {
      entries: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, height: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Fetch one extra record before the current page to calculate the change for the first item
    const entriesToFetch = ITEMS_PER_PAGE + 1;
    const offsetForChangeCalc = skip > 0 ? skip - 1 : 0;

    const [weightEntries, totalCount] = await Promise.all([
      prisma.weightEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: entriesToFetch,
        skip: offsetForChangeCalc,
        select: {
          id: true,
          userId: true,
          weightKg: true,
          date: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.weightEntry.count({ where: { userId: user.id } }),
    ]);

    const processedEntries: WeightEntryWithComputed[] = [];

    for (let i = 0; i < weightEntries.length; i++) {
      if (skip > 0 && i === 0) continue;
      if (processedEntries.length >= ITEMS_PER_PAGE) break;

      const currentEntry = weightEntries[i];
      const previousEntry =
        i + 1 < weightEntries.length ? weightEntries[i + 1] : null;

      const changeFromLast = previousEntry
        ? parseFloat(
            (currentEntry.weightKg - previousEntry.weightKg).toFixed(1)
          )
        : null;

      const bmi = calculateBMI(currentEntry.weightKg, user.height);

      processedEntries.push({
        ...currentEntry,
        changeFromLast: changeFromLast,
        bmi: bmi,
      });
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return {
      entries: processedEntries,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return {
      entries: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function fetchWeightEntryById(
  id: string
): Promise<WeightEntryWithComputed | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, height: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const weightEntry = await prisma.weightEntry.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        id: true,
        userId: true,
        weightKg: true,
        date: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!weightEntry) {
      return null;
    }

    // Fetch the previous entry to calculate change
    const previousEntry = await prisma.weightEntry.findFirst({
      where: {
        userId: user.id,
        date: {
          lt: weightEntry.date,
        },
      },
      orderBy: {
        date: "desc",
      },
      select: { weightKg: true },
    });

    const changeFromLast = previousEntry
      ? parseFloat((weightEntry.weightKg - previousEntry.weightKg).toFixed(1))
      : null;

    const bmi = calculateBMI(weightEntry.weightKg, user.height);

    return {
      ...weightEntry,
      changeFromLast: changeFromLast,
      bmi: bmi,
    };
  } catch (error) {
    console.error("Error fetching weight entry by ID:", error);
    return null;
  }
}

export async function updateWeightEntry(
  id: string,
  formData: LogWeightFormData
): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, message: "User not authenticated" };
  }

  const validatedFields = LogWeightSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid input data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { weightKg, notes } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const existingEntry = await prisma.weightEntry.findUnique({
      where: { id: id, userId: user.id },
    });

    if (!existingEntry) {
      return {
        success: false,
        message: "Weight entry not found or unauthorized.",
      };
    }

    await prisma.weightEntry.update({
      where: { id: id },
      data: {
        weightKg: weightKg,
        notes: notes,
      },
    });

    revalidatePath("/weight");
    revalidatePath(`/weight/${id}`);

    return { success: true, message: "Weight entry updated successfully." };
  } catch (error) {
    console.error("Error updating weight entry:", error);
    return { success: false, message: "Failed to update weight entry." };
  }
}

export async function deleteWeightEntry(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const existingEntry = await prisma.weightEntry.findUnique({
      where: { id: id, userId: user.id },
    });

    if (!existingEntry) {
      return {
        success: false,
        message: "Weight entry not found or unauthorized.",
      };
    }

    await prisma.weightEntry.delete({
      where: { id: id },
    });

    revalidatePath("/weight");

    return { success: true, message: "Weight entry deleted successfully." };
  } catch (error) {
    console.error("Error deleting weight entry:", error);
    return { success: false, message: "Failed to delete weight entry." };
  }
}
