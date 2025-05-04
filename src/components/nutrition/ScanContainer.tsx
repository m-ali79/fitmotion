"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/utils/uploadthing";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

import { ImageCapture } from "./ImageCapture";
import { MealTypeSelector } from "./MealTypeSelector";
import { FoodItemCard } from "./FoodItemCard";
import { MealSummaryCard } from "./MealSummaryCard";

import { FoodAnalysisResult, FoodItemData } from "@/types/nutrition";
import { analyzeFoodImage } from "@/actions/ai/food-analysis";
import { createMeal } from "@/actions/nutrition";
import { deleteUploadedFile } from "@/actions/upload-actions";

const SESSION_STORAGE_KEY = "foodAnalysisResult";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ScanContainer = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<FoodAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    MealType | undefined
  >();
  const [notes, setNotes] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [isLogging, startLoggingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) {
      const savedResultJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedResultJson) {
        try {
          const savedResult: FoodAnalysisResult = JSON.parse(savedResultJson);
          setAnalysisResult(savedResult);
        } catch (error) {
          console.error("Failed to parse saved analysis result:", error);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { startUpload, isUploading } = useUploadThing("mealImageUploader", {
    onClientUploadComplete: () => {
      setUploadProgress(0);
    },
    onUploadError: (error: Error) => {
      setUploadProgress(0);
      toast.error(`Upload failed: ${error.message}`);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleImageSelected = useCallback((file: File | null) => {
    setSelectedImageFile(file);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedMealType(undefined);
    setNotes("");
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const handleAnalyzeImage = async () => {
    if (!selectedImageFile) {
      toast.error("No image selected to analyze.");
      return;
    }

    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedMealType(undefined);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    const imageBase64 = await fileToBase64(selectedImageFile);

    startAnalysisTransition(async () => {
      try {
        const result = await analyzeFoodImage({ imageBase64 });
        if (result.success && result.data) {
          setAnalysisResult(result.data);
          toast.success("Analysis complete!");
          try {
            sessionStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify(result.data)
            );
          } catch (error) {
            console.error(
              "Failed to save analysis result to session storage:",
              error
            );
          }
        } else {
          setAnalysisError(result.error || "Unknown analysis error");
          toast.error(`Analysis failed: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        setAnalysisError(message);
        toast.error(`Analysis failed: ${message}`);
      }
    });
  };

  const handleLogMeal = async () => {
    if (!analysisResult || !selectedImageFile || !selectedMealType) {
      toast.error(
        "Missing analysis data, selected image, or meal type to log."
      );
      return;
    }

    let uploadedFileUrl: string | null = null;
    let uploadErrorOccurred = false;
    setUploadProgress(0);

    try {
      toast.info("Uploading meal image...");
      const uploadResult = await startUpload([selectedImageFile]);

      if (
        !uploadResult ||
        uploadResult.length === 0 ||
        !uploadResult[0]?.ufsUrl
      ) {
        uploadErrorOccurred = true;
        toast.error("Image upload failed or did not return a URL.");
      } else {
        uploadedFileUrl = uploadResult[0].ufsUrl;
        toast.success("Image uploaded successfully! Logging data...");
      }
    } catch (error) {
      uploadErrorOccurred = true;
      console.error("Failed during image upload:", error);
      toast.error(
        `Image upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUploadProgress(0);
    }

    if (uploadErrorOccurred || !uploadedFileUrl) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    startLoggingTransition(async () => {
      try {
        const mealDataToLog = {
          name:
            analysisResult.mealName ||
            `Logged Meal - ${new Date().toLocaleTimeString()}`,
          mealType: selectedMealType,
          date: new Date(),
          calories: analysisResult.totalEstimatedCalories,
          protein: analysisResult.totalEstimatedProtein,
          carbs: analysisResult.totalEstimatedCarbs,
          fat: analysisResult.totalEstimatedFat,
          foodItems: analysisResult.foodItems.map((item) => ({
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            servingSize: item.servingSize,
            imageUrl: item.imageUrl,
          })),
          imageUrl: uploadedFileUrl,
          notes: notes.trim() || null,
        };

        await createMeal(mealDataToLog);
        toast.success(`Meal logged successfully! Redirecting...`);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        router.push("/nutrition");
      } catch (error) {
        console.error("Failed to save meal data:", error);
        toast.error(
          `Failed to save meal: ${error instanceof Error ? error.message : "Database error"}. Please try logging again.`
        );
        if (uploadedFileUrl) {
          await deleteUploadedFile(uploadedFileUrl).then((deleteResult) => {
            if (!deleteResult.success) {
              console.error(
                "Failed to delete orphaned file:",
                deleteResult.error
              );
              toast.warning(
                "Could not automatically clean up uploaded image after save failure."
              );
            } else {
              // console.log("Orphaned file deleted successfully.");
            }
          });
        }
      }
    });
  };

  const clearAnalysis = () => {
    setSelectedImageFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedMealType(undefined);
    setNotes("");
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Section 1 */}
      {!analysisResult && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-fitness-text text-center">
            Scan Your Meal
          </h1>
          <p className="text-fitness-muted text-center">
            Use your camera or upload an image for analysis.
          </p>
          <ImageCapture onImageSelect={handleImageSelected} />

          {selectedImageFile && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing || !selectedImageFile}
                className="rounded-lg bg-fitness-primary hover:bg-fitness-primary/90 w-full max-w-xs"
                size="lg"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : null}
                Analyze Meal
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center text-fitness-muted p-4">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Analyzing image... Please wait.</span>
            </div>
          )}

          {analysisError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-destructive/60 bg-fitness-card shadow-lg rounded-xl mt-4 overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-3 bg-destructive/20 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive text-base font-semibold">
                    Analysis Failed
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-4">
                  <p className="text-destructive/90 text-sm flex-grow">
                    {analysisError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAnalysis}
                    className="rounded-md border-destructive/60 text-destructive hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto flex-shrink-0"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Section 2 */}
      {analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-10 md:space-y-12 max-w-4xl mx-auto bg-gradient-radial from-fitness-gray/30 via-background to-background rounded-3xl p-4 md:p-8 my-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-fitness-text"
            >
              Analysis Results
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Button
                variant="outline"
                className="rounded-lg w-full sm:w-auto btn-hover-effect"
                onClick={clearAnalysis}
              >
                Scan New Meal
              </Button>
            </motion.div>
          </div>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <MealSummaryCard result={analysisResult} />
          </motion.section>

          <Separator className="bg-fitness-border/50" />

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-fitness-text text-center">
              Identified Items
            </h2>
            {analysisResult.foodItems.length > 0 ? (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              >
                {analysisResult.foodItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <FoodItemCard item={item as FoodItemData} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-fitness-muted text-center py-8">
                No specific food items were identified.
              </p>
            )}
          </motion.section>

          <Separator className="bg-fitness-border/50" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="rounded-2xl shadow-lg border-2 border-fitness-primary/30 bg-fitness-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-fitness-text text-xl">
                    Log This Meal
                  </CardTitle>
                </div>
                <p className="text-sm text-fitness-muted pt-1">
                  Select the meal type and add any notes.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <MealTypeSelector
                  selectedValue={selectedMealType}
                  onValueChange={setSelectedMealType}
                />
                <div className="space-y-2">
                  <Label
                    htmlFor="mealNotes"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="mealNotes"
                    placeholder="Add notes (e.g., how you felt, specific ingredients)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px] rounded-lg border-border/70 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleLogMeal}
                    disabled={!selectedMealType || isLogging || isUploading}
                    className="w-full rounded-lg bg-fitness-primary hover:bg-fitness-primary/90 py-3 text-base"
                  >
                    {isLogging || isUploading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : null}
                    {isUploading
                      ? `Uploading (${uploadProgress}%)`
                      : isLogging
                        ? "Logging..."
                        : "Log Meal"}
                  </Button>
                  {isUploading && (
                    <Progress
                      value={uploadProgress}
                      className="h-1 [&>*]:bg-fitness-accent"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      )}
    </div>
  );
};
