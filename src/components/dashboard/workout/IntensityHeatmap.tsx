"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { subYears, startOfDay, endOfDay } from "date-fns";

interface IntensityData {
  date: string;
  count: number;
}

interface IntensityHeatmapProps {
  data: IntensityData[];
}

export function IntensityHeatmap({ data }: IntensityHeatmapProps) {
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(subYears(endDate, 1));

  const formattedDataForHeatmap = data.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg text-gray-300">
          Workout Intensity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-4 heatmap-container">
        <style jsx global>{`
          .heatmap-container .react-calendar-heatmap .color-empty {
            fill: #3a3a5e;
          }
          .heatmap-container .react-calendar-heatmap .color-scale-1 {
            fill: #fce4ec;
          }
          .heatmap-container .react-calendar-heatmap .color-scale-2 {
            fill: #f8bbd0;
          }
          .heatmap-container .react-calendar-heatmap .color-scale-3 {
            fill: #f48fb1;
          }
          .heatmap-container .react-calendar-heatmap .color-scale-4 {
            fill: #f06292;
          }
          .heatmap-container .react-calendar-heatmap .color-scale-5 {
            fill: #ec407a;
          }
          .heatmap-container .react-calendar-heatmap text {
            fill: #a0aec0;
            font-size: 10px;
          }
          .heatmap-container
            .react-calendar-heatmap
            .react-calendar-heatmap-month-label {
            padding-bottom: 5px;
          }
          .react-tooltip {
            background-color: #2d3748 !important;
            color: #e2e8f0 !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
        `}</style>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={formattedDataForHeatmap}
          classForValue={(value) => {
            if (!value || value.count === undefined || value.count === null) {
              return "color-empty";
            }
            const level = Math.max(1, Math.min(value.count, 5));
            return `color-scale-${level}`;
          }}
          tooltipDataAttrs={(value) => {
            let content = "No workout data";
            if (
              value &&
              value.date &&
              value.count !== undefined &&
              value.count !== null
            ) {
              content = `${value.date}: Intensity Level ${value.count}`;
            }

            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": content,
            } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
          }}
          showWeekdayLabels={true}
          weekdayLabels={["S", "M", "T", "W", "T", "F", "S"]}
          monthLabels={[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]}
          showMonthLabels={true}
        />
        <ReactTooltip id="heatmap-tooltip" />
        <div className="flex justify-end items-center space-x-2 mt-4 text-xs text-gray-400">
          <span>Less Intense</span>
          <span
            className="w-3 h-3 bg-[#fce4ec] rounded-sm"
            title="Level 1"
          ></span>
          <span
            className="w-3 h-3 bg-[#f8bbd0] rounded-sm"
            title="Level 2"
          ></span>
          <span
            className="w-3 h-3 bg-[#f48fb1] rounded-sm"
            title="Level 3"
          ></span>
          <span
            className="w-3 h-3 bg-[#f06292] rounded-sm"
            title="Level 4"
          ></span>
          <span
            className="w-3 h-3 bg-[#ec407a] rounded-sm"
            title="Level 5"
          ></span>
          <span>More Intense</span>
        </div>
      </CardContent>
    </Card>
  );
}
