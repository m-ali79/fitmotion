"use client";

import { motion } from "framer-motion";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WorkoutType } from "@prisma/client";
import { workoutTypeDetails } from "@/types/workout";

interface WorkoutTypeSelectorProps {
  onSelectType: (type: WorkoutType) => void;
}

const WorkoutTypeSelector = ({ onSelectType }: WorkoutTypeSelectorProps) => {
  const types = Object.values(WorkoutType);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {types.map((type, index) => {
        const details = workoutTypeDetails[type];
        if (!details) return null;
        const IconComponent = details.icon;
        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => onSelectType(type)}
          >
            <Card className="h-full rounded-xl overflow-hidden border bg-card hover:bg-muted/80 transition-colors duration-200">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                <IconComponent className="h-8 w-8 mb-3 text-primary" />
                <span className="text-sm font-medium text-card-foreground">
                  {details.name}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WorkoutTypeSelector;
