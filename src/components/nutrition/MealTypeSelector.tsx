"use client";

import React from "react";
import { MealType } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MealTypeSelectorProps {
  selectedValue: MealType | undefined;
  onValueChange: (value: MealType) => void;
}

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const formatMealType = (type: MealType) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const MealTypeSelector = ({
  selectedValue,
  onValueChange,
}: MealTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">
        Categorize Meal As:
      </Label>
      <RadioGroup
        defaultValue={selectedValue}
        onValueChange={(value: string) => onValueChange(value as MealType)}
        className="grid grid-cols-2 gap-3 pt-1"
      >
        {mealTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <RadioGroupItem value={type} id={`mealType-${type}`} />
            <Label
              htmlFor={`mealType-${type}`}
              className="font-normal cursor-pointer"
            >
              {formatMealType(type)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
