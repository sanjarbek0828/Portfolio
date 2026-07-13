import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Layers3,
  Target,
  Wrench,
} from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteHeader } from "@/components/SiteHeader";
import { projects } from "@/lib/portfolio-data";

type ProjectPageProps = {
  params: { slug: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return { title: "Loyiha topilmadi" };
  }

  const ogDescription = `${project.description} Texnologiyalar: ${project.stack.slice(0, 3).join(", ")}.`;

  return {
    title: `${project.title} — Loyiha tafsilotlari`,
    description: ogDescription,
    keywords: [...project.stack, project.title, "Sanjarbek Otabekov", "Portfolio"],
    openGraph: {
      title: `${project.title} — Sanjarbek Otabekov Portfolio`,
      description: ogDescription,
      type: "article",
      url: `https://sanjarme.uz/projects/${project.slug}`,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: `${project.title} — ${project.category}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Sanjarbek Otabekov`,
      description: ogDescription,
      images: [project.image],
    },
    alternates: {
      canonical: `https://sanjarme.uz/projects/${project.slug}`,
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectIndex = projects.findIndex((item) => item.slug === params.slug);
  const project = projects[projectIndex];

  if (!project) notFound();

  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="overflow-hidden pb-10 pt-32 sm:pt-36">
        <section className="container">
          <ScrollReveal>
            <Link
              href="/#projects"
              className="focus-ring inline-flex items-center gap-2 rounded-full text-xs font-semibold text-muted-foreground transition hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Loyihalarga qaytish
            </Link>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  <span>{project.category}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>{project.year}</span>
                </div>
                <h1 className="mt-5 max-w-5xl text-balance text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                  {project.title}
                </h1>
                <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <Github className="h-4 w-4" /> Manba kodi
                  </a>
                ) : null}
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  Loyihani ko‘rish <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-14">
            <div className={`relative aspect-[16/9] min-h-[300px] overflow-hidden rounded-[2rem] bg-gradient-to-br ${project.accent} p-3 shadow-glass sm:min-h-[420px] sm:p-6`}>
              <div className="relative h-full overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#0b0b0b]/80 shadow-2xl">
                <Image
                  src={project.image}
                  alt={`${project.title} loyihasi ko‘rinishi`}
                  fill
                  priority
                  sizes="(max-width: 768px) 94vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-5 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border sm:grid-cols-3">
            {[
              ["Vazifa", project.role],
              ["Yil", project.year],
              ["Asosiy jihat", project.metric],
            ].map(([label, value]) => (
              <div key={label} className="bg-card p-6 sm:p-7">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-2 text-sm font-bold">{value}</p>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section className="container mt-24 sm:mt-32">
          <div className="mx-auto max-w-5xl space-y-5">
            <ScrollReveal className="bento-card grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.42fr_1fr] lg:p-14">
              <div className="relative z-10">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                  <Target className="h-5 w-5" />
                </span>
                <p className="eyebrow mt-8">01 · Tahlil</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Muammo</h2>
                <p className="mt-1 text-xs text-muted-foreground">Loyiha talabi</p>
              </div>
              <p className="relative z-10 self-center text-pretty text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                {project.challenge}
              </p>
            </ScrollReveal>

            <ScrollReveal className="bento-card grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.42fr_1fr] lg:p-14">
              <div className="relative z-10">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Wrench className="h-5 w-5" />
                </span>
                <p className="eyebrow mt-8">02 · Amalga oshirish</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Yechim</h2>
                <p className="mt-1 text-xs text-muted-foreground">Texnik yondashuv</p>
              </div>
              <p className="relative z-10 self-center text-pretty text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                {project.solution}
              </p>
            </ScrollReveal>

            <div className="grid gap-5 lg:grid-cols-2">
              <ScrollReveal className="bento-card p-7 sm:p-10">
                <div className="relative z-10">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <Layers3 className="h-5 w-5" />
                  </span>
                  <p className="eyebrow mt-8">03 · Texnologiyalar</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Texnologiyalar</h2>
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {project.stack.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs font-semibold"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08} className="bento-card p-7 sm:p-10">
                <div className="relative z-10">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="eyebrow mt-8">04 · Natija</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Natija</h2>
                  <div className="mt-8 space-y-4">
                    {project.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="container mt-24 sm:mt-32">
          <ScrollReveal>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col justify-between gap-10 rounded-[2rem] border border-border bg-card p-7 transition hover:border-primary/35 sm:p-10 md:flex-row md:items-end"
            >
              <div>
                <p className="eyebrow">Keyingi loyiha</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-6xl">{nextProject.title}</h2>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-foreground text-background transition group-hover:-rotate-12 group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
