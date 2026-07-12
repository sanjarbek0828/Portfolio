"use client";

import { motion } from "framer-motion";
import { Code2, Globe2, Layers3, Sparkles, Zap } from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { skills } from "@/lib/portfolio-data";

const principles = [
  { icon: Zap, label: "Performance", value: "Fast by default" },
  { icon: Layers3, label: "Architecture", value: "Built to scale" },
  { icon: Sparkles, label: "Experience", value: "Details matter" },
];

export function AboutSkills() {
  const loopedSkills = [...skills, ...skills];

  return (
    <section id="about" aria-labelledby="about-heading" className="content-auto relative">
      <div className="section-shell">
        <ScrollReveal>
          <div id="about-heading">
            <SectionHeading
              eyebrow="About & skills"
              title="I turn complex ideas into simple, useful experiences."
              description="Equal parts engineer and product thinker, I care about the entire journey—from the first sketch to the final millisecond of load time."
            />
          </div>
        </ScrollReveal>

        <div className="mt-14 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <ScrollReveal className="md:col-span-4 lg:col-span-7 lg:row-span-2">
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="glass-panel group relative flex h-full min-h-[410px] flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:p-9"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl transition group-hover:bg-blue-500/25" />
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <Code2 className="h-5 w-5" />
                </span>
                <p className="mt-8 max-w-xl text-pretty text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
                  I build digital products with a strong point of view—clean under
                  the hood, intuitive on the surface, and memorable in the details.
                </p>
              </div>
              <div className="relative mt-10 flex flex-wrap gap-2">
                {["Product thinking", "Design systems", "Clean code", "Accessibility"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </motion.article>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="md:col-span-2 lg:col-span-5">
            <motion.article
              whileHover={{ y: -4 }}
              className="glass-panel relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] p-7"
            >
              <div className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-emerald-400/10 text-emerald-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Based in
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight">Tashkent</p>
                <p className="mt-1 text-sm text-muted-foreground">Working worldwide</p>
              </div>
              <div className="mt-10 flex items-center gap-2 text-xs font-semibold text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                UTC +5 · Open to remote
              </div>
            </motion.article>
          </ScrollReveal>

          <ScrollReveal delay={0.14} className="md:col-span-6 lg:col-span-5">
            <article className="glass-panel h-full min-h-[220px] rounded-[2rem] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                How I work
              </p>
              <div className="mt-6 space-y-5">
                {principles.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.18} className="md:col-span-6 lg:col-span-12">
            <div className="glass-panel overflow-hidden rounded-[2rem] py-7">
              <div className="mb-6 flex items-end justify-between px-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Toolkit
                  </p>
                  <h3 className="mt-2 text-xl font-bold">Technologies I trust</h3>
                </div>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Always learning. Always shipping.
                </p>
              </div>
              <div className="mask-fade-x group flex overflow-hidden">
                <div className="flex min-w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused]">
                  {loopedSkills.map((skill, index) => (
                    <div
                      key={`${skill.name}-${index}`}
                      className="flex min-w-40 items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3"
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${skill.color} text-[11px] font-black text-slate-950`}
                      >
                        {skill.mark}
                      </span>
                      <span className="text-sm font-semibold">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
