"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { WeightTrendDataPoint } from "@/actions/dashboard/weight";

interface WeightTrendChartProps {
  data: WeightTrendDataPoint[];
  title: string;
}

// Calculate Simple Moving Average (SMA)
function calculateSMA(
  data: { weight: number | null }[],
  period: number
): (number | null)[] {
  if (!data || data.length < period) {
    return Array(data?.length || 0).fill(null);
  }

  const validData = data
    .map((d) => d.weight)
    .filter((w) => w !== null) as number[];
  if (validData.length < period) {
    return Array(data.length).fill(null);
  }

  const sma: (number | null)[] = Array(data.length).fill(null);
  let currentSum = 0;
  let startIndex = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].weight !== null) {
      currentSum += data[i].weight!;
      if (i - startIndex + 1 >= period) {
        sma[i] = parseFloat((currentSum / period).toFixed(1));
        // Subtract the element that is falling out of the window
        let k = startIndex;
        while (data[k].weight === null && k < i) k++; // Find the first valid weight to subtract
        if (data[k].weight !== null) currentSum -= data[k].weight!;
        startIndex = k + 1; // Move window start
      }
    } else {
      // Handle nulls potentially affecting the window -> reset might be needed or specific handling
      // For simplicity, if a null occurs, we might need to restart the SMA calculation window
      // Or maintain the last valid SMA until enough points accumulate again.
      // Here, we just continue, potentially delaying the SMA start.
    }
  }
  // Refine SMA calculation to handle nulls within the data points
  const weights = data.map((d) => d.weight);
  const smaResult: (number | null)[] = Array(data.length).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const window = weights.slice(i - period + 1, i + 1);
    const validValues = window.filter((v) => v !== null) as number[];
    if (validValues.length > 0) {
      // Calculate SMA if at least one valid value exists
      const sum = validValues.reduce((acc, val) => acc + val, 0);
      // Decide if partial SMA is useful or require full period
      // Using validValues.length allows SMA even with some nulls in window
      if (validValues.length >= Math.ceil(period / 2)) {
        // Require at least half valid points? Adjust as needed
        smaResult[i] = parseFloat((sum / validValues.length).toFixed(1));
      }
    }
  }
  return smaResult;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const weightPayload = payload.find((p) => p.dataKey === "weight");
    const bmiPayload = payload.find((p) => p.dataKey === "bmi");
    const trendPayload = payload.find((p) => p.dataKey === "trend");

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        <p className="font-bold mb-1">{label}</p>
        {weightPayload && weightPayload.value !== null && (
          <p className="text-foreground">
            Weight:{" "}
            <span className="font-medium">{weightPayload.value} kg</span>
          </p>
        )}
        {bmiPayload && bmiPayload.value !== null && (
          <p className="text-gray-400">
            BMI: <span className="font-medium">{bmiPayload.value}</span>
          </p>
        )}
        {trendPayload && trendPayload.value !== null && (
          <p className="text-blue-400">
            Trend: <span className="font-medium">{trendPayload.value} kg</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function WeightTrendChart({ data, title }: WeightTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            No weight data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  const smaPeriod = data.length >= 15 ? 7 : 3; // Use longer SMA for more data
  const trendData = calculateSMA(data, smaPeriod);

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
              interval={
                data.length > 20
                  ? Math.floor(data.length / 10)
                  : "preserveStartEnd"
              } // Adjust interval for readability
              angle={data.length > 10 ? -30 : 0}
              textAnchor={data.length > 10 ? "end" : "middle"}
              height={data.length > 10 ? 40 : 30}
            />
            <YAxis
              yAxisId="left"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}kg`}
              domain={["dataMin - 1", "dataMax + 1"]} // Auto-adjust domain slightly
              allowDecimals={false}
            />
            <YAxis // Optional: Second Y-axis for BMI if needed
              yAxisId="right"
              orientation="right"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              cursor={{ fill: "rgba(120, 120, 180, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              stroke="#8884d8" // Purple for weight line
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
              connectNulls={true} // Connect line over missing data points
              name="Weight (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bmi"
              stroke="#82ca9d" // Green for BMI line
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
              connectNulls={true}
              name="BMI"
            />
            <Line
              yAxisId="left" // Trend line uses the weight axis
              type="monotone"
              dataKey="trend"
              stroke="#60a5fa" // Blue for trend line
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              connectNulls={true} // Connect trend line over missing data points
              name={`Trend (${smaPeriod}-period SMA)`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
