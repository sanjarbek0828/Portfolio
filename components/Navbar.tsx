"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["home", ...navigation.map((item) => item.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.6] },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-transparent px-3 transition-all duration-500 sm:px-5",
          scrolled &&
            "border-border/70 bg-background/75 shadow-lg shadow-black/5 backdrop-blur-2xl dark:shadow-black/20",
        )}
        aria-label="Primary navigation"
      >
        <a
          href="#home"
          aria-label="Sanjarbek Otabekov, home"
          className="focus-ring group flex items-center gap-3 rounded-full"
        >
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-foreground text-xs font-black text-background">
            SO
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">
            Sanjarbek<span className="text-primary">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition hover:bg-foreground/5 hover:text-foreground",
                activeSection === item.href.slice(1)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {activeSection === item.href.slice(1) ? (
                <motion.span
                  layoutId="active-navigation"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary"
                />
              ) : null}
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new Event("portfolio:open-command"))}
            className="hidden h-9 gap-2 border-border/70 bg-background/40 px-3 text-muted-foreground lg:inline-flex"
            aria-label="Open quick navigation"
          >
            <Command className="h-3.5 w-3.5" />
            <kbd className="font-sans text-[10px]">⌘K</kbd>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Let&apos;s talk</a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass-panel mx-auto mt-3 max-w-6xl rounded-3xl p-3 md:hidden"
          >
            {navigation.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block rounded-2xl px-5 py-4 text-lg font-semibold transition hover:bg-foreground/5",
                  activeSection === item.href.slice(1) && "bg-primary/10 text-primary",
                )}
              >
                <span className="mr-4 text-xs font-medium text-primary">0{index + 1}</span>
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
