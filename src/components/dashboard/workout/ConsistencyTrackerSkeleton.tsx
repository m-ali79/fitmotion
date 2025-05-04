import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ConsistencyTrackerSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <Skeleton className="h-6 w-1/2 bg-gray-700 rounded" /> {/* Title */}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6 p-6 text-center">
        {/* Current Streak Skeleton */}
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-3/4 bg-gray-600 rounded" /> {/* Label */}
          <Skeleton className="h-8 w-1/2 bg-gray-700 rounded" /> {/* Value */}
        </div>
        {/* Longest Streak Skeleton */}
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-3/4 bg-gray-600 rounded" /> {/* Label */}
          <Skeleton className="h-8 w-1/2 bg-gray-700 rounded" /> {/* Value */}
        </div>
        {/* Workout Days Skeleton */}
        <div className="flex flex-col items-center col-span-2 pt-2 gap-1">
          <Skeleton className="h-4 w-1/2 bg-gray-600 rounded" /> {/* Label */}
          <Skeleton className="h-6 w-1/4 bg-gray-700 rounded" /> {/* Value */}
        </div>
      </CardContent>
    </Card>
  );
}
