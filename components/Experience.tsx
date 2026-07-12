"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { timeline } from "@/lib/portfolio-data";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="content-auto relative">
      <div className="section-shell">
        <ScrollReveal>
          <div id="experience-heading">
            <SectionHeading
              eyebrow="Experience & education"
              title="A journey of learning, building and growing."
              description="Each chapter sharpened a different skill: technical depth, product judgment and the ability to turn ambiguity into momentum."
            />
          </div>
        </ScrollReveal>

        <div className="relative mt-16 lg:ml-[18%]">
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-primary via-violet-500/60 to-transparent sm:left-[27px]" />
          <div className="space-y-7">
            {timeline.map((item, index) => {
              const Icon = item.type === "education" ? GraduationCap : BriefcaseBusiness;

              return (
                <ScrollReveal key={`${item.period}-${item.title}`} delay={index * 0.08}>
                  <motion.article
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="group relative grid gap-5 pl-16 sm:pl-20 lg:grid-cols-[180px_1fr] lg:gap-10"
                  >
                    <span className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-background text-primary shadow-[0_0_0_6px_hsl(var(--background)),0_0_28px_hsl(var(--primary)/0.22)] transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:h-14 sm:w-14">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <time className="pt-1 text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm lg:pt-7">
                      {item.period}
                    </time>
                    <div className="glass-panel rounded-[1.75rem] p-6 transition group-hover:border-primary/25 sm:p-8">
                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {item.company}
                      </p>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
