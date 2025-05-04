"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { MealType, Prisma } from "@prisma/client";
import { calculateDailyConsumption } from "@/lib/nutrition-calculations";
import {
  NutritionTargets,
  ConsumedNutrients,
  MealData,
  FoodFilters,
} from "@/types/nutrition";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getNutritionTargets = async (): Promise<NutritionTargets> => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        dailyCalories: true,
        dailyProtein: true,
        dailyCarbs: true,
        dailyFat: true,
      },
    });

    return {
      dailyCalories: profile?.dailyCalories ?? 0,
      dailyProtein: profile?.dailyProtein ?? 0,
      dailyCarbs: profile?.dailyCarbs ?? 0,
      dailyFat: profile?.dailyFat ?? 0,
    };
  } catch (error) {
    console.error("Error fetching nutrition targets:", error);
    throw new Error("Failed to fetch nutrition targets.");
  }
};

interface MealNutrientsOnly {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const getMealNutrientsByDate = async (
  date: Date
): Promise<MealNutrientsOnly[]> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  const startDate = startOfDay(date);
  const endDate = endOfDay(date);

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error(`User not found for clerkId: ${clerkId}`);
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });
    return meals;
  } catch (error) {
    console.error("Error fetching meal nutrients by date:", error);
    throw new Error("Failed to fetch meal nutrients.");
  }
};

export const getTodaysNutritionSummary = async (): Promise<{
  targets: NutritionTargets;
  consumed: ConsumedNutrients;
}> => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  try {
    const today = new Date();
    const [targets, todaysMealNutrients] = await Promise.all([
      getNutritionTargets(),
      getMealNutrientsByDate(today),
    ]);

    const consumed = calculateDailyConsumption(todaysMealNutrients);

    const consumedResult: ConsumedNutrients = {
      consumedCalories: consumed.consumedCalories ?? 0,
      consumedProtein: consumed.consumedProtein ?? 0,
      consumedCarbs: consumed.consumedCarbs ?? 0,
      consumedFat: consumed.consumedFat ?? 0,
    };

    return { targets, consumed: consumedResult };
  } catch (error) {
    console.error("Error in getTodaysNutritionSummary:", error);
    throw new Error("Failed to fetch nutrition summary.");
  }
};

export const fetchFoodHistory = async (
  filters: FoodFilters,
  page: number,
  limit: number
): Promise<{ meals: MealData[]; totalCount: number }> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    console.error("fetchFoodHistory Error: User not authenticated.");
    throw new Error("User not authenticated");
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
  } catch (error) {
    console.error("fetchFoodHistory Error: Failed to query user", error);
    throw new Error("Database error: Failed to retrieve user data.");
  }

  if (!user) {
    console.error(
      `fetchFoodHistory Error: User not found for clerkId: ${clerkId}`
    );
    throw new Error("User not found");
  }

  const userId = user.id;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.MealWhereInput = {
    userId: userId,
  };

  if (filters.dateRange?.from || filters.dateRange?.to) {
    whereClause.date = {};
    if (filters.dateRange.from) {
      whereClause.date.gte = startOfDay(filters.dateRange.from);
    }
    if (filters.dateRange.to) {
      whereClause.date.lte = endOfDay(filters.dateRange.to);
    }
  }

  if (filters.mealTypes && filters.mealTypes.length > 0) {
    whereClause.mealType = { in: filters.mealTypes };
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const searchQuery = filters.searchQuery.trim();
    const searchCondition: Prisma.MealWhereInput = {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        {
          foodItems: {
            some: { name: { contains: searchQuery, mode: "insensitive" } },
          },
        },
      ],
    };

    if (!whereClause.AND) {
      whereClause.AND = [];
    }
    if (Array.isArray(whereClause.AND)) {
      whereClause.AND.push(searchCondition);
    }
  }

  try {
    const [totalCount, meals] = await prisma.$transaction([
      prisma.meal.count({ where: whereClause }),
      prisma.meal.findMany({
        where: whereClause,
        include: {
          foodItems: {
            select: {
              id: true,
              name: true,
              calories: true,
              protein: true,
              carbs: true,
              fat: true,
              servingSize: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        skip: skip,
        take: limit,
      }),
    ]);

    return { meals: meals as MealData[], totalCount };
  } catch (error) {
    console.error("fetchFoodHistory Error: Failed to fetch meals:", error);
    throw new Error("Database error: Failed to fetch food history.");
  }
};

const FoodItemSchema = z.object({
  name: z.string().min(1, "Food name cannot be empty."),
  calories: z
    .number()
    .int()
    .nonnegative("Calories must be a positive integer."),
  protein: z.number().nonnegative("Protein must be a positive number."),
  carbs: z.number().nonnegative("Carbs must be a positive number."),
  fat: z.number().nonnegative("Fat must be a positive number."),
  servingSize: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL.").optional().nullable(),
});

const CreateMealSchema = z.object({
  name: z.string().min(1, "Meal name cannot be empty."),
  mealType: z.nativeEnum(MealType),
  date: z.coerce.date(),
  calories: z.number().int().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  imageUrl: z.string().url().nullable(),
  foodItems: z.array(FoodItemSchema).optional(),
  notes: z.string().optional().nullable(),
});

const UpdateMealSchema = z.object({
  mealType: z.nativeEnum(MealType).optional(),
  notes: z.string().optional().nullable(),
});

export const createMeal = async (data: z.infer<typeof CreateMealSchema>) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("User not authenticated");

  const validatedData = CreateMealSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Invalid meal data:", validatedData.error.flatten());
    throw new Error(
      `Invalid meal data: ${validatedData.error.flatten().formErrors.join(", ")}`
    );
  }

  const { foodItems, ...mealDetails } = validatedData.data;

  let user: { id: string } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) throw new Error("User not found.");
  } catch (dbError) {
    console.error("CreateMeal Error: Failed to query user", dbError);
    throw new Error("Database error: Failed to retrieve user data.");
  }

  try {
    const createdMeal = await prisma.meal.create({
      data: {
        ...mealDetails,
        userId: user.id,
        ...(foodItems &&
          foodItems.length > 0 && {
            foodItems: {
              create: foodItems.map((item) => ({ ...item })),
            },
          }),
      },
      include: { foodItems: true },
    });

    revalidatePath("/nutrition");
    revalidatePath(`/nutrition/meal/${createdMeal.id}`);
    return createdMeal;
  } catch (error) {
    console.error("Failed to create meal:", error);
    throw new Error("Database error: Failed to create meal.");
  }
};

export const getMealById = async (mealId: string): Promise<MealData | null> => {
  const { userId: clerkId } = await auth();
  if (!clerkId || !mealId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return null;
    }

    const meal = await prisma.meal.findUnique({
      where: {
        id: mealId,
        userId: user.id,
      },
      include: {
        foodItems: {
          select: {
            id: true,
            name: true,
            calories: true,
            protein: true,
            carbs: true,
            fat: true,
            servingSize: true,
            imageUrl: true,
          },
        },
      },
    });

    return meal as MealData | null;
  } catch (error) {
    console.error(`Error fetching meal ${mealId}:`, error);
    return null;
  }
};

export const updateMeal = async (
  mealId: string,
  data: z.infer<typeof UpdateMealSchema>
): Promise<{ success: boolean; error?: string; data?: MealData }> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "User not authenticated." };
  }

  const validatedData = UpdateMealSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Invalid meal update data:", validatedData.error.flatten());
    return {
      success: false,
      error: `Invalid data: ${validatedData.error.flatten().formErrors.join(", ")}`,
    };
  }

  const { mealType, notes } = validatedData.data;

  if (mealType === undefined && notes === undefined) {
    return { success: false, error: "No changes provided." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) throw new Error("User not found.");

    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existingMeal) {
      return { success: false, error: "Meal not found or permission denied." };
    }

    const updatePayload: Prisma.MealUpdateInput = {};
    if (mealType !== undefined) {
      updatePayload.mealType = mealType;
    }
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    const updatedMeal = await prisma.meal.update({
      where: {
        id: mealId,
        userId: user.id,
      },
      data: updatePayload,
      include: { foodItems: true },
    });

    revalidatePath("/nutrition");
    revalidatePath(`/nutrition/meal/${mealId}`);
    return { success: true, data: updatedMeal as MealData };
  } catch (error) {
    console.error(`Failed to update meal ${mealId}:`, error);
    return { success: false, error: "Database error: Failed to update meal." };
  }
};

export const deleteMeal = async (
  mealId: string
): Promise<{ success: boolean; error?: string }> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "User not authenticated." };
  }
  if (!mealId) {
    return { success: false, error: "Meal ID not provided." };
  }

  let user: { id: string } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) throw new Error("User not found.");
  } catch (dbError) {
    console.error("DeleteMeal Error: Failed to query user", dbError);
    return {
      success: false,
      error: "Database error: Failed to retrieve user data.",
    };
  }

  try {
    const meal = await prisma.meal.findFirst({
      where: { id: mealId, userId: user.id },
      select: { id: true },
    });

    if (!meal) {
      return { success: false, error: "Meal not found or permission denied." };
    }

    await prisma.meal.delete({ where: { id: mealId } });

    revalidatePath("/nutrition");
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete meal ${mealId}:`, error);
    return { success: false, error: "Database error: Failed to delete meal." };
  }
};
