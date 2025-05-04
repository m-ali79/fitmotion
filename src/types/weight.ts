import { z } from "zod";
import { WeightEntry as PrismaWeightEntry } from "@prisma/client";

export const LogWeightSchema = z.object({
  weightKg: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive("Weight must be positive"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type LogWeightFormData = z.infer<typeof LogWeightSchema>;

export type WeightEntryWithComputed = PrismaWeightEntry & {
  changeFromLast: number | null;
  bmi: number | null;
};
