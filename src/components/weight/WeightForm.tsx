"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogWeightSchema, LogWeightFormData } from "@/types/weight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WeightFormProps {
  onSubmit: (data: LogWeightFormData) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  initialData?: Partial<LogWeightFormData>;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export const WeightForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData = { weightKg: undefined, notes: "" },
  submitButtonText = "Log Weight",
  cancelButtonText = "Cancel",
}: WeightFormProps) => {
  const form = useForm<LogWeightFormData>({
    resolver: zodResolver(LogWeightSchema),
    defaultValues: {
      weightKg: initialData.weightKg,
      notes: initialData.notes ?? "",
    },
  });

  const handleFormSubmit = (data: LogWeightFormData) => {
    const dataToSend = {
      ...data,
      weightKg: Number(data.weightKg),
    };
    onSubmit(dataToSend);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-4 py-4"
    >
      <div>
        <Label htmlFor="weightKg" className="text-fitness-muted">
          Weight (kg)
        </Label>
        <Input
          id="weightKg"
          type="number"
          step="0.1"
          {...form.register("weightKg", { valueAsNumber: true })}
          className="bg-input border-gray-600 focus-visible:ring-fitness-primary"
          aria-invalid={form.formState.errors.weightKg ? "true" : "false"}
        />
        {form.formState.errors.weightKg && (
          <p role="alert" className="text-sm text-red-500 mt-1">
            {form.formState.errors.weightKg.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="notes" className="text-fitness-muted">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Any relevant notes?"
          className="bg-input border-gray-600 focus-visible:ring-fitness-primary resize-none"
          rows={3}
          aria-invalid={form.formState.errors.notes ? "true" : "false"}
        />
        {form.formState.errors.notes && (
          <p role="alert" className="text-sm text-red-500 mt-1">
            {form.formState.errors.notes.message}
          </p>
        )}
      </div>
      {/* Form actions (Submit/Cancel) */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-fitness-primary hover:bg-fitness-primary/90 btn-hover-effect"
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};
