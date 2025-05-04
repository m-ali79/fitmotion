"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { WorkoutType, EffortLevel } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { WorkoutFilters } from "@/types/workout";

interface PopoverFilterState {
  selectedTypes: Set<WorkoutType>;
  selectedEfforts: Set<EffortLevel>;
  dateRange: DateRange | undefined;
  minDuration: string;
  maxDuration: string;
}

interface WorkoutFiltersPopoverProps {
  currentFilters: WorkoutFilters;
  onApplyFilters: (filters: PopoverFilterState) => void;
  onResetFilters: () => void;
}

const initializeStateFromFilters = (
  filters: WorkoutFilters
): PopoverFilterState => ({
  selectedTypes: new Set(filters.types || []),
  selectedEfforts: new Set(filters.effortLevels || []),
  dateRange: filters.dateRange
    ? {
        from: filters.dateRange.from,
        to: filters.dateRange.to,
      }
    : undefined,
  minDuration:
    filters.minDuration !== undefined ? String(filters.minDuration) : "",
  maxDuration:
    filters.maxDuration !== undefined ? String(filters.maxDuration) : "",
});

const WorkoutFiltersPopover = ({
  currentFilters,
  onApplyFilters,
  onResetFilters,
}: WorkoutFiltersPopoverProps) => {
  const [popoverState, setPopoverState] = useState<PopoverFilterState>(() =>
    initializeStateFromFilters(currentFilters)
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setPopoverState(initializeStateFromFilters(currentFilters));
  }, [currentFilters]);

  const handleTypeCheckedChange = (
    checked: boolean | string,
    type: WorkoutType
  ) => {
    setPopoverState((prev) => {
      const nextTypes = new Set(prev.selectedTypes);
      if (checked) nextTypes.add(type);
      else nextTypes.delete(type);
      return { ...prev, selectedTypes: nextTypes };
    });
  };

  const handleEffortCheckedChange = (
    checked: boolean | string,
    level: EffortLevel
  ) => {
    setPopoverState((prev) => {
      const nextEfforts = new Set(prev.selectedEfforts);
      if (checked) nextEfforts.add(level);
      else nextEfforts.delete(level);
      return { ...prev, selectedEfforts: nextEfforts };
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setPopoverState((prev) => ({ ...prev, dateRange: range }));
  };

  const handleMinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopoverState((prev) => ({ ...prev, minDuration: e.target.value }));
  };

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopoverState((prev) => ({ ...prev, maxDuration: e.target.value }));
  };

  const handleApply = () => {
    onApplyFilters(popoverState);
    setIsPopoverOpen(false);
  };

  const handleReset = () => {
    onResetFilters();
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-lg flex-shrink-0">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 PopoverContent" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Filters</h4>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 rounded-md",
                    !popoverState.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {popoverState.dateRange?.from ? (
                    popoverState.dateRange.to ? (
                      <>
                        {format(popoverState.dateRange.from, "LLL dd, y")} -{" "}
                        {format(popoverState.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(popoverState.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 " align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={popoverState.dateRange?.from}
                  selected={popoverState.dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Workout Type</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2">
              {Object.values(WorkoutType).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-type-${type}`}
                    checked={popoverState.selectedTypes.has(type)}
                    onCheckedChange={(checked) =>
                      handleTypeCheckedChange(checked, type)
                    }
                  />
                  <Label
                    htmlFor={`filter-type-${type}`}
                    className="text-xs font-normal capitalize cursor-pointer"
                  >
                    {type.replace("_", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Effort Level</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(EffortLevel).map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-effort-${level}`}
                    checked={popoverState.selectedEfforts.has(level)}
                    onCheckedChange={(checked) =>
                      handleEffortCheckedChange(checked, level)
                    }
                  />
                  <Label
                    htmlFor={`filter-effort-${level}`}
                    className="text-xs font-normal capitalize cursor-pointer"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Duration (min)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-8 text-xs"
                value={popoverState.minDuration}
                onChange={handleMinDurationChange}
                min="0"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                className="h-8 text-xs"
                value={popoverState.maxDuration}
                onChange={handleMaxDurationChange}
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WorkoutFiltersPopover;
