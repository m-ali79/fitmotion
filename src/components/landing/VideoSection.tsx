"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause, Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      ref={ref}
      className="relative py-24 bg-fitness-dark overflow-hidden"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main video player */}
              <div className="relative rounded-2xl overflow-hidden bg-fitness-gray shadow-2xl">
                <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[3/4]">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    muted
                    loop
                    playsInline
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                  >
                    <source
                      src="/mixkit-52088-video-52088-hd-ready.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-fitness-dark/70 to-transparent"></div>

                  {/* Play/Pause button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      className="w-16 h-16 bg-fitness-primary rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-80"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 text-white" fill="white" />
                      ) : (
                        <Play
                          className="h-6 w-6 text-white ml-1"
                          fill="white"
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Floating progress element */}
              <motion.div
                className="absolute bottom-[-20px] right-[-20px] md:bottom-[-30px] md:right-[-30px] lg:-bottom-10 lg:-right-10 z-10 max-w-[200px]"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <div className="bg-fitness-card rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-4">
                    <div className="text-xs text-fitness-accent mb-1">
                      PROGRESS
                    </div>
                    <div className="text-white font-medium mb-2">
                      Weekly Goals
                    </div>
                    <div className="w-full h-2 bg-fitness-gray rounded-full mb-3">
                      <div
                        className="h-full bg-fitness-primary rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">70% completed</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="w-12 h-12 rounded-xl bg-fitness-primary flex items-center justify-center mb-6">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Next Level
              <span className="text-fitness-primary block mt-2">
                Fitness AI
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-8">
              Unlock your potential with AI fitness. Get custom nutrition plans
              based on your goals, instantly log meals with a photo, and chat
              with our AI assistant anytime. Train smarter, achieve faster
              results.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Personalized daily nutrition targets (calories, macros).",
                "Snap a photo to instantly log food and analyze nutrition.",
                "Get answers and motivation from your AI fitness chatbot 24/7.",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-fitness-primary/20 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-fitness-primary"></div>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/sign-up">
              <Button className="bg-fitness-primary hover:bg-fitness-primary/90 text-white">
                Start training now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoSection;
