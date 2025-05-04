import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeightTrendChartSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        {/* Title Placeholder */}
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent>
        {/* Chart Area Placeholder */}
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
