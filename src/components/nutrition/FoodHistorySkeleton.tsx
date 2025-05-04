import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FoodHistorySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48 rounded-md" /> {/* Search */}
        <Skeleton className="h-9 w-24 rounded-lg" /> {/* Filter Button */}
      </div>

      {/* Tabs */}
      <div className="inline-flex bg-card p-1 rounded-xl border border-border h-auto">
        <Skeleton className="h-9 w-20 rounded-lg mr-1" />
        <Skeleton className="h-9 w-20 rounded-lg mr-1" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>

      {/* Meal Group */}
      {[...Array(3)].map((_, groupIndex) => (
        <div key={`skel-group-${groupIndex}`} className="space-y-4 pt-4">
          {/* Group Header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" /> {/* Icon */}
            <Skeleton className="h-6 w-32 rounded-md" /> {/* Title */}
            <Skeleton className="h-px flex-1 bg-border" /> {/* Separator */}
            <Skeleton className="h-5 w-16 rounded-md" /> {/* Total Cal */}
          </div>

          {/* Item Card */}
          {[...Array(2)].map((_, itemIndex) => (
            <div
              key={`skel-item-${groupIndex}-${itemIndex}`}
              className="flex items-center gap-4 p-4 rounded-3xl bg-card"
            >
              <Skeleton className="h-16 w-16 rounded-2xl flex-shrink-0" />{" "}
              {/* Image */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" /> {/* Name */}
                <Skeleton className="h-4 w-1/4 rounded-md" />{" "}
                {/* Serving Size */}
                <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Macros */}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center items-center pt-4">
        <Skeleton className="h-9 w-20 rounded-md mr-2" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md ml-2" />
      </div>
    </div>
  );
};
