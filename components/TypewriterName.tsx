"use client";

import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: customDelay },
  }),
};

const child: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 200 },
  },
  hidden: {
    opacity: 0,
    y: 10,
    transition: { type: "spring", damping: 15, stiffness: 200 },
  },
};

export function TypewriterName({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <h1 className="mt-5 font-black uppercase leading-[0.88] tracking-[-0.055em]">
      <motion.span
        className="block text-[clamp(3.4rem,6vw,6.25rem)] text-white"
        variants={container}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        {Array.from(firstName).map((char, index) => (
          <motion.span variants={child} key={index} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
      
      <motion.span
        className="mt-2 block bg-gradient-to-r from-[#4569ff] via-[#6685ff] to-[#8aa0ff] bg-clip-text text-[clamp(3.2rem,5.8vw,5.9rem)] text-transparent"
        variants={container}
        initial="hidden"
        animate="visible"
        custom={firstName.length * 0.08 + 0.3}
      >
        {Array.from(lastName).map((char, index) => (
          <motion.span variants={child} key={index} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        <motion.span 
          animate={{ opacity: [1, 0.2] }} 
          transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", repeatType: "reverse" }} 
          className="mb-[0.1em] ml-3 inline-block h-[0.75em] w-[0.12em] align-middle rounded-full bg-[#4569ff] dark:bg-[#6685ff]"
        />
      </motion.span>
    </h1>
  );
}
