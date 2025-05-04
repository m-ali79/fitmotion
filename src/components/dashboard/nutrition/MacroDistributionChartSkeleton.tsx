import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MacroDistributionChartSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <Skeleton className="h-6 w-2/5" /> {/* Title */}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {/* Radial Chart Placeholder */}
        <Skeleton className="h-48 w-48 rounded-full mb-4" />
        {/* Legend/Info Placeholder */}
        <div className="flex flex-col gap-2 items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
