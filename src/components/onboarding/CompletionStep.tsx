import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Zap,
  Flame,
  ChefHat,
  Fish,
  Brain,
  ChevronRight,
} from "lucide-react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@react-hook/window-size";

interface NutritionPlan {
  tdee: number;
  bmr: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  explanation: string;
}

interface CompletionStepProps {
  plan: NutritionPlan;
  onGoToDashboard: () => void;
}

const StatCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
}) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2a2a36] p-4 rounded-xl flex flex-col items-center justify-center text-center h-full"
    >
      <Icon className="h-8 w-8 text-fitness-primary mb-2" />
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}
        <span className="text-base font-normal ml-1">{unit}</span>
      </p>
    </motion.div>
  );
};

const CompletionStep = ({ plan, onGoToDashboard }: CompletionStepProps) => {
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={600}
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Onboarding Complete!
          </h2>
          <p className="text-lg text-gray-400">
            Your personalized fitness foundation is set. Here&apos;s your
            starting nutrition plan:
          </p>
        </div>

        {/* Nutrition Plan Display */}
        <div className="bg-[#22222e] rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="font-medium text-2xl text-white text-center mb-6">
            Your Daily Nutrition Targets
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Flame}
              label="Calories"
              value={plan.dailyCalories}
              unit="kcal"
            />
            <StatCard
              icon={ChefHat}
              label="Protein"
              value={plan.dailyProtein}
              unit="g"
            />
            <StatCard icon={Fish} label="Fat" value={plan.dailyFat} unit="g" />
            <StatCard
              icon={Brain}
              label="Carbs"
              value={plan.dailyCarbs}
              unit="g"
            />
          </div>

          {/* Explanation Section */}
          <div className="mt-6 bg-[#2a2a36] p-4 rounded-xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-fitness-primary" /> Plan Explanation
            </h4>
            <p className="text-sm text-gray-300">{plan.explanation}</p>
          </div>

          {/* TDEE/BMR Info  */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Estimated TDEE: {plan.tdee} kcal | BMR: {plan.bmr} kcal
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            className="rounded-xl bg-fitness-primary hover:bg-fitness-primary/90 min-w-[200px] shadow-lg shadow-fitness-primary/30"
            onClick={onGoToDashboard}
          >
            Let&apos;s Go! View My Dashboard
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default CompletionStep;
