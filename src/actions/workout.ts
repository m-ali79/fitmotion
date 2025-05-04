"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { WorkoutType, EffortLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { WorkoutData, WorkoutFilters } from "@/types/workout";
import { Prisma } from "@prisma/client";

export const fetchUserWeight = async (): Promise<number | null> => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user?.weight ?? null;
};

const LogWorkoutSchema = z.object({
  type: z.nativeEnum(WorkoutType),
  duration: z.number().min(1, "Duration must be at least 1 minute."),
  effortLevel: z.nativeEnum(EffortLevel),
  notes: z.string().optional(),
  caloriesBurned: z.number().nullable(),
});

type LogWorkoutInput = z.infer<typeof LogWorkoutSchema>;

export async function logWorkoutAction(data: LogWorkoutInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const validatedData = LogWorkoutSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Invalid workout data:", validatedData.error.flatten());
    return {
      success: false,
      error: "Invalid input data. Please check the form.",
    };
  }

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
      select: { id: true },
    });

    if (!user) {
      console.error(`User not found in DB for clerkId: ${clerkId}`);
      return { success: false, error: "User not found" };
    }

    await prisma.workout.create({
      data: {
        userId: user.id,
        date: new Date(),
        type: validatedData.data.type,
        duration: validatedData.data.duration,
        effortLevel: validatedData.data.effortLevel,
        caloriesBurned: validatedData.data.caloriesBurned,
        notes: validatedData.data.notes,
      },
    });

    revalidatePath("/workout");

    return { success: true };
  } catch (error) {
    console.error("Failed to log workout:", error);
    if (error instanceof Error) {
      return { success: false, error: `Database error: ${error.message}` };
    }
    return {
      success: false,
      error: "Failed to save workout to the database.",
    };
  }
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Server Action to fetch workout history for the authenticated user,
 * applying filters, sorting, and pagination.
 * @param filters - The filtering criteria.
 * @param page - The current page number (1-indexed).
 * @param pageSize - The number of items per page.
 * @returns Promise resolving to an object containing workouts and total count, or null.
 */
export async function fetchWorkoutHistory(
  filters: WorkoutFilters = {},
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<{ workouts: WorkoutData[]; totalCount: number } | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.error("fetchWorkoutHistory: User not authenticated.");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      console.error(
        `fetchWorkoutHistory: User not found in DB for clerkId: ${clerkId}`
      );
      return null;
    }

    const where: Prisma.WorkoutWhereInput = {
      userId: user.id,
    };

    if (filters.dateRange?.from || filters.dateRange?.to) {
      where.date = {};
      if (filters.dateRange.from) where.date.gte = filters.dateRange.from;
      if (filters.dateRange.to) where.date.lte = filters.dateRange.to;
    }

    if (filters.types && filters.types.length > 0) {
      where.type = { in: filters.types };
    }
    if (filters.effortLevels && filters.effortLevels.length > 0) {
      where.effortLevel = { in: filters.effortLevels };
    }

    if (
      filters.minDuration !== undefined ||
      filters.maxDuration !== undefined
    ) {
      where.duration = {};
      if (filters.minDuration !== undefined && filters.minDuration >= 0) {
        where.duration.gte = filters.minDuration;
      }
      if (filters.maxDuration !== undefined && filters.maxDuration >= 0) {
        if (
          filters.minDuration === undefined ||
          filters.maxDuration >= filters.minDuration
        ) {
          where.duration.lte = filters.maxDuration;
        }
      }
      // Clean up empty duration object if constraints were invalid
      if (Object.keys(where.duration).length === 0) {
        delete where.duration;
      }
    }

    // Define sorting
    const orderBy: Prisma.WorkoutOrderByWithRelationInput = {};
    const sortField = filters.sortBy ?? "date";
    const sortOrder = filters.sortOrder ?? "desc";

    // Ensure sortField is a valid key for Workout model
    if (
      ["date", "duration", "caloriesBurned", "type", "effortLevel"].includes(
        sortField
      )
    ) {
      orderBy[sortField as keyof Prisma.WorkoutOrderByWithRelationInput] =
        sortOrder;
    } else {
      orderBy["date"] = sortOrder; // Default to date if invalid field provided
    }

    // Add secondary sort for consistency
    if (sortField !== "date") {
      orderBy["date"] = "desc";
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    const totalCount = await prisma.workout.count({ where });
    const workouts = await prisma.workout.findMany({
      where: where,
      orderBy: orderBy,
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        date: true,
        type: true,
        duration: true,
        effortLevel: true,
        caloriesBurned: true,
        notes: true,
      },
    });

    return {
      workouts: workouts as WorkoutData[],
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Failed to fetch workout history:", error);
    return null;
  }
}

export async function fetchWorkoutById(
  id: string
): Promise<WorkoutData | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.error("fetchWorkoutById: User not authenticated.");
    return null;
  }

  if (!id) {
    console.error("fetchWorkoutById: No ID provided.");
    return null;
  }

  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id,
        user: {
          clerkId,
        },
      },
      select: {
        id: true,
        date: true,
        type: true,
        duration: true,
        effortLevel: true,
        caloriesBurned: true,
        notes: true,
      },
    });

    return workout as WorkoutData;
  } catch (error) {
    console.error(`Failed to fetch workout with ID ${id}:`, error);
    return null;
  }
}

export async function deleteWorkoutAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "User not authenticated." };
  }

  if (!id) {
    return { success: false, error: "Workout ID not provided." };
  }

  try {
    const workout = await prisma.workout.findFirst({
      where: {
        id,
        user: {
          clerkId,
        },
      },
      select: { id: true },
    });

    if (!workout) {
      return {
        success: false,
        error: "Workout not found or you do not have permission to delete it.",
      };
    }

    await prisma.workout.delete({
      where: { id },
    });

    revalidatePath("/workout");

    return { success: true };
  } catch (error) {
    console.error(`Failed to delete workout with ID ${id}:`, error);
    if (error instanceof Error) {
      return { success: false, error: `Database error: ${error.message}` };
    }
    return {
      success: false,
      error: "Failed to delete workout.",
    };
  }
}

const UpdateWorkoutSchema = LogWorkoutSchema.omit({ type: true });

type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>;

export async function updateWorkoutAction(
  id: string,
  data: UpdateWorkoutInput
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: "Workout ID is required for update." };
  }

  const validatedData = UpdateWorkoutSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Invalid update data:", validatedData.error.flatten());
    return {
      success: false,
      error: "Invalid input data. Please check the form.",
    };
  }

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id,
        user: {
          clerkId,
        },
      },
      select: { id: true },
    });

    if (!existingWorkout) {
      return {
        success: false,
        error: "Workout not found or you do not have permission to update it.",
      };
    }

    await prisma.workout.update({
      where: { id },
      data: {
        duration: validatedData.data.duration,
        effortLevel: validatedData.data.effortLevel,
        caloriesBurned: validatedData.data.caloriesBurned,
        notes: validatedData.data.notes,
      },
    });

    revalidatePath("/workout");
    revalidatePath(`/workout/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`Failed to update workout with ID ${id}:`, error);
    if (error instanceof Error) {
      return { success: false, error: `Database error: ${error.message}` };
    }
    return {
      success: false,
      error: "Failed to update workout.",
    };
  }
}
