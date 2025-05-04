import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const WeightCardSkeleton = () => (
  <Card className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
    <CardContent className="px-4 py-3 sm:py-4 flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Date  */}
      <div className="w-full sm:w-auto text-left sm:text-center flex-shrink-0 pr-4 sm:border-r sm:border-border/50">
        <Skeleton className="h-3 w-8 mb-1" />
        <Skeleton className="h-6 w-6 mb-1" />
        <Skeleton className="h-3 w-10 hidden sm:block" />
        <Skeleton className="h-3 w-20 sm:hidden" />
      </div>
      {/* Details  */}
      <div className="flex-grow space-y-1 min-w-0 w-full sm:w-auto">
        <Skeleton className="h-5 w-16" />
      </div>
      {/* Stats  */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 text-sm sm:flex-shrink-0 mt-2 sm:mt-0 sm:pl-4 sm:border-l sm:border-border/50">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </CardContent>
  </Card>
);

export function WeightHistorySkeleton() {
  const items = Array.from({ length: 5 });

  return (
    <div className="space-y-3">
      {items.map((_, index) => (
        <WeightCardSkeleton key={index} />
      ))}
    </div>
  );
}
