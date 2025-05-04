"use client";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, BarChart3, Dumbbell } from "lucide-react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-fitness-dark pt-20"
      id="home"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[60%] w-32 h-32 rounded-full bg-fitness-primary blur-3xl"></div>
        <div className="absolute top-[60%] left-[20%] w-32 h-32 rounded-full bg-fitness-accent blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm mb-5">
              ELEVATE YOUR FITNESS JOURNEY
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-white">
              Power Up
              <span className="text-fitness-primary block mt-2">
                Your Fitness
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-md">
              Track your workouts, nutrition, and progress with our AI-powered
              fitness app. Train smarter, get stronger.
            </p>

            <div className="flex flex-wrap gap-4 mb-12 reveal">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="bg-fitness-primary hover:bg-fitness-primary/90 text-white font-medium px-8 h-14 rounded-xl"
                >
                  Get started
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-medium border-fitness-gray hover:bg-fitness-accent/90 text-white px-8 h-14 rounded-xl hover:border-white/50 hover:text-black"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            className="relative reveal flex justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* 3D Objects */}
              <motion.div
                className="absolute top-[-20px] right-[-20px] lg:-top-16 lg:-right-16 z-10"
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
                <div className="w-24 h-24 rounded-lg bg-[#1C1C21] p-3 shadow-xl transform rotate-12">
                  <div className="w-full h-full flex items-center justify-center text-fitness-primary">
                    <Dumbbell size={48} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <div className="relative w-[300px] h-[500px] rounded-3xl bg-[#1C1C21] overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex flex-col">
                    {/* Mock app screen */}
                    <div className="h-12 bg-fitness-secondary flex items-center justify-between px-4 border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-fitness-primary"></div>
                        <span className="text-xs text-white">FitMotion</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      </div>
                    </div>
                    <div className="flex-grow bg-gradient-to-b from-fitness-secondary to-fitness-dark p-5">
                      {/* App content */}
                      <div className="space-y-4">
                        <div className="bg-fitness-card p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-medium">
                              Today&apos;s Workout
                            </h3>
                            <span className="text-xs text-fitness-primary">
                              View All
                            </span>
                          </div>
                          <div className="space-y-2">
                            {["Upper Body", "Cardio", "Core"].map(
                              (workout, i) => (
                                <div
                                  key={i}
                                  className="flex items-center p-2 bg-fitness-secondary/50 rounded-lg"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-fitness-primary/20 mr-3 flex items-center justify-center">
                                    <Activity
                                      size={16}
                                      className="text-fitness-primary"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm text-white">
                                      {workout}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      45 min • 320 cal
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="bg-fitness-card p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-medium">Progress</h3>
                            <span className="text-xs text-fitness-primary">
                              This Week
                            </span>
                          </div>
                          <div className="h-20 flex items-end justify-between px-2">
                            {[40, 65, 45, 80, 50, 70, 60].map((h, i) => (
                              <div
                                key={i}
                                className="w-[8%] bg-fitness-primary/80 rounded-sm"
                                style={{ height: `${h}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                            <span>S</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[-20px] left-[-20px] lg:-bottom-10 lg:-left-16 z-10"
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              >
                <div className="w-20 h-20 rounded-lg bg-[#1C1C21] flex items-center justify-center shadow-xl transform -rotate-12">
                  <div className="w-12 h-12 rounded-full bg-fitness-accent flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-fitness-dark" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
