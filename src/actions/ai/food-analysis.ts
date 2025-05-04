"use server";

import { z } from "zod";
import { generateObject } from "ai";
import { gemini } from "@/lib/ai";

const IdentifiedFoodItemSchema = z.object({
  name: z
    .string()
    .describe(
      "Name of the identified food item (e.g., 'Grilled Chicken Breast', 'Steamed Broccoli')"
    ),
  servingSize: z
    .string()
    .describe("Estimated serving size (e.g., '1 cup', '100g', '4 oz')"),
  calories: z
    .number()
    .positive()
    .describe("Estimated calories for this item's serving size"),
  protein: z
    .number()
    .nonnegative()
    .describe("Estimated protein (grams) for this item's serving size"),
  carbs: z
    .number()
    .nonnegative()
    .describe("Estimated carbohydrates (grams) for this item's serving size"),
  fat: z
    .number()
    .nonnegative()
    .describe("Estimated fat (grams) for this item's serving size"),
  imageUrl: z
    .string()
    .describe(
      "URL of a clear, representative image of this specific food item (e.g., a close-up of just the broccoli). Optional."
    ),
});

const FoodAnalysisSchema = z.object({
  mealName: z
    .string()
    .describe(
      "A concise, descriptive name for the entire meal (e.g., 'Chicken Salad with Vinaigrette', 'Burger and Fries')."
    ),
  foodItems: z
    .array(IdentifiedFoodItemSchema)
    .describe(
      "List of identified food items, their estimated nutrition, and generated representative image URL for each item."
    ),
  totalEstimatedCalories: z
    .number()
    .positive()
    .describe("Estimated total calories for the entire meal shown"),
  totalEstimatedProtein: z
    .number()
    .nonnegative()
    .describe("Estimated total protein (grams) for the entire meal"),
  totalEstimatedCarbs: z
    .number()
    .nonnegative()
    .describe("Estimated total carbohydrates (grams) for the entire meal"),
  totalEstimatedFat: z
    .number()
    .nonnegative()
    .describe("Estimated total fat (grams) for the entire meal"),
  explanation: z
    .string()
    .describe(
      "General explanation or notes about the overall estimation (e.g., confidence level, portion size assumptions, image clarity issues)."
    ),
});

export type FoodAnalysisResult = z.infer<typeof FoodAnalysisSchema>;
export type AnalyzedFoodItem = z.infer<typeof IdentifiedFoodItemSchema>;

const AnalyzeImageInputSchema = z
  .object({
    imageBase64: z.string().optional(),
  })
  .refine((data) => data.imageBase64, {
    message: "Either imageBase64 or imageUrl must be provided",
  });

type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

export async function analyzeFoodImage(
  input: AnalyzeImageInput
): Promise<{ success: boolean; data?: FoodAnalysisResult; error?: string }> {
  const validation = AnalyzeImageInputSchema.safeParse(input);
  if (!validation.success) {
    const formattedError = validation.error.format();
    console.error("Invalid input for image analysis:", formattedError);
    return {
      success: false,
      error: `Invalid input: ${JSON.stringify(formattedError)}`,
    };
  }

  const { imageBase64 } = validation.data;

  let imagePart: { image: Buffer | URL; mimeType?: string } | null = null;
  try {
    if (imageBase64) {
      const mimeTypeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeTypeMatch
        ? mimeTypeMatch[1]
        : "application/octet-stream";
      const base64Data = imageBase64.split(",")[1];
      if (!base64Data) throw new Error("Invalid base64 data format.");
      imagePart = { image: Buffer.from(base64Data, "base64"), mimeType };
    } else {
      throw new Error("No image source provided.");
    }
  } catch (error: unknown) {
    console.error("Error processing image input:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred processing the image.";
    return {
      success: false,
      error: `Error processing image input: ${message}`,
    };
  }

  const prompt = `Analyze the provided image containing a meal. 

1. First, provide a concise, descriptive name for the overall meal pictured (e.g., 'Grilled Chicken Salad', 'Beef Stir-fry with Rice', 'Cheeseburger and Fries').
2. Then, identify each distinct food item present. For each item, estimate its serving size (e.g., '1 cup', '100g', '1 slice'), its nutritional content (calories, protein, carbs, fat) for that serving size, AND generate a representative image URL for this specific food item.
3. **IMPORTANT**: Generate the 'imageUrl' using the 'image.pollinations.ai' service format: \`https://image.pollinations.ai/prompt/<PROMPT>\`, where <PROMPT> is a URL-encoded descriptive prompt for the specific food item. **Crucially, this prompt should request a clear, close-up photograph showing ONLY the item itself** (e.g., \`clear%20close-up%20photograph%20of%20steamed%20broccoli\`). Ensure the final URL is valid and correctly encoded.

4. Calculate the estimated total nutritional values for the entire meal shown by summing the individual item estimates.

Provide the results as a JSON object strictly conforming to the following schema: 
{ 
  "mealName": string, 
  "foodItems": [ { "name": string, "servingSize": string, "calories": number, "protein": number, "carbs": number, "fat": number, "imageUrl": string } ], 
  "totalEstimatedCalories": number, 
  "totalEstimatedProtein": number, 
  "totalEstimatedCarbs": number, 
  "totalEstimatedFat": number, 
  "explanation": string 
}

The 'explanation' should briefly summarize the findings, mention any significant assumptions made about ingredients or portion sizes if they weren't clear from the image, and potentially note the confidence level of the estimation.`;

  try {
    const result = await generateObject({
      model: gemini,
      schema: FoodAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: imagePart.image,
              ...(imagePart.mimeType && { mimeType: imagePart.mimeType }),
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    return { success: true, data: result.object };
  } catch (error: unknown) {
    console.error(
      "Error analyzing food image with AI:",
      error instanceof Error ? error.message : error,
      error instanceof Error && error.cause ? `\nCause: ${error.cause}` : ""
    );
    let errorMessage =
      "Failed to analyze food image due to an AI service error. Please try again.";

    if (error instanceof Error && error.message) {
      const message = error.message;
      if (message.includes("SAFETY")) {
        errorMessage =
          "Analysis failed due to safety settings. The image might contain restricted content.";
      } else if (
        message.includes("No object generated") ||
        message.includes("response did not match schema") ||
        message.includes("format: only 'enum' and 'date-time' are supported")
      ) {
        errorMessage =
          "Could not analyze image. Please ensure it's a clear picture of food, or try again.";
      } else {
        errorMessage = `AI analysis failed: ${message}`;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}
