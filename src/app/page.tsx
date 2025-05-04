"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeaturesScroll from "@/components/landing/FeaturesScroll";
import BentoGrid from "@/components/landing/BentoGrid";
import VideoSection from "@/components/landing/VideoSection";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Chatbot from "@/components/landing/Chatbot";
import WorkoutCategories from "@/components/landing/WorkoutCategories";
import TransformationShowcase from "@/components/landing/TransformationShowcase";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="relative bg-fitness-dark font-sans">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-fitness-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 rounded-full bg-fitness-accent/5 blur-[100px]"></div>
      </motion.div>

      <Navbar />
      <Hero />
      <FeaturesScroll />
      <VideoSection />
      <WorkoutCategories />
      <BentoGrid />
      <TransformationShowcase />
      <Testimonials />
      <FAQ />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default LandingPage;
