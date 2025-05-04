import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutProgressTab } from "@/components/dashboard/WorkoutProgressTab";
import { NutritionProgressTab } from "@/components/dashboard/NutritionProgressTab";
import { WeightProgressTab } from "@/components/dashboard/WeightProgressTab";
import { Suspense } from "react";

function TabLoading() {
  return <div className="text-center text-gray-500 py-10">Loading...</div>;
}

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-1">Progress Tracker</h1>
      <p className="text-gray-400 mb-6">
        Track your fitness journey and body transformations
      </p>

      <Tabs defaultValue="workout" className="space-y-6">
        <TabsList className="bg-[#22222e] rounded-xl p-1 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="workout"
            className="rounded-lg data-[state=active]:bg-fitness-primary data-[state=active]:text-white flex-shrink-0"
          >
            Workout
          </TabsTrigger>
          <TabsTrigger
            value="nutrition"
            className="rounded-lg data-[state=active]:bg-fitness-primary data-[state=active]:text-white flex-shrink-0"
          >
            Nutrition
          </TabsTrigger>
          <TabsTrigger
            value="weight"
            className="rounded-lg data-[state=active]:bg-fitness-primary data-[state=active]:text-white flex-shrink-0"
          >
            Weight
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <Suspense fallback={<TabLoading />}>
            <WorkoutProgressTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="nutrition">
          <Suspense fallback={<TabLoading />}>
            <NutritionProgressTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="weight">
          <Suspense fallback={<TabLoading />}>
            <WeightProgressTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
