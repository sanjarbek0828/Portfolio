"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      disabled={!mounted}
      aria-label={dark ? "Light rejimga o‘tish" : "Dark rejimga o‘tish"}
      aria-pressed={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="focus-ring relative flex h-10 w-[68px] items-center rounded-full border border-white/[0.1] bg-white/[0.055] p-1 text-white shadow-inner transition hover:border-[#8aa0ff]/40 hover:bg-white/[0.08] disabled:opacity-60"
    >
      <Sun className={`absolute left-2.5 h-3.5 w-3.5 transition ${dark ? "text-white/25" : "text-amber-300"}`} />
      <Moon className={`absolute right-2.5 h-3.5 w-3.5 transition ${dark ? "text-[#9caeff]" : "text-white/25"}`} />
      <motion.span
        initial={false}
        animate={{ x: dark ? 30 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#10172a] shadow-[0_5px_16px_rgba(0,0,0,0.45)]"
      >
        {mounted && dark ? <Moon className="h-3.5 w-3.5 text-[#9caeff]" /> : <Sun className="h-3.5 w-3.5 text-amber-300" />}
      </motion.span>
    </button>
  );
}
