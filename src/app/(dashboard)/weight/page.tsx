import React, { Suspense } from "react";
import WeightLogger from "@/components/weight/WeightLogger";
import { fetchWeightHistory } from "@/actions/weight";
import WeightHistory from "@/components/weight/WeightHistory";
import { WeightHistorySkeleton } from "@/components/weight/WeightHistorySkeleton";

interface WeightPageProps {
  searchParams?: Promise<{ page?: string } | undefined>;
}

const WeightPage = async ({ searchParams }: WeightPageProps) => {
  const { page } = (await searchParams) ?? {};
  const currentPage = parseInt(page ?? "1", 10);
  const historyDataPromise = fetchWeightHistory(currentPage);

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-fitness-text">
            Weight Tracker
          </h1>
          <p className="text-fitness-muted">
            Monitor your weight changes over time.
          </p>
        </div>
        <div className="flex gap-3">
          {/* Weight Logger Button/Component */}
          <WeightLogger />
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-fitness-text">History</h2>
        <Suspense fallback={<WeightHistorySkeleton />}>
          <WeightHistory
            historyDataPromise={historyDataPromise}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default WeightPage;
