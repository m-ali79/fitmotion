"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera, FileUp, X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ImageCaptureProps {
  onImageSelect: (file: File | null) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment",
};

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  try {
    const arr = dataurl.split(",");
    if (!arr[0]) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("Error converting data URL to File:", error);
    return null;
  }
};

export const ImageCapture = ({ onImageSelect }: ImageCaptureProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        onImageSelect(file);
        setIsCameraActive(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    setImageSrc(null);
    onImageSelect(null);
    setIsCameraActive(true);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrcBase64 = webcamRef.current.getScreenshot();
      if (imageSrcBase64) {
        setImageSrc(imageSrcBase64);
        const capturedFile = dataURLtoFile(
          imageSrcBase64,
          "webcam-capture.jpeg"
        );
        onImageSelect(capturedFile);
        setIsCameraActive(false);
      } else {
        console.error("Failed to capture screenshot from webcam.");
        onImageSelect(null);
      }
    }
  }, [webcamRef, onImageSelect]);

  const clearSelection = () => {
    setImageSrc(null);
    setIsCameraActive(false);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraError = (error: Error | string) => {
    console.error("Webcam Error:", error);
    alert(
      "Could not access camera. Please ensure permissions are granted and the device is connected."
    );
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-dashed rounded-lg border-fitness-muted min-h-[200px] justify-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload food image"
      />

      {/* Camera View or Image Preview Container */}
      <div className="w-full max-w-md relative rounded-md overflow-hidden bg-gray-200 flex items-center justify-center min-h-[250px]">
        {isCameraActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              mirrored={false}
              onUserMediaError={handleCameraError}
            />
            {/* Camera Controls Overlay */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setIsCameraActive(false)}
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={capture}
                className="rounded-full bg-white/80 text-black hover:bg-white"
              >
                <Camera className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        ) : imageSrc ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={imageSrc}
              alt="Food preview"
              fill
              className="object-contain"
            />
            {/* Retake/Clear Button */}
            <Button
              size="icon"
              variant="destructive"
              onClick={clearSelection}
              className="absolute top-1 right-1 rounded-full h-7 w-7 opacity-80 hover:opacity-100 z-10"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <div className="text-center text-fitness-muted">
            <Camera size={48} className="mb-2 mx-auto" />
            <p>Scan or upload an image</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md">
        {!isCameraActive && !imageSrc && (
          <>
            <Button
              variant="outline"
              onClick={openCamera}
              className="flex-1 btn-hover-effect rounded-lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Use Camera
            </Button>
            <Button
              variant="outline"
              onClick={handleUploadClick}
              className="flex-1 btn-hover-effect rounded-lg"
            >
              <FileUp className="h-5 w-5 mr-2" />
              Upload Image
            </Button>
          </>
        )}
        {imageSrc && (
          <Button
            variant="outline"
            onClick={clearSelection}
            className="w-full btn-hover-effect rounded-lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Choose Different Image
          </Button>
        )}
      </div>
    </div>
  );
};
