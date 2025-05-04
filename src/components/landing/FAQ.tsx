"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/lib/constants";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string | null>("item-0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.13, 0.53, 0.38, 0.97] }}
      ref={ref}
      className="py-24 bg-fitness-dark relative overflow-hidden"
      id="faq"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-fitness-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-white/10 text-white mb-5">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about FitMotion
          </p>
        </motion.div>

        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          value={openItem || undefined}
          onValueChange={(value) => setOpenItem(value)}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border border-fitness-gray/30 rounded-xl overflow-hidden bg-fitness-gray/20 hover:bg-fitness-gray/30 transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-5 text-left hover:no-underline text-white flex">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-lg font-medium mr-4">
                      {faq.question}
                    </span>
                    <div className="bg-fitness-gray/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                      {openItem === `item-${index}` ? (
                        <Minus className="h-5 w-5 text-white" />
                      ) : (
                        <Plus className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default FAQ;
