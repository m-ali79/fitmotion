"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteWorkoutAction, updateWorkoutAction } from "@/actions/workout";
import { WorkoutData } from "@/types/workout";
import WorkoutForm, {
  SubmittedWorkoutFormData,
} from "@/components/workout/WorkoutForm";

interface WorkoutDetailActionsProps {
  workout: WorkoutData;
  userWeightKg: number | null;
}

const WorkoutDetailActions = ({
  workout,
  userWeightKg,
}: WorkoutDetailActionsProps) => {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isLoading = isDeleting || isUpdating;

  const handleBack = () => {
    if (isLoading) return;
    router.back();
  };

  const handleDelete = () => {
    if (isLoading) return;
    startDeleteTransition(async () => {
      try {
        const result = await deleteWorkoutAction(workout.id);
        if (result.success) {
          toast.success("Workout deleted successfully!");
          setIsDeleteConfirmOpen(false);
          router.push("/workout");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete workout.");
          setIsDeleteConfirmOpen(false);
        }
      } catch (error) {
        console.error("Error deleting workout:", error);
        toast.error("An unexpected error occurred during deletion.");
        setIsDeleteConfirmOpen(false);
      }
    });
  };

  const handleUpdate = (formData: SubmittedWorkoutFormData) => {
    if (isLoading) return;
    const updateData = {
      duration: formData.duration,
      effortLevel: formData.effortLevel,
      notes: formData.notes,
      caloriesBurned: formData.caloriesBurned,
    };
    startUpdateTransition(async () => {
      try {
        const result = await updateWorkoutAction(workout.id, updateData);
        if (result.success) {
          toast.success("Workout updated successfully!");
          setIsEditDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update workout.");
        }
      } catch (error) {
        console.error("Error updating workout:", error);
        toast.error("An unexpected error occurred during update.");
      }
    });
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg"
        onClick={handleBack}
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
      </Button>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => !isLoading && setIsEditDialogOpen(open)} // Prevent open/close while loading
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={isLoading} // Disable trigger when loading
          >
            <Pencil className="h-4 w-4 mr-1.5" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
            <DialogDescription>
              Make changes to your logged {workout.type.replace("_", " ")}{" "}
              workout.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <WorkoutForm
              workoutType={workout.type}
              userWeightKg={userWeightKg}
              onSubmit={handleUpdate}
              initialData={workout}
              isEditing={true}
              isSubmitting={isUpdating} // Pass specific state
              onCancel={() => !isLoading && setIsEditDialogOpen(false)} // Prevent closing via cancel while loading
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => !isLoading && setIsDeleteConfirmOpen(open)}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-lg"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              workout entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkoutDetailActions;
