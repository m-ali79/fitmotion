"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat, type Message } from "@ai-sdk/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Webcam from "react-webcam";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Brain,
  Send,
  X,
  CornerDownLeft,
  Sparkles,
  Trash2,
  Paperclip,
  Camera,
} from "lucide-react";

// Helper function to convert Base64 Data URL to File object
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
    toast.error("Failed to process captured image.");
    return null;
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
  } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat API Error:", error);
      toast.error(
        `Error communicating with AI: ${error.message || "Unknown error"}`
      );
    },
    initialMessages: [
      {
        id: "initial-ai-message",
        role: "assistant",
        content:
          "Hi there! I'm your AI fitness assistant. Ask me anything about workouts, nutrition, or upload an image of gym equipment or food for analysis.",
      },
    ],
  });

  // Auto-scroll effect
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Only scroll if the user isn't already scrolled up
      const isScrolledToBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 10; // Add tolerance
      if (isScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  // Function to safely update the preview URL
  const updatePreviewUrl = (file: File | null) => {
    setPreviewObjectUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      if (file) {
        return URL.createObjectURL(file);
      }

      return null;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setStagedFile(file);
    updatePreviewUrl(file);
    if (event.target) event.target.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrcBase64 = webcamRef.current.getScreenshot();
      if (imageSrcBase64) {
        const capturedFile = dataURLtoFile(
          imageSrcBase64,
          "webcam-capture.jpeg"
        );
        if (capturedFile) {
          setStagedFile(capturedFile);
          updatePreviewUrl(capturedFile);
        }
        setIsCameraOpen(false);
      } else {
        toast.error("Failed to capture image from camera.");
      }
    }
  }, []);

  const handleCameraError = useCallback((error: Error | string) => {
    console.error("Webcam Error:", error);
    let message =
      "Could not access camera. Please ensure permissions are granted.";
    if (typeof error !== "string" && error.message) {
      message = `Camera error: ${error.message}`;
    }
    toast.error(message);
    setIsCameraOpen(false);
  }, []);

  const clearAttachment = () => {
    setStagedFile(null);
    updatePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      isLoading ||
      (!input.trim() && !stagedFile) ||
      (stagedFile && !input.trim())
    ) {
      if (stagedFile && !input.trim()) {
        toast.info("Please add a description or question for the image.");
      }
      return;
    }

    let attachmentsToSend: FileList | undefined = undefined;
    if (stagedFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(stagedFile);
      attachmentsToSend = dataTransfer.files;
    }

    handleSubmit(e, {
      experimental_attachments: attachmentsToSend,
    });

    handleInputChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    setStagedFile(null);
    updatePreviewUrl(null);
  };

  const suggestionQuestions = [
    "What are the benefits of strength training?",
    "How can I improve my cardio endurance?",
    "Suggest a quick 15-minute workout.",
    "Tell me about nutrition for muscle gain.",
  ];

  const handleSuggestionClick = (question: string) => {
    if (isLoading) return;
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "initial-ai-message",
        role: "assistant",
        content:
          "Hi there! I'm your AI fitness assistant. Ask me anything about workouts, nutrition, or upload an image of gym equipment or food for analysis.",
      },
    ]);
    clearAttachment();
    toast.success("Chat history cleared.");
  };

  // Cleanup function for the preview URL when component unmounts
  useEffect(() => {
    return () => {
      setPreviewObjectUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return null;
      });
    };
  }, []);

  return (
    <>
      {/* Chat button  */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-fitness-primary text-white rounded-full p-4 shadow-lg hover:bg-fitness-primary/90 transition-all duration-300"
        aria-label="Open AI Fitness Assistant"
      >
        <Brain className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed inset-0 z-[100] flex items-end justify-center sm:justify-end p-0 sm:p-4 transition-all duration-300 ease-smooth ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Chat Window */}
        <div className="relative bg-gradient-to-br from-[#1e1e2f] via-[#1b1b25] to-[#16161e] rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md h-[90vh] sm:h-[700px] sm:max-h-[85vh] flex flex-col overflow-hidden animate-scale-in border border-gray-700/50">
          {/* Header Section */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-fitness-primary/10 to-fitness-accent/10 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              {/* Title & Icon */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fitness-accent to-fitness-primary flex items-center justify-center ring-1 ring-white/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    AI Fitness Assistant
                  </h3>
                  <p className="text-white/70 text-xs">
                    Your guide to fitness & nutrition
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  title="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {/* Accordion Tips */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="flex items-center justify-start text-white/60 hover:text-white/80 hover:no-underline w-full text-left text-[11px] py-1">
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1.5 text-yellow-400" />
                    Tips for better AI assistance
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0 pl-4 pr-2 border-l border-white/10 ml-1.5">
                  <ul className="list-disc list-outside space-y-1 text-white/60 text-[11px] marker:text-yellow-400/80">
                    <li>Be specific about your fitness goals.</li>
                    <li>Mention any physical limitations or injuries.</li>
                    <li>Take clear, well-lit photos of equipment/food.</li>
                    <li>Ask about proper exercise form.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pt-2 space-y-4 bg-[#16161e]"
          >
            {/* Render messages from the useChat hook */}
            {messages.map((m: Message) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-md text-sm ${m.role === "user" ? "bg-fitness-primary text-white rounded-tr-none" : "bg-[#2a2a36] text-gray-200 rounded-tl-none"}`}
                >
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-fitness-accent to-fitness-primary flex items-center justify-center">
                        <Brain className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-300">
                        AI Assistant
                      </span>
                    </div>
                  )}

                  {m.experimental_attachments &&
                    m.experimental_attachments
                      .filter((att) => att.contentType?.startsWith("image/"))
                      .map((att, idx) => (
                        <div key={`${m.id}-att-${idx}`} className="mb-2">
                          <Image
                            src={att.url}
                            alt={att.name ?? "Uploaded image"}
                            width={200}
                            height={150}
                            className="rounded-md border border-gray-600 object-cover"
                          />
                        </div>
                      ))}
                  {typeof m.content === "string" && m.content.trim() !== "" && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {/* Loading Indicator */}
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-md bg-[#2a2a36] text-gray-200 rounded-tl-none">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-fitness-accent to-fitness-primary flex items-center justify-center">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-300">
                      AI Assistant
                    </span>
                  </div>
                  <div className="flex space-x-1 items-center">
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions Area */}
          {!isLoading && messages.length <= 1 && !input && !stagedFile && (
            <div className="p-4 border-t border-gray-800 bg-[#1e1e2f]/80 backdrop-blur-sm overflow-x-auto no-scrollbar flex-shrink-0">
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Try asking:
              </p>
              <div className="flex flex-col gap-2 items-start">
                {suggestionQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="w-full text-left text-xs bg-[#2a2a36] text-gray-300 px-3 py-2 rounded-md hover:bg-gray-700/80 hover:text-white transition-colors whitespace-normal"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form Area */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-gray-800 bg-[#1e1e2f] flex-shrink-0"
          >
            {/* Attachment Preview */}
            {previewObjectUrl && (
              <div className="relative w-16 h-16 mb-2 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                <Image
                  src={previewObjectUrl}
                  alt="Attachment preview"
                  layout="fill"
                  objectFit="cover"
                />
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="absolute top-0.5 right-0.5 z-10 p-0.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                  aria-label="Remove attachment"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {/* Input Row */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Attach Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={triggerFileUpload}
                className="text-gray-400 hover:text-fitness-primary h-9 w-9 shrink-0"
                title="Upload Image"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              {/* Camera Button */}
              <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-fitness-primary h-9 w-9 shrink-0"
                    title="Use Camera"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-lg bg-[#16161e] border-gray-700">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    height={720}
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "environment",
                    }}
                    mirrored={false}
                    className="w-full h-auto rounded-t-lg"
                    onUserMediaError={handleCameraError}
                  />
                  <DialogFooter className="p-3 bg-[#1e1e2f] rounded-b-lg">
                    <Button
                      variant="outline"
                      onClick={() => setIsCameraOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={captureImage}
                      className="bg-fitness-primary hover:bg-fitness-primary/90"
                    >
                      Capture photo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    stagedFile
                      ? "Describe image or ask question..."
                      : "Ask about fitness or nutrition..."
                  }
                  className="w-full py-2 pl-4 pr-4 rounded-full border border-gray-700 bg-[#2a2a36] text-white focus:outline-none focus:ring-1 focus:ring-fitness-primary placeholder:text-gray-400/80 text-sm"
                  disabled={isLoading}
                />
              </div>
              {/* Send Button*/}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (!input.trim() && !stagedFile) ||
                  !!(stagedFile && !input.trim())
                }
                className="bg-fitness-primary hover:bg-fitness-primary/90 text-white h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-50"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {/* Footer Hint */}
            <div className="flex items-center text-xs text-gray-500 mt-2 pl-[88px]">
              <CornerDownLeft className="h-3 w-3 mr-1" />
              <span>Enter to send</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
