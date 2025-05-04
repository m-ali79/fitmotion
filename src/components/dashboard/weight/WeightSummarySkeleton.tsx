import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeightSummarySkeleton() {
  const count = 4;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="rounded-3xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full mb-3" />
              {/* Label */}
              <Skeleton className="h-4 w-3/4 mb-2" />
              {/* Value */}
              <Skeleton className="h-8 w-1/2 mb-1" />
              {/* Trend */}
              <Skeleton className="h-3 w-1/3 mt-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
