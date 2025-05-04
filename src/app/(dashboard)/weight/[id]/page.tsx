import React from "react";
import { fetchWeightEntryById } from "@/actions/weight";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Scale,
  TrendingUp,
  StickyNote,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WeightDetailActions } from "./WeightDetailActions";

import { cn } from "@/lib/utils";

interface WeightDetailPageProps {
  params: Promise<{ id: string }>;
}

const WeightDetailPage = async ({ params }: WeightDetailPageProps) => {
  const { id } = await params;
  const entry = await fetchWeightEntryById(id);

  if (!entry) {
    notFound();
  }

  const changeColor = entry.changeFromLast
    ? entry.changeFromLast > 0
      ? "text-red-500"
      : "text-green-500"
    : "text-muted-foreground";

  const ChangeIcon = entry.changeFromLast
    ? entry.changeFromLast > 0
      ? ArrowUp
      : ArrowDown
    : null;

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-fitness-text flex items-center gap-2">
            <Scale className="inline-block h-7 w-7" />
            Weight Entry
          </h1>
          <p className="text-fitness-muted flex items-center gap-2">
            <Calendar className="inline-block h-4 w-4" />
            {format(entry.date, "eeee, MMMM do, yyyy 'at' p")}
          </p>
        </div>
        <WeightDetailActions entryId={entry.id} />
      </div>

      {/* Main Details Card */}
      <div className="bg-card p-6 rounded-2xl shadow-md border border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Weight */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Scale className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="text-xl font-semibold text-card-foreground">
                {entry.weightKg.toFixed(1)} kg
              </p>
            </div>
          </div>

          {/* Change */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            {ChangeIcon ? (
              <ChangeIcon
                className={cn("h-6 w-6 flex-shrink-0", changeColor)}
              />
            ) : (
              <Hash className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Change</p>
              <p className={cn("text-xl font-semibold", changeColor)}>
                {entry.changeFromLast !== null
                  ? `${entry.changeFromLast > 0 ? "+" : ""}${entry.changeFromLast.toFixed(1)} kg`
                  : "First Entry"}
              </p>
            </div>
          </div>

          {/* BMI */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">BMI</p>
              <p className="text-xl font-semibold text-card-foreground">
                {entry.bmi !== null ? entry.bmi.toFixed(1) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {entry.notes && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <h2 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <StickyNote className="inline-block h-5 w-5" /> Notes
            </h2>
            <p className="text-muted-foreground whitespace-pre-wrap truncate">
              {entry.notes}
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div>
        <Link href="/weight">
          <Button variant="outline" className="rounded-xl">
            Back to History
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WeightDetailPage;
