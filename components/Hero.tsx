"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Magnetic } from "@/components/Magnetic";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/TechIcon";
import { heroHighlights, profile, roles, coreTechnologies } from "@/lib/portfolio-data";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [deleting, setDeleting] = useState(false);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(35);
  const cardX = useMotionValue(0.5);
  const cardY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(cardY, [0, 1], [5, -5]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(cardX, [0, 1], [-5, 5]), {
    stiffness: 180,
    damping: 24,
  });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mouseX}% ${mouseY}%, hsl(222 95% 62% / 0.16), transparent 72%)`;

  useEffect(() => {
    const currentRole = roles[roleIndex];

    if (reduceMotion) {
      setDisplayedRole(currentRole);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayedRole.length < currentRole.length) {
      timeout = setTimeout(
        () => setDisplayedRole(currentRole.slice(0, displayedRole.length + 1)),
        58,
      );
    } else if (!deleting && displayedRole === currentRole) {
      timeout = setTimeout(() => setDeleting(true), 1450);
    } else if (deleting && displayedRole.length > 0) {
      timeout = setTimeout(
        () => setDisplayedRole(currentRole.slice(0, displayedRole.length - 1)),
        30,
      );
    } else {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [deleting, displayedRole, reduceMotion, roleIndex]);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-16"
    >
      <div className="grid-surface mask-fade-bottom absolute inset-0 opacity-65" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />
      <div className="pointer-events-none absolute left-[4%] top-[18%] h-72 w-72 rounded-full bg-blue-600/15 blur-[110px] dark:bg-blue-500/20" />
      <div className="pointer-events-none absolute bottom-[8%] right-[3%] h-96 w-96 rounded-full bg-violet-600/15 blur-[120px] dark:bg-violet-500/20" />

      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(350px,0.78fr)] lg:gap-10 xl:gap-16">
          <div className="min-w-0">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary backdrop-blur-xl sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {profile.availability}
            </motion.div>

            <motion.h1
              id="hero-title"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-[clamp(3.25rem,7vw,7.2rem)] font-black leading-[0.88] tracking-[-0.065em]"
            >
              Hi, I&apos;m
              <span className="gradient-text block pb-2">{profile.shortName}</span>
              <span className="block text-foreground/90">Otabekov.</span>
            </motion.h1>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="mt-7 flex min-h-8 items-center text-lg font-medium text-muted-foreground sm:text-xl"
              aria-live="polite"
            >
              <span className="mr-3 text-primary">{"//"}</span>
              <span>{displayedRole}</span>
              <motion.span
                animate={reduceMotion ? {} : { opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1 h-6 w-0.5 bg-primary"
                aria-hidden="true"
              />
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
              className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
            >
              {profile.summary}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.55 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Magnetic>
                <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                  <a href="#projects">
                    Explore my work <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 sm:w-auto"
                >
                  <a href="/Sanjarbek-Otabekov-CV.pdf" download>
                    <Download className="h-4 w-4" /> Download CV
                  </a>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.78, duration: 0.6 }}
              className="mt-9 grid max-w-xl grid-cols-3 gap-2 border-t border-border/70 pt-6"
            >
              {heroHighlights.map((item) => (
                <div key={item.label} className="min-w-0">
                  <p className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Texnologiyalar</p>
              <div className="flex flex-wrap items-center gap-4">
                 {coreTechnologies.map(tech => (
                    <div key={tech} className="flex items-center group cursor-default" title={tech}>
                       <TechIcon tech={tech} className="h-6 w-6 opacity-50 transition-all duration-300 group-hover:opacity-100 grayscale group-hover:grayscale-0" />
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.32, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[450px] px-5 py-7 sm:px-8 lg:mx-0 lg:ml-auto"
          >
            <div className="absolute inset-[10%] rounded-[2.5rem] bg-gradient-to-br from-cyan-400/35 via-blue-500/15 to-violet-500/40 blur-[55px]" />
            <div
              aria-hidden="true"
              className="absolute inset-1 translate-x-3 translate-y-3 rounded-[2.25rem] border border-dashed border-primary/30 sm:inset-3"
            >
              <span className="absolute -top-1 left-[22%] h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
              <span className="absolute bottom-[18%] right-[3%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.9)]" />
            </div>
            <motion.div
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                cardX.set((event.clientX - rect.left) / rect.width);
                cardY.set((event.clientY - rect.top) / rect.height);
              }}
              onMouseLeave={() => {
                cardX.set(0.5);
                cardY.set(0.5);
              }}
              style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 p-[3px] shadow-[0_28px_90px_-28px_rgba(37,99,235,0.75)]"
            >
              <div className="relative h-full overflow-hidden rounded-[calc(2rem-3px)] border-[6px] border-background bg-slate-950">
                <Image
                  src="/images/Me.png"
                  alt="Portrait of Sanjarbek Otabekov"
                  fill
                  priority
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 430px, 400px"
                  className="object-cover object-[58%_center] transition duration-700 hover:scale-[1.025]"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[calc(2rem-9px)] ring-1 ring-inset ring-white/25" />
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-panel absolute -left-1 top-[18%] flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-semibold sm:-left-6 sm:px-4"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              Tashkent · UTC+5
            </motion.div>
            <motion.div
              animate={reduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="glass-panel absolute -right-1 bottom-[16%] rounded-2xl px-3 py-2.5 text-xs font-semibold sm:-right-6 sm:px-4"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              Open to collaborate
            </motion.div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="focus-ring absolute -bottom-10 right-5 hidden items-center gap-3 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground xl:flex"
        >
          Scroll to explore
          <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/50 backdrop-blur-xl">
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
