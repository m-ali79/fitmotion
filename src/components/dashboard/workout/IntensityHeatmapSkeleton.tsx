import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IntensityHeatmapSkeleton() {
  return (
    <Card className="bg-[#1a1a2e] border-gray-700 text-white rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg text-gray-300">
          <Skeleton className="h-6 w-48 bg-gray-600 rounded" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/*  Grid Skeleton for Heatmap Placeholder */}
        <div className="flex flex-col items-center space-y-2">
          {/* Month labels (placeholder) */}
          <div className="flex justify-between w-full px-4 mb-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-10 bg-gray-600 rounded" />
            ))}
          </div>
          {/* Heatmap grid skeleton */}
          <div className="grid grid-cols-7 gap-1 w-full max-w-md">
            {[...Array(7 * 5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 bg-gray-700 rounded-sm" />
            ))}
          </div>
          {/* Legend skeleton */}
          <div className="flex justify-center space-x-2 pt-4">
            <Skeleton className="h-4 w-16 bg-gray-600 rounded" />
            <Skeleton className="h-4 w-4 bg-gray-700 rounded-sm" />
            <Skeleton className="h-4 w-4 bg-gray-700 rounded-sm" />
            <Skeleton className="h-4 w-4 bg-gray-700 rounded-sm" />
            <Skeleton className="h-4 w-4 bg-gray-700 rounded-sm" />
            <Skeleton className="h-4 w-16 bg-gray-600 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
