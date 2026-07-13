"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function TestimonialMarquee() {
  const { t } = useLanguage();

  const testimonials = [
    { quote: t("testimonial.quote"), name: "T-Mebel", role: t("testimonial.role") },
    { quote: "Outstanding work! The attention to detail and modern design truly elevated our digital presence.", name: "TechVision", role: "CEO" },
    { quote: "One of the best developers we've worked with. Fast, reliable, and incredibly talented in UI/UX.", name: "CreativeStudio", role: "Project Manager" },
    { quote: t("testimonial.quote"), name: "T-Mebel", role: t("testimonial.role") },
  ];

  return (
    <div className="relative flex w-full overflow-hidden bg-transparent py-10">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-background to-transparent dark:from-[#020611]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-background to-transparent dark:from-[#020611]" />
      
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex w-max gap-6 px-6"
      >
        {/* Double the array for seamless infinite scroll */}
        {[...testimonials, ...testimonials].map((item, i) => (
          <div
            key={i}
            className="group relative flex w-[350px] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02] p-8 backdrop-blur-xl transition duration-500 hover:border-primary/30 sm:w-[450px] sm:p-10"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <Quote className="h-8 w-8 text-primary/40 transition-colors group-hover:text-primary" />
              <blockquote className="mt-6 text-lg font-semibold leading-relaxed tracking-tight text-foreground dark:text-white/90">
                “{item.quote}”
              </blockquote>
            </div>
            <div className="relative z-10 mt-10 flex items-center gap-4 border-t border-black/5 pt-6 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground dark:text-white">{item.name}</p>
                <p className="text-xs font-medium text-foreground/60 dark:text-white/50">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
