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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MealData } from "@/types/nutrition";
import { MealType } from "@prisma/client";
import { deleteMeal, updateMeal } from "@/actions/nutrition";
import { MealTypeSelector } from "@/components/nutrition/MealTypeSelector";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MealDetailActionsProps {
  meal: MealData;
}

const MealDetailActions = ({ meal }: MealDetailActionsProps) => {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for edit form
  const [editedMealType, setEditedMealType] = useState<MealType>(meal.mealType);
  const [editedNotes, setEditedNotes] = useState<string>(meal.notes || "");

  const isLoading = isDeleting || isUpdating;

  const handleBack = () => {
    if (isLoading) return;
    router.back();
  };

  const handleDelete = () => {
    if (isLoading) return;
    startDeleteTransition(async () => {
      try {
        const result = await deleteMeal(meal.id);
        if (result.success) {
          toast.success("Meal deleted successfully!");
          setIsDeleteConfirmOpen(false);
          router.push("/nutrition");
          router.refresh(); // Refresh the list view
        } else {
          toast.error(result.error || "Failed to delete meal.");
          setIsDeleteConfirmOpen(false);
        }
      } catch (error) {
        console.error("Error deleting meal:", error);
        toast.error("An unexpected error occurred during deletion.");
        setIsDeleteConfirmOpen(false);
      }
    });
  };

  const handleUpdate = () => {
    if (isLoading) return;
    const updateData = {
      mealType: editedMealType !== meal.mealType ? editedMealType : undefined,
      notes:
        editedNotes !== (meal.notes || "") ? editedNotes || null : undefined,
    };

    // Check if there are actual changes
    if (updateData.mealType === undefined && updateData.notes === undefined) {
      toast.info("No changes detected.");
      setIsEditDialogOpen(false);
      return;
    }

    startUpdateTransition(async () => {
      try {
        const result = await updateMeal(meal.id, updateData);
        if (result.success) {
          toast.success("Meal updated successfully!");
          setIsEditDialogOpen(false);
          router.refresh(); // Refresh the current page data
        } else {
          toast.error(result.error || "Failed to update meal.");
        }
      } catch (error) {
        console.error("Error updating meal:", error);
        toast.error("An unexpected error occurred during update.");
      }
    });
  };

  // Reset edit form state when opening dialog
  const handleEditOpenChange = (open: boolean) => {
    if (open && !isLoading) {
      setEditedMealType(meal.mealType);
      setEditedNotes(meal.notes || "");
      setIsEditDialogOpen(true);
    } else if (!isLoading) {
      setIsEditDialogOpen(false);
    }
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
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4 mr-1.5" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Meal Details</DialogTitle>
            <DialogDescription>
              Modify the meal type or notes for this entry.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <MealTypeSelector
              selectedValue={editedMealType}
              onValueChange={setEditedMealType}
            />
            <div className="space-y-2">
              <Label
                htmlFor="mealNotesEdit"
                className="text-sm font-medium text-muted-foreground"
              >
                Notes (Optional)
              </Label>
              <Textarea
                id="mealNotesEdit"
                placeholder="Add notes..."
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="min-h-[80px] rounded-lg border-border/70 focus:border-primary"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleUpdate} disabled={isLoading}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
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
              meal entry and its associated food items.
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

export default MealDetailActions;
