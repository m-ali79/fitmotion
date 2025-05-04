import React from "react";
import { WorkoutCardSkeleton } from "./WorkoutCardSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SlidersHorizontal } from "lucide-react";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

const WorkoutHistorySkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="rounded-lg flex-shrink-0 opacity-50 cursor-not-allowed"
          disabled
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card p-1 rounded-xl border border-border h-auto mb-4 inline-flex opacity-50 cursor-not-allowed">
          {["today", "week", "all"].map((tabValue) => (
            <TabsTrigger
              key={`skel-tab-${tabValue}`}
              value={tabValue}
              disabled
              className="rounded-lg data-[state=active]:bg-muted data-[state=active]:text-muted-foreground px-4 py-1.5 text-sm font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0 capitalize cursor-not-allowed"
            >
              {tabValue === "week" ? "This Week" : tabValue}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-3">
            {[...Array(count)].map((_, i) => (
              <WorkoutCardSkeleton key={`hist-skel-${i}`} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Pagination className="mt-6">
        <PaginationContent>
          <div className="h-9 w-48 bg-muted rounded-lg animate-pulse"></div>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default WorkoutHistorySkeleton;
