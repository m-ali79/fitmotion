"use client";

import React from "react";
import { BarChart } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateFoodProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export const EmptyStateFood = ({
  title = "No Data Found",
  description = "There are no meal entries matching your current criteria.",
  icon: Icon = BarChart,
}: EmptyStateFoodProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col items-center justify-center py-16 text-center min-h-[200px]"
    >
      <div className="h-16 w-16 rounded-full bg-fitness-gray flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-fitness-muted" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-fitness-text">{title}</h3>
      <p className="text-fitness-muted max-w-md text-sm sm:text-base">
        {description}
      </p>
    </motion.div>
  );
};
