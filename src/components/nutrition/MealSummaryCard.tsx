import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodAnalysisResult } from "@/types/nutrition";
import { Progress } from "@/components/ui/progress";

interface MealSummaryCardProps {
  result: FoodAnalysisResult;
}

export const MealSummaryCard = ({ result }: MealSummaryCardProps) => {
  const totalCalories = result.totalEstimatedCalories;
  const proteinCalories = result.totalEstimatedProtein * 4;
  const carbsCalories = result.totalEstimatedCarbs * 4;
  const fatCalories = result.totalEstimatedFat * 9;

  const proteinPercent =
    totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbsPercent =
    totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
  const fatPercent =
    totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

  return (
    <Card className="rounded-2xl shadow-md card-hover-effect overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-fitness-text text-lg text-center font-medium">
          Meal Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2 pb-6">
        <div className="text-center py-4 border-b border-fitness-border">
          <p className="text-xs text-fitness-muted uppercase tracking-wider mb-1">
            Total Calories
          </p>
          <p className="text-5xl font-bold text-fitness-primary leading-none">
            {result.totalEstimatedCalories.toFixed(0)}
          </p>
          <p className="text-sm text-fitness-muted mt-1">kcal</p>
        </div>

        <div className="space-y-4 px-2">
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-fitness-text">
                Protein
              </span>
              <span className="text-sm text-fitness-muted">
                {result.totalEstimatedProtein.toFixed(1)} g
              </span>
            </div>
            <Progress
              value={proteinPercent}
              className="h-2 [&>*]:bg-fitness-primary"
              aria-label={`Protein contribution: ${proteinPercent.toFixed(0)}%`}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-fitness-text">
                Carbs
              </span>
              <span className="text-sm text-fitness-muted">
                {result.totalEstimatedCarbs.toFixed(1)} g
              </span>
            </div>
            <Progress
              value={carbsPercent}
              className="h-2 [&>*]:bg-fitness-accent"
              aria-label={`Carbohydrate contribution: ${carbsPercent.toFixed(0)}%`}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-fitness-text">Fat</span>
              <span className="text-sm text-fitness-muted">
                {result.totalEstimatedFat.toFixed(1)} g
              </span>
            </div>
            <Progress
              value={fatPercent}
              className="h-2 [&>*]:bg-red-500"
              aria-label={`Fat contribution: ${fatPercent.toFixed(0)}%`}
            />
          </div>
        </div>

        {result.explanation && (
          <p className="text-xs text-fitness-muted italic pt-4 border-t border-fitness-border mt-5 px-2">
            Note: {result.explanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
