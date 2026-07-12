"use client";

import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Search,
  X,
} from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TechIcon } from "@/components/TechIcon";
import { Input } from "@/components/ui/input";
import { projects as staticProjects, type Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics";

const filters = ["All", "Web ilova", "PWA ilova", "Telegram bot"] as const;
type Filter = (typeof filters)[number];

const ProjectCard = forwardRef<
  HTMLElement,
  {
    project: Project;
    index: number;
    onOpen: () => void;
  }
>(({ project, index, onOpen }, ref) => {
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  const cardX = useMotionValue(0.5);
  const cardY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(cardY, [0, 1], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(cardX, [0, 1], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  });

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ duration: 0.45, delay: index * 0.045 }}
      className="glass-panel interactive-lift group relative overflow-hidden rounded-[2rem] p-3"
    >
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
        className={cn(
          "relative aspect-[16/11] overflow-hidden rounded-[1.45rem] bg-gradient-to-br p-[2px]",
          project.accent,
        )}
      >
        <div className="relative h-full overflow-hidden rounded-[calc(1.45rem-2px)] border-[4px] border-background bg-slate-950">
           {project.image ? (
               <Image 
                 src={project.image} 
                 alt={project.title} 
                 fill 
                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                 className="object-cover transition duration-700 hover:scale-[1.025]"
               />
           ) : (
               <div className="absolute inset-0 bg-slate-900 grid place-items-center"><span className="text-muted-foreground dark:text-white/60 text-sm">No image</span></div>
           )}
           <div className="pointer-events-none absolute inset-0 rounded-[calc(1.45rem-6px)] ring-1 ring-inset ring-white/10" />
        </div>

        <div className="absolute right-4 top-4 flex gap-2 z-10" style={{ transform: "translateZ(30px)" }}>
          {project.github && (
            <a
              href={project.github}
              onClick={() => trackEvent("project_click", { project: project.slug, target: "github" })}
              target="_blank"
              rel="noreferrer"
            aria-label={`${project.title} manba kodini ko‘rish`}
              className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-slate-950/80 text-white shadow-lg backdrop-blur-xl transition hover:scale-105"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              onClick={() => trackEvent("project_click", { project: project.slug, target: "live" })}
              target="_blank"
              rel="noreferrer"
            aria-label={`${project.title} loyihasini ochish`}
              className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-white text-slate-950 shadow-lg transition hover:scale-105"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </motion.div>

      <div className="p-4 pb-5 pt-6 sm:p-6 sm:pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {project.category}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-[-0.035em]">
              {project.title}
            </h3>
          </div>
          <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground dark:text-white/60">
            {project.year}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground dark:text-white/60">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {(Array.isArray(project.stack) ? project.stack : []).map((tech) => (
            <div key={tech} title={tech} className="group relative">
               <TechIcon tech={tech} className="h-5 w-5 opacity-75 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="focus-ring group/link mt-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-foreground transition hover:text-primary"
        >
          {t("projects.details")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
});
ProjectCard.displayName = "ProjectCard";

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      className="fixed inset-0 z-[999] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xl sm:p-6"
    >
      <motion.article
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-6 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/15 bg-[#0a0e1a] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
      >
        <div className={cn("relative overflow-hidden bg-gradient-to-br p-7 text-white sm:p-10", project.accent)}>
          <div className="absolute inset-0 bg-black/40" />
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-30 mix-blend-overlay" />
          <div aria-hidden="true" className="absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-black/5 dark:bg-white/10 blur-[90px]" />
          <div className="relative pr-12">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              <span>{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
              <span>·</span>
              <span>{project.metric}</span>
            </div>
            <h3 id="case-study-title" className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              {project.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              {project.description}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/25 text-white backdrop-blur-lg transition hover:bg-black/40"
            aria-label="Loyiha oynasini yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("projects.problem")}</p>
            <p className="mt-3 text-sm leading-6 text-white/72">{project.challenge}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("projects.solution")}</p>
            <p className="mt-3 text-sm leading-6 text-white/72">{project.solution}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("projects.outcomes")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Array.isArray(project.outcomes) ? project.outcomes : []).map((outcome) => (
                <div key={outcome} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            {(Array.isArray(project.stack) ? project.stack : []).map((tech) => (
               <div key={tech} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md shadow-sm">
                 <TechIcon tech={tech} className="h-4 w-4" />
                 {tech}
               </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-black/5 dark:border-white/10 pt-6 sm:flex-row md:col-span-2 md:items-center md:justify-between">
            <p className="text-xs text-white/50">{t("projects.role")}: {project.role}</p>
            <div className="flex gap-2">
              {project.github ? (
                <a href={project.github} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white">
                  <Github className="h-3.5 w-3.5" /> {t("projects.source")}
                </a>
              ) : null}
              <a href={project.live} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4569ff] to-primary px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:shadow-[0_0_20px_rgba(69,105,255,0.3)]">
                {t("projects.open")} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));
        if (!snap.empty) {
          const data = snap.docs.map((projectDoc) => ({
            ...projectDoc.data(),
            slug: projectDoc.data().slug || projectDoc.id,
          } as Project)).filter((project) => project.status !== "draft").sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setProjects(data);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => {
      const matchesFilter = activeFilter === "All" || project.category === activeFilter;
      const searchable = `${project.title} ${project.description} ${(Array.isArray(project.stack) ? project.stack : []).join(" ")}`.toLowerCase();
      return matchesFilter && searchable.includes(query.trim().toLowerCase());
    }),
    [activeFilter, query, projects],
  );

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="content-auto relative overflow-hidden bg-white dark:bg-[#020611] text-foreground dark:text-white">
      <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-15 mask-fade-bottom" />
      <div aria-hidden="true" className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-32 top-3/4 h-[400px] w-[400px] rounded-full bg-[#4569ff]/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="section-shell relative z-10">
        <ScrollReveal>
          <div
            id="projects-heading"
            className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <SectionHeading
              eyebrow={t("projects.eyebrow")}
              title={t("projects.title")}
              description={t("projects.description")}
            />

            <div
              className="no-scrollbar flex max-w-full self-start overflow-x-auto rounded-full border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] p-1 backdrop-blur-xl"
              role="tablist"
              aria-label="Filter projects"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "focus-ring relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:px-5 sm:text-sm",
                    activeFilter === filter
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-white/50 dark:hover:text-white",
                  )}
                >
                  {activeFilter === filter ? (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-full bg-primary shadow-glow"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  ) : null}
                  <span className="relative z-10">{filter === "All" ? t("projects.all") : filter}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05} className="mt-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] p-2 backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/40" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("projects.search")}
                aria-label="Loyihalarni qidirish"
                className="border-0 bg-transparent pl-11 text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:ring-0 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
            <p className="px-3 pb-2 text-xs text-slate-500 dark:text-white/40 sm:pb-0">
              <span className="font-bold text-white">{filteredProjects.length}</span> {t("projects.count")}
            </p>
          </div>
        </ScrollReveal>

        <motion.div layout className="mt-14 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onOpen={() => { trackEvent("project_click", { project: project.slug, target: "case_study" }); setSelectedProject(project); }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-black/5 dark:border-white/10 p-12 text-center">
            <p className="font-semibold text-white">{t("projects.empty")}</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFilter("All");
              }}
              className="focus-ring mt-2 rounded-md text-sm font-semibold text-primary"
            >
              {t("projects.clear")}
            </button>
          </div>
        ) : null}

        <ScrollReveal className="mt-10 flex justify-center">
          <a href="https://github.com/sanjarbek404" target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:hover:bg-white/[0.08] dark:hover:text-white">
            {t("projects.github")} <ArrowUpRight className="h-4 w-4" />
          </a>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
