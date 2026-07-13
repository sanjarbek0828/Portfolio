"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function TestimonialMarquee() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [desktopMotion, setDesktopMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setDesktopMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const testimonials = [
    { quote: t("testimonial.quote"), name: "T-Mebel", role: t("testimonial.role") },
    { quote: "Outstanding work! The attention to detail and modern design truly elevated our digital presence.", name: "TechVision", role: "CEO" },
    { quote: "One of the best developers we've worked with. Fast, reliable, and incredibly talented in UI/UX.", name: "CreativeStudio", role: "Project Manager" },
    { quote: t("testimonial.quote"), name: "T-Mebel", role: t("testimonial.role") },
  ];
  const visibleTestimonials = desktopMotion && !reducedMotion
    ? [...testimonials, ...testimonials]
    : testimonials;

  return (
    <div className="no-scrollbar relative flex w-full overflow-x-auto bg-transparent py-10 lg:overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-background to-transparent dark:from-[#020611]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-background to-transparent dark:from-[#020611]" />
      
      <motion.div
        animate={!reducedMotion && desktopMotion ? { x: ["0%", "-50%"] } : undefined}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex w-max snap-x gap-6 px-6"
      >
        {visibleTestimonials.map((item, i) => (
          <div
            key={i}
            className="group relative flex w-[min(350px,82vw)] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-sm transition duration-500 hover:border-primary/30 dark:border-white/[0.08] dark:bg-white/[0.035] sm:w-[450px] sm:p-10"
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
