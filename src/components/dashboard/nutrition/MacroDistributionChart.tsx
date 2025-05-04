"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";
import {
  MacroDistributionResult,
  MacroDistributionDataPoint,
} from "@/actions/dashboard/nutrition";

interface MacroDistributionChartProps {
  data: MacroDistributionResult;
  title?: string;
}

const MACRO_COLORS: Record<string, string> = {
  Protein: "#8884d8", // Purple
  Carbs: "#82ca9d", // Green
  Fat: "#ffc658", // Yellow
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as MacroDistributionDataPoint & {
      fill: string;
    };
    const { name, grams, caloriePercent, changePercent, fill } = dataPoint;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        <div className="flex items-center mb-1">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: fill }}
          ></span>
          <p className="font-bold">{name}</p>
        </div>
        <p>
          Percent (Calories):{" "}
          <span className="font-medium">{caloriePercent}%</span>
        </p>
        <p>
          Amount: <span className="font-medium">{grams}g</span>
        </p>
        {changePercent !== null && (
          <p
            className={cn(
              "text-xs",
              changePercent > 0
                ? "text-green-500"
                : changePercent < 0
                  ? "text-red-500"
                  : "text-gray-500"
            )}
          >
            Change: {changePercent > 0 ? "+" : ""}
            {changePercent}% points
          </p>
        )}
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <ul className="flex flex-col space-y-1 mt-4 text-xs">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, index: number) => {
        const dataPoint = entry.payload?.payload as
          | MacroDistributionDataPoint
          | undefined;
        if (!dataPoint) return null;

        const color = entry.color || "#ccc";

        return (
          <li key={`item-${index}`} className="flex items-center">
            <span
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></span>
            <span className="text-gray-400 mr-1">{entry.value}:</span>
            <span className="font-medium">{dataPoint.caloriePercent}%</span>
            <span className="text-gray-500 ml-1">({dataPoint.grams}g)</span>
          </li>
        );
      })}
    </ul>
  );
};

export function MacroDistributionChart({
  data: resultData,
  title,
}: MacroDistributionChartProps) {
  const { distribution, summary } = resultData;

  if (!distribution || distribution.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{title ?? "Macronutrient Distribution"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            No nutrition data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = distribution.map((item) => ({
    ...item,
    value: item.caloriePercent,
    fill: MACRO_COLORS[item.name],
  }));

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>{title ?? "Macronutrient Distribution"}</CardTitle>
        {summary.totalCalories > 0 && (
          <p className="text-sm text-gray-400">
            Based on {summary.totalCalories.toLocaleString()} total calories
            from macros.
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            barSize={15}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]} // Scale represents percentage
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={renderLegend}
              verticalAlign="bottom"
              align="center"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
