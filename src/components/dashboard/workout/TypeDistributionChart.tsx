"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";

interface TypeDistributionDataPoint {
  name: string;
  value: number; // Count
  currentPercent: number;
  changePercent: number | null;
}

interface TypeDistributionProps {
  data: TypeDistributionDataPoint[];
}

const COLORS = [
  "#F2305A", // Primary Pink
  "#8884d8", // Recharts Purple
  "#82ca9d", // Recharts Green
  "#ffc658", // Recharts Yellow
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as TypeDistributionDataPoint;
    const { name, value, currentPercent, changePercent } = dataPoint;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        <p className="font-bold mb-1">{name}</p>
        <p>
          Count: <span className="font-medium">{value}</span>
        </p>
        <p>
          Percent: <span className="font-medium">{currentPercent}%</span>
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
const renderLegend = (value: string, entry: any) => {
  const dataPoint = entry?.payload?.payload as
    | TypeDistributionDataPoint
    | undefined;

  const label =
    dataPoint && typeof dataPoint.currentPercent === "number"
      ? `${value} (${dataPoint.currentPercent}%)`
      : value;

  return <span className="text-xs text-gray-400">{label}</span>;
};

export function TypeDistributionChart({ data }: TypeDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Workout Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            No workout data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Workout Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconSize={10}
              wrapperStyle={{
                paddingLeft: "20px",
                paddingTop: "0px",
                fontSize: "12px",
              }}
              formatter={renderLegend}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
