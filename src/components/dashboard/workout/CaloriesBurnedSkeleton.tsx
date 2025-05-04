import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CaloriesBurnedSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" /> {/* Title */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" /> {/* Chart */}
      </CardContent>
    </Card>
  );
}
