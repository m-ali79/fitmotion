"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FoodItemData } from "@/types/nutrition";

interface FoodItemCardProps {
  item: FoodItemData;
}
export const FoodItemCard = ({ item }: FoodItemCardProps) => (
  <Card className="overflow-hidden rounded-lg shadow-md bg-fitness-card card-hover-effect">
    <div className="w-full h-36 relative bg-fitness-gray">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}
    </div>

    <CardContent className="p-3 sm:p-4 space-y-2">
      <div>
        <h3 className="font-semibold text-lg mb-1 text-fitness-text leading-tight truncate">
          {item.name}
        </h3>
        {item.servingSize && (
          <p className="text-sm text-fitness-muted mb-3">{item.servingSize}</p>
        )}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-fitness-muted">Calories:</span>
          <span className="font-medium text-fitness-text">
            {item.calories.toFixed(0)} kcal
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-fitness-muted">Protein:</span>
          <span className="text-fitness-text">{item.protein.toFixed(1)} g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fitness-muted">Carbs:</span>
          <span className="text-fitness-text">{item.carbs.toFixed(1)} g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fitness-muted">Fat:</span>
          <span className="text-fitness-text">{item.fat.toFixed(1)} g</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
