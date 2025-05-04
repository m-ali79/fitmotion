"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Feature, features } from "@/lib/constants";

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group rounded-2xl overflow-hidden ${feature.color} ${feature.hoverColor} p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
      <p className="text-gray-400 mb-5">{feature.description}</p>

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

const FeaturesScroll = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div className="relative bg-fitness-dark py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-white/10 text-white mb-5">
            POWERFUL FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Built For Results
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI with proven fitness science to
            deliver a personalized experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesScroll;
