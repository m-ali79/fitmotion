"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { bentoCards, BentoItem } from "@/lib/constants";
import Image from "next/image";

interface BentoCardProps {
  item: BentoItem;
  index: number;
}

const BentoCard = ({ item, index }: BentoCardProps) => {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: false, amount: 0.3 });

  const IconComponent = item.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group rounded-2xl overflow-hidden ${item.color} ${item.hoverColor} p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-5`}
      >
        <IconComponent className="h-6 w-6 text-white" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
      <p className="text-gray-400 mb-5">{item.description}</p>

      <div className="mt-auto">
        <Link href="/sign-up">
          <Button
            variant="link"
            className="p-0 text-fitness-primary hover:text-fitness-primary/80 group/btn"
          >
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const BentoGrid = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      className="py-24 bg-fitness-dark overflow-hidden"
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
            YOUR SMART FITNESS HUB
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Track Your Progress, Smarter
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Log workouts, track nutrition with AI insights, monitor weight, and
            chat with your fitness assistant – all in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoCards.map((item, i) => (
            <BentoCard key={i} item={item} index={i} />
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Intelligent Fitness Tracking
              <span className="text-fitness-primary block">Made Simple</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Access AI-powered nutrition plans, log meals instantly, track
              workouts and weight, and get support from your fitness bot
              anywhere.
            </p>
            <Link href="/sign-up">
              <Button className="bg-fitness-primary hover:bg-fitness-primary/90 text-white">
                Start training now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="md:w-1/2 relative flex justify-center">
            <div className="relative max-w-[320px]">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                  alt="Fitness App Interface"
                  width={320}
                  height={480}
                  className="w-full h-auto rounded-3xl shadow-2xl"
                  sizes="(max-width: 767px) 100vw, 320px"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BentoGrid;
