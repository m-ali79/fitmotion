"use client";

import React, { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale } from "lucide-react";
import { WeightEntryWithComputed } from "@/types/weight";
import { WeightCard } from "./WeightCard";

interface HistoryData {
  entries: WeightEntryWithComputed[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface WeightHistoryProps {
  historyDataPromise: Promise<HistoryData | null>;
  currentPage: number;
}

const WeightHistory = ({
  historyDataPromise,
  currentPage,
}: WeightHistoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const historyData = use(historyDataPromise);

  if (!historyData) {
    return (
      <div className="text-center text-red-500">Error loading history.</div>
    );
  }

  const { entries, totalPages } = historyData;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div className="text-center text-gray-400 py-16 px-6 rounded-xl border border-dashed border-gray-700 bg-card">
          <Scale className="mx-auto h-10 w-10 text-gray-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-300 mb-1">
            No Weight Logged Yet
          </h3>
          <p className="text-sm">
            Use the button above to log your first weight entry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <WeightCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WeightHistory;
