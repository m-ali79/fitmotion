"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface NutritionData {
  targets: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
  };
  consumed: {
    consumedCalories: number;
    consumedProtein: number;
    consumedCarbs: number;
    consumedFat: number;
  };
}

interface DailyTargetsProps {
  nutritionData: NutritionData | null;
  isLoading: boolean;
  error: string | null;
}

const COLORS = {
  calorie: "hsl(var(--primary))",
  background: "hsl(var(--muted))",
};

interface CustomLabelProps extends PieLabelRenderProps {
  value: number;
}

const CustomLabel = ({ cx, cy, value, name }: CustomLabelProps) => {
  if (typeof cx !== "number" || typeof cy !== "number") {
    return null;
  }

  if (name !== "value") return null;

  return (
    <text
      x={cx}
      y={cy}
      fill="hsl(var(--foreground))"
      textAnchor="middle"
      dominantBaseline="central"
    >
      <tspan
        x={cx}
        dy="-0.4em"
        fontSize="1.5rem"
        fontWeight="bold"
      >{`${value.toLocaleString()}`}</tspan>
      <tspan
        x={cx}
        dy="1.1em"
        fontSize="0.8rem"
        fill="hsl(var(--muted-foreground))"
      >
        kcal
      </tspan>
    </text>
  );
};

export const DailyTargets = ({
  nutritionData,
  isLoading,
  error,
}: DailyTargetsProps) => {
  const [showRemaining, setShowRemaining] = useState(false);

  const targets = nutritionData?.targets ?? {
    dailyCalories: 0,
    dailyProtein: 0,
    dailyCarbs: 0,
    dailyFat: 0,
  };
  const consumed = nutritionData?.consumed ?? {
    consumedCalories: 0,
    consumedProtein: 0,
    consumedCarbs: 0,
    consumedFat: 0,
  };

  const remainingCalories = Math.max(
    0,
    targets.dailyCalories - consumed.consumedCalories
  );
  const remainingProtein = Math.max(
    0,
    targets.dailyProtein - consumed.consumedProtein
  );
  const remainingCarbs = Math.max(
    0,
    targets.dailyCarbs - consumed.consumedCarbs
  );
  const remainingFat = Math.max(0, targets.dailyFat - consumed.consumedFat);

  const proteinProgress =
    targets.dailyProtein > 0
      ? (consumed.consumedProtein / targets.dailyProtein) * 100
      : 0;
  const carbsProgress =
    targets.dailyCarbs > 0
      ? (consumed.consumedCarbs / targets.dailyCarbs) * 100
      : 0;
  const fatProgress =
    targets.dailyFat > 0 ? (consumed.consumedFat / targets.dailyFat) * 100 : 0;

  const calorieChartData = [
    { name: "value", value: consumed.consumedCalories },
    {
      name: "remaining",
      value: Math.max(0, targets.dailyCalories - consumed.consumedCalories),
    },
  ];

  return (
    <Card className="lg:col-span-2 rounded-3xl border-0 shadow-md card-hover-effect overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-fitness-text">
            Today&apos;s Overview
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="consumed-remaining-toggle"
              className="text-sm text-fitness-muted cursor-pointer"
            >
              {showRemaining ? "Remaining" : "Consumed"}
            </Label>
            <Switch
              id="consumed-remaining-toggle"
              checked={showRemaining}
              onCheckedChange={setShowRemaining}
              aria-label="Toggle between consumed and remaining nutrients"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        {isLoading ? (
          <div className="text-center py-16 text-fitness-muted">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : (
          <motion.div
            key={showRemaining ? "remaining" : "consumed"}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calorieChartData}
                      cx="50%"
                      cy="50%"
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      stroke="none"
                      labelLine={false}
                      label={(props) => (
                        <CustomLabel
                          {...props}
                          value={consumed.consumedCalories}
                        />
                      )}
                    >
                      <Cell key={`cell-0`} fill={COLORS.calorie} />
                      <Cell key={`cell-1`} fill={COLORS.background} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-grow space-y-2 text-center sm:text-left">
                <h3 className="font-medium text-fitness-text">
                  Total Calories
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-1 justify-center sm:justify-start">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`cal-${showRemaining ? "rem" : "con"}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="text-3xl font-bold text-fitness-text leading-none"
                    >
                      {showRemaining
                        ? remainingCalories.toLocaleString()
                        : consumed.consumedCalories.toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm text-fitness-muted sm:mb-1">
                    {showRemaining
                      ? " remaining"
                      : ` / ${targets.dailyCalories.toLocaleString()} kcal target`}
                  </span>
                </div>
                {!showRemaining && (
                  <div className="text-sm text-fitness-muted pt-1">
                    Remaining: {remainingCalories.toLocaleString()} kcal
                  </div>
                )}
              </div>
            </div>

            {/* Macronutrient Progress/Remaining */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              {/* Protein */}
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm text-fitness-muted">Protein</p>
                <p className="font-medium text-fitness-text">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`pro-${showRemaining ? "rem" : "con"}`}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {showRemaining
                        ? `${remainingProtein.toFixed(0)}g`
                        : `${consumed.consumedProtein.toFixed(0)}g / ${targets.dailyProtein.toFixed(0)}g`}
                    </motion.span>
                  </AnimatePresence>
                </p>
                {!showRemaining && (
                  <div className="relative overflow-hidden rounded-full h-2 mx-auto sm:mx-0 max-w-[100px] sm:max-w-none">
                    <Progress
                      value={proteinProgress}
                      className="h-2 bg-fitness-gray [&>*]:bg-fitness-primary"
                    />
                  </div>
                )}
              </div>
              {/* Carbs */}
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm text-fitness-muted">Carbs</p>
                <p className="font-medium text-fitness-text">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`carb-${showRemaining ? "rem" : "con"}`}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {showRemaining
                        ? `${remainingCarbs.toFixed(0)}g`
                        : `${consumed.consumedCarbs.toFixed(0)}g / ${targets.dailyCarbs.toFixed(0)}g`}
                    </motion.span>
                  </AnimatePresence>
                </p>
                {!showRemaining && (
                  <div className="relative overflow-hidden rounded-full h-2 mx-auto sm:mx-0 max-w-[100px] sm:max-w-none">
                    <Progress
                      value={carbsProgress}
                      className="h-2 bg-fitness-gray [&>*]:bg-fitness-accent"
                    />
                  </div>
                )}
              </div>
              {/* Fat */}
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm text-fitness-muted">Fat</p>
                <p className="font-medium text-fitness-text">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`fat-${showRemaining ? "rem" : "con"}`}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {showRemaining
                        ? `${remainingFat.toFixed(0)}g`
                        : `${consumed.consumedFat.toFixed(0)}g / ${targets.dailyFat.toFixed(0)}g`}
                    </motion.span>
                  </AnimatePresence>
                </p>
                {!showRemaining && (
                  <div className="relative overflow-hidden rounded-full h-2 mx-auto sm:mx-0 max-w-[100px] sm:max-w-none">
                    <Progress
                      value={fatProgress}
                      className="h-2 bg-fitness-gray [&>*]:bg-red-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
