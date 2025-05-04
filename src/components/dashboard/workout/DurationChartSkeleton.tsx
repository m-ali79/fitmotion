import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DurationChartSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        {/* Title  */}
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent>
        {/* Chart Area */}
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
