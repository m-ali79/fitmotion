"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  deleteWeightEntry,
  updateWeightEntry,
  fetchWeightEntryById,
} from "@/actions/weight";
import { LogWeightFormData } from "@/types/weight";
import { WeightForm } from "@/components/weight/WeightForm";
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
import { motion, AnimatePresence } from "framer-motion";

interface WeightDetailActionsProps {
  entryId: string;
}

export const WeightDetailActions = ({ entryId }: WeightDetailActionsProps) => {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LogWeightFormData | null>(null);
  const [isSubmittingEdit, startEditTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        const result = await deleteWeightEntry(entryId);
        if (result.success) {
          toast.success(result.message);
          router.push("/weight");
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete weight entry.");
        console.error("Delete error:", error);
      }
    });
  };

  const handleEditClick = async () => {
    // Fetch current data to pre-fill form
    const entry = await fetchWeightEntryById(entryId);
    if (entry) {
      setEditData({ weightKg: entry.weightKg, notes: entry.notes || "" });
      setIsEditing(true);
    } else {
      toast.error("Could not load entry data for editing.");
    }
  };

  const handleUpdate = (formData: LogWeightFormData) => {
    startEditTransition(async () => {
      try {
        const result = await updateWeightEntry(entryId, formData);
        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
          router.refresh();
        } else {
          toast.error(
            result.errors ? JSON.stringify(result.errors) : result.message
          );
        }
      } catch (error) {
        toast.error("Failed to update weight entry.");
        console.error("Update error:", error);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-lg"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              weight entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        size="icon"
        className="rounded-lg"
        onClick={handleEditClick}
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editData && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 text-card-foreground max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Weight Entry</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <WeightForm
                initialData={editData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmittingEdit}
                onCancel={() => setIsEditing(false)}
                submitButtonText="Update Weight"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
