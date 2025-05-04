import { notFound } from "next/navigation";
import Image from "next/image";
import { getMealById } from "@/actions/nutrition";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Utensils, StickyNote } from "lucide-react";
import MealDetailActions from "./MealDetailActions";
import { ConsumedMacrosChart } from "@/components/nutrition/ConsumedMacrosChart";
import { FoodItemCard } from "@/components/nutrition/FoodItemCard";
import { FoodItemData } from "@/types/nutrition";

interface MealDetailPageProps {
  params: Promise<{ id: string }>;
}

const formatMealTypeName = (type: string) => {
  if (!type) return "Meal";
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const MealDetailPage = async ({ params }: MealDetailPageProps) => {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    notFound();
  }

  const mealMacros = {
    consumedCalories: meal.calories,
    consumedProtein: meal.protein,
    consumedCarbs: meal.carbs,
    consumedFat: meal.fat,
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Card className="rounded-2xl shadow-lg border border-border/50 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 p-6">
          <div className="flex items-center gap-4 flex-grow">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              {meal.imageUrl ? (
                <Image
                  src={meal.imageUrl}
                  alt={meal.name || "Meal Image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Utensils className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-grow">
              <CardTitle className="text-2xl font-bold">
                {meal.name || formatMealTypeName(meal.mealType)}
              </CardTitle>
              <CardDescription className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{format(meal.date, "EEEE, MMMM do, yyyy 'at' p")}</span>
                </span>
                <Badge variant="outline" className="capitalize">
                  {meal.mealType}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <MealDetailActions meal={meal} />
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Meal Summary & Macros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Nutritional Summary
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg border space-y-2">
              <p className="text-sm">
                <span className="font-medium text-foreground">
                  Total Calories:
                </span>{" "}
                <span className="text-primary font-semibold">
                  {meal.calories.toFixed(0)} kcal
                </span>
              </p>
              <ConsumedMacrosChart consumed={mealMacros} />
            </div>
          </div>

          {/* Section 2: Notes */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" /> Notes
            </h3>
            {meal.notes ? (
              <p className="text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md border text-sm">
                {meal.notes}
              </p>
            ) : (
              <p className="text-muted-foreground italic text-sm">
                No notes were added for this meal.
              </p>
            )}
          </div>

          {/* Section 3: Food Items List */}
          <div className="md:col-span-2 space-y-4 pt-6 border-t mt-4">
            <h3 className="text-lg font-semibold text-foreground">
              Items in this Meal
            </h3>
            {meal.foodItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meal.foodItems.map((item) => (
                  <FoodItemCard key={item.id} item={item as FoodItemData} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">
                No specific food items were logged for this meal.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealDetailPage;
