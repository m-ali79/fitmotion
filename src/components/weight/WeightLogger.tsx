"use client";

import { useState, useTransition } from "react";
import { LogWeightFormData } from "@/types/weight";
import { logWeightEntry } from "@/actions/weight";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { WeightForm } from "./WeightForm";

export default function WeightLogger() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateSubmit = (data: LogWeightFormData) => {
    startTransition(async () => {
      try {
        const result = await logWeightEntry(data);

        if (result.success) {
          toast.success(result.message);
          setIsOpen(false);
          router.push("/weight");
          router.refresh();
        } else {
          console.error("Weight logging failed:", result.message);
          toast.error(result.message || "An unexpected error occurred.");
        }
      } catch (error) {
        console.error("Weight logging failed:", error);
        toast.error("An unexpected error occurred while logging weight.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90 h-12 btn-hover-effect">
          <PlusCircle className="h-5 w-5 mr-2" />
          Log Weight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">
            Log New Weight
          </DialogTitle>
        </DialogHeader>
        <WeightForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isPending}
          submitButtonText="Log Weight"
        />
      </DialogContent>
    </Dialog>
  );
}
