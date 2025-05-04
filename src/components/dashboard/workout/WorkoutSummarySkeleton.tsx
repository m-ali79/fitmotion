import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkoutSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <Skeleton className="h-12 w-12 rounded-full mb-3" />
              {/* Label */}
              <Skeleton className="h-4 w-3/4 mb-2" />
              {/* Value */}
              <Skeleton className="h-8 w-1/2 mb-1" />
              {/* Trend (Optional) */}
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
