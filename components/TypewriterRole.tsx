"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TypewriterRole({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="mt-6 flex min-h-[30px] items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.38em] text-[#6685ff] sm:text-sm">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 14 }}
          className="inline-block"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 0.2] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", repeatType: "reverse" }}
        className="inline-block h-4 w-1.5 rounded-full bg-[#6685ff]"
      />
    </div>
  );
}
