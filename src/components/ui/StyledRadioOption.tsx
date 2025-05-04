import React from "react";
import { CheckCircle2 } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StyledRadioOptionProps {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isCard?: boolean;
  selected?: boolean;
}

const StyledRadioOption = ({
  id,
  value,
  label,
  description,
  icon,
  isCard = false,
  selected = false,
}: StyledRadioOptionProps) => {
  return (
    <div>
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={`flex border-2 border-gray-700 bg-[#22222e] hover:bg-[#2a2a36] hover:border-gray-600 peer-data-[state=checked]:border-fitness-primary ${
          isCard
            ? "flex-col items-center h-auto justify-center rounded-3xl px-6 py-10"
            : "items-center gap-4 rounded-3xl p-4"
        }`}
      >
        {icon && (
          <div
            className={`rounded-full bg-fitness-primary/10 p-${isCard ? "3" : "2"} ${isCard ? "mb-4" : ""}`}
          >
            {icon}
          </div>
        )}
        <div className={isCard ? "text-center" : "flex-1"}>
          <p
            className={`font-medium ${isCard ? "text-lg mb-2" : ""} text-white`}
          >
            {label}
          </p>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
        {!isCard && selected && (
          <CheckCircle2 className="h-5 w-5 text-fitness-primary" />
        )}
      </Label>
    </div>
  );
};

export default StyledRadioOption;
