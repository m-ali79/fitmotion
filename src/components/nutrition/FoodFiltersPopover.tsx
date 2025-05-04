"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { MealType } from "@prisma/client";
import { SlidersHorizontal } from "lucide-react";
import { FoodFilters } from "@/types/nutrition";
import { format } from "date-fns";

interface FoodFiltersPopoverProps {
  currentFilters: FoodFilters;
  onApplyFilters: (filters: FoodFilters) => void;
  onResetFilters: () => void;
}

const mealTypeOptions = Object.values(MealType);

const formatMealTypeLabel = (type: MealType) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const FoodFiltersPopover = ({
  currentFilters,
  onApplyFilters,
  onResetFilters,
}: FoodFiltersPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<MealType>>(
    new Set(currentFilters.mealTypes || [])
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    currentFilters.dateRange
      ? { from: currentFilters.dateRange.from, to: currentFilters.dateRange.to }
      : undefined
  );

  useEffect(() => {
    setSelectedTypes(new Set(currentFilters.mealTypes || []));
    const initialRange = currentFilters.dateRange;
    setDateRange(
      initialRange
        ? { from: initialRange.from, to: initialRange.to }
        : undefined
    );
  }, [currentFilters]);

  const handleTypeChange = (type: MealType, checked: boolean) => {
    const newSelection = new Set(selectedTypes);
    if (checked) {
      newSelection.add(type);
    } else {
      newSelection.delete(type);
    }
    setSelectedTypes(newSelection);
  };

  const applyFilters = () => {
    onApplyFilters({
      mealTypes: Array.from(selectedTypes),
      dateRange: dateRange,
      searchQuery: currentFilters.searchQuery,
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedTypes(new Set());
    setDateRange(undefined);
    onResetFilters();
    setIsOpen(false);
  };

  const isFilterActive = useMemo(() => {
    return selectedTypes.size > 0 || !!dateRange?.from || !!dateRange?.to;
  }, [selectedTypes, dateRange]);

  const formattedDateRange = useMemo(() => {
    if (!dateRange) return "Select dates";
    if (dateRange.from && dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "LLL dd, y");
      }
      return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
    }
    if (dateRange.from) return `From ${format(dateRange.from, "LLL dd, y")}`;
    if (dateRange.to) return `To ${format(dateRange.to, "LLL dd, y")}`;
    return "Select dates";
  }, [dateRange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-lg flex-shrink-0">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {isFilterActive && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-fitness-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4 PopoverContent">
        <h4 className="font-medium leading-none">Filter Meals</h4>

        <div className="space-y-2">
          <Label className="text-sm">Pick a date range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-9"
              >
                {formattedDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from || new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Meal Type</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {mealTypeOptions.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-meal-${type}`}
                  checked={selectedTypes.has(type)}
                  onCheckedChange={(checked) =>
                    handleTypeChange(type, !!checked)
                  }
                />
                <Label
                  htmlFor={`filter-meal-${type}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {formatMealTypeLabel(type)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center my-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-muted-foreground"
          >
            Reset
          </Button>

          <Button onClick={applyFilters} className="rounded-lg">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
