"use client";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { testimonials } from "@/lib/constants";
import Image from "next/image";
const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      ref={containerRef}
      className="py-24 bg-fitness-dark relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-fitness-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm mb-5">
            MEET OUR PRO TRAINERS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real stories from real people who transformed their fitness journey
            with FitMotion
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full "
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-fitness-gray/50 p-6 rounded-2xl h-full flex flex-col hover:bg-fitness-gray/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4 relative">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                          fill
                          unoptimized // because using external images server crashes without it
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${
                            starIndex < testimonial.stars
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 flex-grow">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-9 w-9 rounded-full border-gray-700 bg-fitness-gray/50 hover:bg-fitness-gray text-white left-1 md:left-[-10px] lg:left-[-15px]" />
            <CarouselNext className="h-9 w-9 rounded-full border-gray-700 bg-fitness-gray/50 hover:bg-fitness-gray text-white right-1 md:right-[-10px] lg:right-[-15px]" />
          </Carousel>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
