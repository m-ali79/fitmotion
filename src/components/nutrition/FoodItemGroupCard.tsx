"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MealData } from "@/types/nutrition";
import { Utensils } from "lucide-react";
import { motion } from "framer-motion";

interface FoodItemGroupCardProps {
  meal: MealData;
  index: number;
}

export const FoodItemGroupCard = ({ meal, index }: FoodItemGroupCardProps) => {
  return (
    <Link
      href={`/nutrition/meal/${meal.id}`}
      className="block group"
      aria-label={`View details for ${meal.name}`}
    >
      <motion.div
        className="flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card shadow-sm group-hover:bg-muted/20 group-hover:shadow-md transition-all duration-300 ease-out"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, delay: index * 0.1, ease: "easeInOut" }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 ease-out">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
          )}
        </div>

        <div className="w-full sm:flex-grow min-w-0">
          <h4 className="font-semibold text-base text-card-foreground mb-0.5 leading-tight group-hover:text-primary transition-colors sm:truncate">
            {meal.name}
          </h4>
          <p className="text-sm text-muted-foreground capitalize">
            {meal.mealType}
          </p>
        </div>

        <div className="w-full sm:w-auto text-left sm:text-right sm:flex-shrink-0 mt-1 sm:mt-0">
          <p className="font-medium text-card-foreground mb-1 sm:mb-0">
            {meal.calories.toFixed(0)} kcal
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 sm:flex-nowrap sm:gap-2 text-xs text-muted-foreground sm:mt-1">
            <span className="text-primary font-medium">
              P:{meal.protein.toFixed(0)}g
            </span>
            <span className="text-accent font-medium">
              C:{meal.carbs.toFixed(0)}g
            </span>
            <span className="text-red-500 font-medium">
              F:{meal.fat.toFixed(0)}g
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
