"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface DurationChartProps {
  data: {
    label: string;
    duration: number;
  }[];
  title: string;
}

//  calculate Simple Moving Average (SMA)
function calculateSMA(
  data: { duration: number }[],
  period: number
): (number | null)[] {
  if (!data || data.length < period) {
    return Array(data?.length || 0).fill(null);
  }
  const sma: (number | null)[] = Array(period - 1).fill(null); // initial points with null
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, val) => acc + val.duration, 0);
    sma.push(Math.round(sum / period));
  }
  return sma;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const barPayload = payload.find((p) => p.dataKey === "duration");
    const linePayload = payload.find((p) => p.dataKey === "trend");

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        <p className="font-bold mb-1">{label}</p>
        {barPayload && (
          <p className="text-foreground">
            Duration:{" "}
            <span className="font-medium">{barPayload.value} min</span>
          </p>
        )}
        {linePayload && linePayload.value !== null && (
          <p className="text-blue-400">
            Trend: <span className="font-medium">{linePayload.value} min</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function DurationChart({ data, title }: DurationChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            No workout data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculating trend data ( 3-period SMA)
  const smaPeriod = 3;
  const trendData = calculateSMA(data, smaPeriod);

  // Combining original data with trend data
  const combinedData = data.map((item, index) => ({
    ...item,
    trend: trendData[index],
  }));

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={combinedData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333340"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={"preserveStartEnd"}
              angle={data.length > 10 ? -30 : 0}
              textAnchor={data.length > 10 ? "end" : "middle"}
              height={data.length > 10 ? 40 : 30}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              cursor={{ fill: "rgba(242, 48, 90, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="duration" fill="#F2305A" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="Trend (3-period SMA)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
