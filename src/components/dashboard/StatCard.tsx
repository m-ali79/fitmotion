"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatChangeProps {
  changePercent: number | null | typeof Infinity | undefined;
  range: string;
}

export function StatChange({ changePercent, range }: StatChangeProps) {
  if (
    changePercent === null ||
    changePercent === undefined ||
    range === "all" // No comparison for 'all time'
  ) {
    return null;
  }

  let comparisonText = "vs prev. period";
  switch (range) {
    case "7d":
      comparisonText = "vs prev. 7 days";
      break;
    case "30d":
      comparisonText = "vs prev. 30 days";
      break;
    case "90d":
      comparisonText = "vs prev. 90 days";
      break;
    case "1y":
      comparisonText = "vs prev. year";
      break;
  }

  let valueText = `${Math.abs(changePercent)}%`;
  let color = "text-gray-500";
  let Icon = null;

  if (changePercent === Infinity) {
    valueText = "+∞%"; // Indicate infinite increase (from 0)
    color = "text-green-500";
    Icon = ArrowUp;
  } else if (changePercent > 0) {
    valueText = `+${changePercent}%`;
    color = "text-green-500";
    Icon = ArrowUp;
  } else if (changePercent < 0) {
    valueText = `${changePercent}%`; // Negative sign is included
    color = "text-red-500";
    Icon = ArrowDown;
  } else {
    valueText = "0%";
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center text-xs font-medium mt-1",
        color
      )}
    >
      {Icon && <Icon className="h-3 w-3 mr-0.5" />}
      <span>{valueText}</span>
      <span className="text-gray-500 ml-1 text-[10px]">{comparisonText}</span>
    </div>
  );
}

export interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  changePercent?: number | null | typeof Infinity;
  unit?: string;
  range: string;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  changePercent,
  unit,
  range,
  iconColor = "text-fitness-primary",
}: StatCardProps) {
  const iconBgColor = iconColor.replace("text-", "bg-") + "/10";

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center mb-3",
              iconBgColor
            )}
          >
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconColor)} />
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1 capitalize">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold">
            {value}{" "}
            {unit && (
              <span className="text-base font-normal text-gray-500">
                {unit}
              </span>
            )}
          </p>
          <StatChange changePercent={changePercent} range={range} />
        </div>
      </CardContent>
    </Card>
  );
}
