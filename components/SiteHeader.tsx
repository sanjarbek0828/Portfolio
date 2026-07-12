"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const navigation = [
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.skills"), href: "/#skills" },
    { label: t("nav.projects"), href: "/#projects" },
    { label: t("nav.experience"), href: "/#experience" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/[0.09] bg-[#050916]/75 px-3 text-white shadow-[0_12px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5"
      >
        <Link href="/" className="focus-ring group flex items-center gap-3 rounded-full">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_0_24px_rgba(69,105,255,0.22)]">
            <span className="bg-gradient-to-br from-[#4569ff] to-primary bg-clip-text text-base font-black text-transparent">S</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 dark:via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="hidden text-sm font-bold tracking-[-0.02em] text-white sm:block">
            Sanjarbek<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring relative rounded-full px-4 py-2 text-sm font-medium text-white/55 transition hover:text-white"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-full bg-white/[0.06] opacity-0 transition-opacity hover:opacity-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden xl:block"><LanguageSwitcher /></div>
          <ThemeToggle />
          <Link
            href="/admin"
            aria-label="Admin panel"
            className="focus-ring grid h-10 w-10 place-items-center rounded-full text-white/55 transition hover:bg-white/[0.07] hover:text-[#8aa0ff]"
          >
            <Lock className="h-4 w-4" />
          </Link>
          <Link
            href="/#contact"
            className="focus-ring hidden items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-[#4569ff] to-[#657cff] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_24px_rgba(69,105,255,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(69,105,255,0.45)] sm:flex"
          >
            {t("nav.contact")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#050916]/92 p-3 text-white shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
          >
            <div className="mb-2 px-2 xl:hidden"><LanguageSwitcher /></div>
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold text-white transition hover:bg-white/[0.06]"
              >
                <span>
                  <span className="mr-4 font-mono text-[0.65rem] text-primary">
                    0{index + 1}
                  </span>
                  {item.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/40" />
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
