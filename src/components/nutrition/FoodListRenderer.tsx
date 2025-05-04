"use client";

import React from "react";
import { MealData } from "@/types/nutrition";
import { FoodItemGroupCard } from "./FoodItemGroupCard";
import { EmptyStateFood } from "./EmptyStateFood";
import { format, isSameDay } from "date-fns";
import { Utensils } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface FoodListRendererProps {
  meals: MealData[] | null;
  activeTab: string;
}

const groupMealsByType = (meals: MealData[]) => {
  return meals.reduce(
    (acc, meal) => {
      const type = meal.mealType.toLowerCase();
      if (!acc[type]) {
        acc[type] = { totalCalories: 0, items: [] };
      }
      acc[type].items.push(meal);
      acc[type].totalCalories += meal.calories;
      return acc;
    },
    {} as Record<string, { totalCalories: number; items: MealData[] }>
  );
};

const groupMealsByDate = (meals: MealData[]) => {
  return meals.reduce(
    (acc, meal) => {
      const dateKey = format(meal.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(meal);
      return acc;
    },
    {} as Record<string, MealData[]>
  );
};

const mealTypeOrder = { breakfast: 1, lunch: 2, dinner: 3, snack: 4 };

export const FoodListRenderer = ({
  meals,
  activeTab,
}: FoodListRendererProps) => {
  if (!meals || meals.length === 0) {
    let title = "No meals logged yet";
    let description = "Start logging your meals to see them here.";
    if (activeTab === "today") {
      description =
        "Use the Scan Food button to add your first meal for today.";
    } else if (activeTab === "week") {
      title = "No meals logged this week";
      description = "Log meals throughout the week to see your summary.";
    } else {
      title = "No meals found";
      description = "No meals match your current filters.";
    }
    return <EmptyStateFood title={title} description={description} />;
  }

  if (activeTab === "today") {
    const grouped = groupMealsByType(meals);
    const sortedTypes = Object.entries(grouped).sort(([a], [b]) => {
      return (
        (mealTypeOrder[a as keyof typeof mealTypeOrder] || 99) -
        (mealTypeOrder[b as keyof typeof mealTypeOrder] || 99)
      );
    });

    return (
      <div className="space-y-6">
        {sortedTypes.map(([type, group], groupIndex) => (
          <div key={type}>
            <motion.div
              className="flex items-center gap-3 mb-3 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            >
              <div className="h-8 w-8 rounded-lg bg-fitness-primary/10 flex items-center justify-center flex-shrink-0">
                <Utensils className="h-4 w-4 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-fitness-text capitalize text-lg">
                {type}
              </h3>
              <Separator className="flex-1 bg-fitness-border/50" />
              <span className="text-sm text-fitness-muted flex-shrink-0">
                {group.totalCalories.toFixed(0)} kcal
              </span>
            </motion.div>
            <div className="space-y-3 pl-2 border-l-2 border-fitness-border/20 ml-3">
              {group.items.map((meal, mealIndex) => (
                <FoodItemGroupCard
                  key={meal.id}
                  meal={meal}
                  index={mealIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    const groupedByDate = groupMealsByDate(meals);
    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
      b.localeCompare(a)
    );

    return (
      <div className="space-y-8">
        {sortedDates.map((dateKey, dateIndex) => {
          const mealsForDate = groupedByDate[dateKey];
          const groupedByType = groupMealsByType(mealsForDate);
          const sortedTypes = Object.entries(groupedByType).sort(([a], [b]) => {
            return (
              (mealTypeOrder[a as keyof typeof mealTypeOrder] || 99) -
              (mealTypeOrder[b as keyof typeof mealTypeOrder] || 99)
            );
          });

          const dateObject = new Date(dateKey + "T00:00:00");
          const formattedDate = isSameDay(dateObject, new Date())
            ? "Today"
            : format(dateObject, "eeee, LLL d");

          return (
            <div key={dateKey}>
              <motion.h2
                className="text-xl font-semibold text-fitness-text mb-4   py-2 "
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: dateIndex * 0.05 }}
                layout
              >
                {formattedDate}
              </motion.h2>
              <div className="space-y-6 pl-2">
                {sortedTypes.map(([type, group], groupIndex) => (
                  <div key={`${dateKey}-${type}`}>
                    <motion.div
                      className="flex items-center gap-3 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: dateIndex * 0.05 + groupIndex * 0.08,
                      }}
                    >
                      <div className="h-7 w-7 rounded-md bg-fitness-primary/10 flex items-center justify-center flex-shrink-0">
                        <Utensils className="h-4 w-4 text-fitness-primary" />
                      </div>
                      <h3 className="font-medium text-fitness-text capitalize">
                        {type}
                      </h3>
                      <Separator className="flex-1 bg-fitness-border/50" />
                      <span className="text-xs text-fitness-muted flex-shrink-0">
                        {group.totalCalories.toFixed(0)} kcal
                      </span>
                    </motion.div>
                    <div className="space-y-3 pl-2 border-l-2 border-fitness-border/20 ml-3">
                      {group.items.map((meal, mealIndex) => (
                        <FoodItemGroupCard
                          key={meal.id}
                          meal={meal}
                          index={mealIndex}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};
