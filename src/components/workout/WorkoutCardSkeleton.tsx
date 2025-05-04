import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const WorkoutCardSkeleton = () => {
  return (
    <Card className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden animate-pulse">
      <CardContent className="px-4 py-3 flex items-center gap-4">
        <div className="p-2 bg-muted rounded-lg flex-shrink-0">
          <div className="h-6 w-6 bg-muted-foreground/30 rounded"></div>
        </div>
        <div className="flex-grow space-y-1.5 min-w-0">
          <div className="h-4 w-3/4 bg-muted-foreground/30 rounded"></div>
          <div className="h-3 w-1/2 bg-muted-foreground/30 rounded"></div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="h-4 w-10 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-10 bg-muted-foreground/30 rounded"></div>
          <div className="h-5 w-16 bg-muted-foreground/30 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};
