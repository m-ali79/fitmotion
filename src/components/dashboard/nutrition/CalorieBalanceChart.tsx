"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface CalorieBalanceDataPoint {
  label: string;
  intake: number;
  goal: number | null;
}

interface CalorieBalanceChartProps {
  data: CalorieBalanceDataPoint[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const intakePayload = payload.find((p) => p.dataKey === "intake");
    const goalPayload = payload.find((p) => p.dataKey === "goal");

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        <p className="font-bold mb-1">{label}</p>
        {intakePayload && (
          <p style={{ color: intakePayload.color }}>
            Intake:{" "}
            <span className="font-medium">
              {intakePayload.value?.toLocaleString()} kcal
            </span>
          </p>
        )}
        {goalPayload && goalPayload.value !== null && (
          <p style={{ color: goalPayload.color }}>
            Goal:{" "}
            <span className="font-medium">
              {goalPayload.value?.toLocaleString()} kcal
            </span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function CalorieBalanceChart({ data, title }: CalorieBalanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl">
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            No calorie data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
              interval={0} // Use 0 to let recharts skip ticks if needed
              angle={data.length > 10 ? -30 : 0}
              textAnchor={data.length > 10 ? "end" : "middle"}
              height={data.length > 10 ? 40 : 30}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={["dataMin - 100", "dataMax + 100"]} //  some padding to Y axis
              allowDataOverflow={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(100, 100, 100, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="intake"
              name="Intake"
              stroke="#ec407a"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="goal"
              name="Goal"
              stroke="#60a5fa"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
