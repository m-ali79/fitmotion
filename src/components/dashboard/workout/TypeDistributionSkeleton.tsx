import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TypeDistributionSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <Skeleton className="h-6 w-2/5" /> {/* Title  */}
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 p-6">
        {/* Chart Placeholder */}
        <Skeleton className="h-40 w-40 rounded-full" />
        {/* Legend Placeholder */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </CardContent>
    </Card>
  );
}
