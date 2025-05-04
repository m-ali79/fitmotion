import { notFound } from "next/navigation";
import { fetchWorkoutById, fetchUserWeight } from "@/actions/workout";
import { getWorkoutIcon } from "@/types/workout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Flame, StickyNote, CalendarDays } from "lucide-react";
import WorkoutDetailActions from "./WorkoutDetailActions";

interface WorkoutDetailPageProps {
  params: Promise<{ id: string }>;
}

const formatWorkoutTypeName = (type: string) => {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const WorkoutDetailPage = async ({ params }: WorkoutDetailPageProps) => {
  const { id: workoutId } = await params;

  const [workout, userWeightKg] = await Promise.all([
    fetchWorkoutById(workoutId),
    fetchUserWeight(),
  ]);

  if (!workout) {
    notFound();
  }

  const IconComponent = getWorkoutIcon(workout.type);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Card className="rounded-2xl shadow-lg border border-border/50">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold capitalize">
                {formatWorkoutTypeName(workout.type)}
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-2 mt-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(workout.date, "EEEE, MMMM do, yyyy 'at' p")}
                </span>
              </CardDescription>
            </div>
          </div>
          <WorkoutDetailActions workout={workout} userWeightKg={userWeightKg} />
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Key Metrics
            </h3>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium text-foreground">
                  {workout.duration}
                </span>{" "}
                minutes
                <p className="text-xs">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Flame className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium text-foreground">
                  {workout.caloriesBurned ?? "N/A"}
                </span>{" "}
                Kcal
                <p className="text-xs">Energy Burned (Est.)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Badge
                variant="secondary"
                className="capitalize text-base py-1 px-3"
              >
                {workout.effortLevel}
              </Badge>
              <p className="text-xs ml-1">Effort Level</p>
            </div>
          </div>

          {workout.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-primary" /> Notes
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md border text-sm truncate">
                {workout.notes}
              </p>
            </div>
          )}
          {!workout.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-primary" /> Notes
              </h3>
              <p className="text-muted-foreground italic text-sm ">
                No notes were added for this workout.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutDetailPage;
