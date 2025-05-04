import { Progress } from "./progress";
import { cn } from "@/lib/utils";

interface CustomProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function CustomProgress({
  value,
  className,
  indicatorClassName,
}: CustomProgressProps) {
  return (
    <Progress
      value={value}
      className={cn("h-2 bg-gray-100", className)}
      data-indicator-class={cn("bg-fitness-primary", indicatorClassName)}
    />
  );
}
