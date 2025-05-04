"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import WorkoutTypeSelector from "@/components/workout/WorkoutTypeSelector";
import WorkoutForm, {
  SubmittedWorkoutFormData,
} from "@/components/workout/WorkoutForm";
import { WorkoutType } from "@prisma/client";
import { logWorkoutAction } from "@/actions/workout";

interface WorkoutLoggerProps {
  userWeightKg: number | null;
}

const WorkoutLogger = ({ userWeightKg }: WorkoutLoggerProps) => {
  const router = useRouter();
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [loggingStep, setLoggingStep] = useState<"selectType" | "fillForm">(
    "selectType"
  );
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenLogModal = () => {
    setLoggingStep("selectType");
    setSelectedWorkoutType(null);
    setIsLoggingModalOpen(true);
  };

  const handleTypeSelect = (type: WorkoutType) => {
    setSelectedWorkoutType(type);
    setLoggingStep("fillForm");
  };

  const handleLogWorkout = (formData: SubmittedWorkoutFormData) => {
    startTransition(async () => {
      try {
        const result = await logWorkoutAction(formData);

        if (result.success) {
          toast.success("Workout logged successfully!");
          setIsLoggingModalOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to log workout.");
        }
      } catch (error) {
        console.error("Error calling logWorkoutAction:", error);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <>
      {/* Button to open the logging modal */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90 h-12 btn-hover-effect"
          onClick={handleOpenLogModal}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Plus className="h-5 w-5 mr-2" />
          )}
          {isPending ? "Logging..." : "Log Exercise"}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isLoggingModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoggingModalOpen(false)}
          >
            <motion.div
              className="bg-card rounded-2xl shadow-xl w-full max-w-xl p-4 md:p-6 text-card-foreground max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              {/* Step 1: Select Workout Type */}
              {loggingStep === "selectType" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Register Exercise
                  </h2>
                  <WorkoutTypeSelector onSelectType={handleTypeSelect} />
                  <Button
                    variant="ghost"
                    onClick={() => setIsLoggingModalOpen(false)}
                    className="mt-4"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Step 2: Fill Workout Form */}
              {loggingStep === "fillForm" && selectedWorkoutType && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Log{" "}
                    {selectedWorkoutType
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h2>
                  <WorkoutForm
                    workoutType={selectedWorkoutType}
                    onSubmit={handleLogWorkout}
                    onBack={() => setLoggingStep("selectType")}
                    userWeightKg={userWeightKg}
                    isSubmitting={isPending}
                    isEditing={false}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkoutLogger;
