// src/components/workout/WorkoutForm.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutType } from "@prisma/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { EffortLevel } from "@prisma/client";
import { calculateWorkoutCalories } from "@/lib/workout-calculations";
import { WorkoutData } from "@/types/workout";

const workoutFormSchema = z.object({
  duration: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .min(1, { message: "Duration must be at least 1 minute." })
    .max(720, { message: "Duration cannot exceed 12 hours." }),
  effortLevel: z.nativeEnum(EffortLevel, {
    errorMap: () => ({ message: "Please select an effort level." }),
  }),
  notes: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

export type SubmittedWorkoutFormData = Omit<
  WorkoutFormData,
  "caloriesBurned"
> & {
  caloriesBurned: number | null;
  type: WorkoutType;
};

interface WorkoutFormProps {
  workoutType: WorkoutType;
  userWeightKg: number | null;
  onSubmit: (data: SubmittedWorkoutFormData) => void;
  onBack?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
  initialData?: Partial<WorkoutData>;
}

const WorkoutForm = ({
  workoutType,
  onSubmit,
  onBack,
  onCancel,
  userWeightKg,
  isSubmitting,
  isEditing = false,
  initialData,
}: WorkoutFormProps) => {
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      duration: initialData?.duration ?? 60,
      effortLevel: initialData?.effortLevel ?? undefined,
      notes: initialData?.notes ?? "",
    },
  });

  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(
    null
  );
  const [displayCalories, setDisplayCalories] = useState<string>("");
  const [isManualInput, setIsManualInput] = useState<boolean>(false);

  const calculateAndUpdateDisplay = useCallback(() => {
    const { duration, effortLevel } = form.getValues();
    if (duration > 0 && effortLevel) {
      const calories = calculateWorkoutCalories({
        workoutType,
        duration: Number(duration),
        effortLevel: effortLevel,
        userWeightKg: userWeightKg,
      });
      setCalculatedCalories(calories);
      if (!isManualInput) {
        setDisplayCalories(calories !== null ? String(calories) : "");
      }
    } else {
      setCalculatedCalories(null);
      if (!isManualInput) {
        setDisplayCalories("");
      }
    }
  }, [form, workoutType, userWeightKg, isManualInput]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        duration: initialData.duration ?? 60,
        effortLevel: initialData.effortLevel ?? undefined,
        notes: initialData.notes ?? "",
      });

      const initialSavedCalories = initialData.caloriesBurned;
      setDisplayCalories(
        initialSavedCalories !== null && initialSavedCalories !== undefined
          ? String(initialSavedCalories)
          : ""
      );
      setIsManualInput(false);

      if (initialData.duration && initialData.effortLevel) {
        const initialCalc = calculateWorkoutCalories({
          workoutType,
          duration: Number(initialData.duration),
          effortLevel: initialData.effortLevel,
          userWeightKg: userWeightKg,
        });
        setCalculatedCalories(initialCalc);
      } else {
        setCalculatedCalories(null);
      }
    } else {
      form.reset({ duration: 60, effortLevel: undefined, notes: "" });
      setDisplayCalories("");
      setIsManualInput(false);
      setCalculatedCalories(null);
    }
  }, [initialData, form, workoutType, userWeightKg]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "duration" || name === "effortLevel") {
        setIsManualInput(false);
        calculateAndUpdateDisplay();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form, calculateAndUpdateDisplay]);

  const handleManualCalorieChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDisplayCalories(e.target.value);
    setIsManualInput(true);
  };

  const handleFormSubmit = (values: WorkoutFormData) => {
    let finalCalories: number | null = null;

    if (isManualInput) {
      const parsedManual = parseInt(displayCalories, 10);
      if (!isNaN(parsedManual) && parsedManual >= 0) {
        finalCalories = parsedManual;
      } else {
        finalCalories = calculatedCalories;
        if (displayCalories.trim() !== "") {
          toast.warning(
            "Invalid calorie input ignored. Using calculated value.",
            { duration: 4000 }
          );
        }
      }
    } else {
      finalCalories = calculatedCalories;
    }

    onSubmit({
      ...values,
      caloriesBurned: finalCalories,
      type: workoutType,
      notes: values.notes,
    });
    toast.info(
      isEditing ? `Updating workout...` : `Submitting ${workoutType} workout...`
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Duration Field */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 60" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Effort Level Field */}
        <FormField
          control={form.control}
          name="effortLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effort Level</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setIsManualInput(false);
                  calculateAndUpdateDisplay();
                }}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select effort level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(EffortLevel).map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="capitalize"
                    >
                      {level.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Calories Burned Field */}
        <FormItem>
          <FormLabel>Energy Burned (Kcal)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={
                calculatedCalories !== null &&
                calculatedCalories > 0 &&
                !isManualInput
                  ? `Est. ${calculatedCalories}`
                  : "Manually enter or select duration/effort"
              }
              value={displayCalories}
              onChange={handleManualCalorieChange}
              className="font-medium"
              min="0"
            />
          </FormControl>
          <p className="text-xs text-muted-foreground pt-1">
            {userWeightKg
              ? "Auto-calculated estimate. Override if needed."
              : "Weight needed for estimate. Enter manually."}
          </p>
          <FormMessage />
        </FormItem>

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Felt strong today, focused on form..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-8">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {isEditing && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Workout"
                : "Add To Diary"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutForm;
