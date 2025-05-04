"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { categories, Category } from "@/lib/constants";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  const IconComponent = category.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group rounded-2xl overflow-hidden h-full"
    >
      <div
        className={`h-full flex flex-col bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-300`}
      >
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fitness-dark via-transparent to-transparent opacity-90"></div>

          {/* Icon badge */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-fitness-dark/70 backdrop-blur-sm flex items-center justify-center">
            {/* Render the Icon component type with props */}
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">
            {category.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{category.description}</p>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Sessions/Week</div>
              <div className="text-white font-medium">
                {category.metrics.sessions}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Difficulty</div>
              <div className="text-white font-medium">
                {category.metrics.level}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Focus</div>
              <div className="text-white font-medium">
                {category.metrics.focus}
              </div>
            </div>
          </div>

          <Link href="/sign-up" className="mt-auto">
            <Button
              variant="secondary"
              className="w-full bg-fitness-dark/50 hover:bg-fitness-dark/70 text-white"
            >
              View Workouts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const WorkoutCategories = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      className="py-24 bg-fitness-dark overflow-hidden"
      id="workout-categories"
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
            WORKOUT LIBRARY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Find Your Perfect Workout
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose from our extensive library of workout categories, all
            designed to help you reach your fitness goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            <span className="text-fitness-primary font-semibold">
              200+ workouts
            </span>{" "}
            across all categories, with new ones added weekly
          </p>
          <Link href="/sign-up">
            <Button className="bg-fitness-primary hover:bg-fitness-primary/90 text-white">
              Explore All Workouts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkoutCategories;
