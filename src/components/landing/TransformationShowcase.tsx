"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Trophy, TrendingUp, Timer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { transformations, Transformation } from "@/lib/constants";
import Image from "next/image";
interface TransformationCardProps {
  transformation: Transformation;
  index: number;
}

const TransformationCard = ({
  transformation,
  index,
}: TransformationCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-fitness-gray/20 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Before and After Images */}
        <div className="relative lg:w-3/5">
          <div className="flex">
            <div className="w-1/2 h-64 relative">
              <Image
                src={transformation.beforeImage}
                alt={`${transformation.name} Before`}
                className="w-full h-full object-cover"
                fill
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fitness-dark/70"></div>
              <div className="absolute bottom-2 left-2 bg-fitness-dark/80 text-white text-xs font-medium px-2 py-1 rounded">
                BEFORE
              </div>
            </div>
            <div className="w-1/2 h-64 relative">
              <Image
                src={transformation.afterImage}
                alt={`${transformation.name} After`}
                className="w-full h-full object-cover"
                fill
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fitness-dark/70"></div>
              <div className="absolute bottom-2 left-2 bg-fitness-primary/80 text-white text-xs font-medium px-2 py-1 rounded">
                AFTER
              </div>
            </div>
          </div>

          {/* Overlay information */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">
              {transformation.duration} Transformation
            </span>
          </div>
        </div>

        {/* Transformation Details */}
        <div className="p-6 lg:w-2/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              {transformation.name}, {transformation.age}
            </h3>
            <p className="text-gray-400 mt-2 mb-6">{transformation.story}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-fitness-gray/30 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-fitness-primary" />
                </div>
                <div className="text-fitness-primary font-bold">
                  {transformation.weightLoss}
                </div>
                <div className="text-xs text-gray-400">Weight Change</div>
              </div>
              <div className="bg-fitness-gray/30 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <Timer className="h-4 w-4 text-fitness-accent" />
                </div>
                <div className="text-fitness-accent font-bold">
                  {transformation.muscleGain}
                </div>
                <div className="text-xs text-gray-400">Muscle Increase</div>
              </div>
            </div>
          </div>

          <Link href="/sign-up">
            <Button
              variant="secondary"
              className="w-full bg-fitness-gray/40 hover:bg-fitness-gray/60 text-white"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const TransformationShowcase = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      className="py-24 bg-fitness-dark overflow-hidden"
      id="transformations"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm mb-5">
            REAL TRANSFORMATIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Success Stories That Inspire
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how our members transformed their bodies and lives with
            personalized fitness plans and consistent tracking
          </p>
        </motion.div>

        <div className="space-y-8">
          {transformations.map((transformation, index) => (
            <TransformationCard
              key={transformation.id}
              transformation={transformation}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-fitness-gray/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-fitness-primary mr-3" />
              <h3 className="text-2xl font-bold text-white">
                Your Transformation Begins Today
              </h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands who have already transformed their bodies and lives
              with our AI-powered fitness tracking
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-fitness-primary hover:bg-fitness-primary/90 text-white px-8"
              >
                Join Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransformationShowcase;
