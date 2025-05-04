"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ConsumedNutrients } from "@/types/nutrition";

interface ConsumedMacrosChartProps {
  consumed: ConsumedNutrients;
}

export const ConsumedMacrosChart = ({ consumed }: ConsumedMacrosChartProps) => {
  const currentMacroData = [
    { name: "Protein", value: consumed.consumedProtein, color: "#00E676" }, // Green
    { name: "Carbs", value: consumed.consumedCarbs, color: "#FFC107" }, // Amber
    { name: "Fat", value: consumed.consumedFat, color: "#F44336" }, // Red
  ].filter((item) => item.value > 0);

  return (
    <Card className="rounded-3xl border-0 shadow-md card-hover-effect">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-fitness-text">Consumed Macros</CardTitle>
          <PieChartIcon className="h-5 w-5 text-fitness-muted" />
        </div>
      </CardHeader>
      <CardContent>
        {currentMacroData.length === 0 ? (
          <div className="text-center p-8 h-[220px] flex items-center justify-center text-fitness-muted">
            Log food to see macro breakdown
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={currentMacroData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {currentMacroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-fitness-muted text-sm">
                    {value} ({entry?.payload?.value.toFixed(1)}g)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
