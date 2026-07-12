"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScrollRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  duration = 0.7,
  once = true,
  amount = 0.2,
  ...props
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
