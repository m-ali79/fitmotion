import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { WeightEntryWithComputed } from "@/types/weight";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightCardProps {
  entry: WeightEntryWithComputed;
}

export const WeightCard = ({ entry }: WeightCardProps) => {
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
    <Link
      href={`/weight/${entry.id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          key={entry.id}
          className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden transition-colors duration-200"
        >
          <CardContent className="px-4 py-3 sm:py-4 flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Date Section*/}
            <div className="w-full sm:w-auto text-left sm:text-center flex-shrink-0 pr-4 sm:border-r sm:border-border/50">
              <p className="text-xs text-muted-foreground">
                {format(entry.date, "MMM")}
              </p>
              <p className="text-xl font-semibold text-card-foreground">
                {format(entry.date, "dd")}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {format(entry.date, "yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(entry.date, "yyyy, p")}
              </p>
            </div>

            {/* Details Section  */}
            <div className="flex-grow space-y-1 min-w-0 w-full sm:w-auto">
              <p className="text-lg font-semibold text-card-foreground">
                {entry.weightKg.toFixed(1)} kg
              </p>
            </div>

            {/* Stats Section  */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 text-sm text-muted-foreground sm:flex-shrink-0 mt-2 sm:mt-0 sm:pl-4 sm:border-l sm:border-border/50">
              <div
                className="flex items-center gap-1"
                title="Change from previous"
              >
                {ChangeIcon && (
                  <ChangeIcon className={cn("h-4 w-4", changeColor)} />
                )}
                <span className={cn(changeColor)}>
                  {entry.changeFromLast !== null
                    ? `${entry.changeFromLast > 0 ? "+" : ""}${entry.changeFromLast.toFixed(1)} kg`
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-1" title="BMI">
                <TrendingUp className="h-4 w-4" />
                <span>{entry.bmi !== null ? entry.bmi.toFixed(1) : "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
