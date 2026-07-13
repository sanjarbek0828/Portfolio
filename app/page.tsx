"use client";

import {
  ArrowUpRight,
  Braces,
  Code2,
  Figma,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  Quote,
  Send,
  ServerCog,
} from "lucide-react";

import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteHeader } from "@/components/SiteHeader";
import { TechIcon } from "@/components/TechIcon";
import { TypewriterName } from "@/components/TypewriterName";
import { TypewriterRole } from "@/components/TypewriterRole";
import { Projects } from "@/components/Projects";
import { Certificates } from "@/components/Certificates";
import { useLanguage } from "@/components/LanguageProvider";
import { InteractiveHeroBackground } from "@/components/InteractiveHeroBackground";
import { GitHubStats } from "@/components/GitHubStats";
import { ContactForm } from "@/components/ContactForm";
import { DesktopInteractivePet } from "@/components/DesktopInteractivePet";
import { CommandMenu } from "@/components/CommandMenu";
import { trackEvent } from "@/lib/analytics";
import {
  faq,
  profile,
  services,
  skills,
  socialLinks,
  stats,
  timeline,
  workflow,
} from "@/lib/portfolio-data";

const serviceIcons = [Code2, Figma, MonitorSmartphone, ServerCog];
const socialIcons = { GitHub: Github, LinkedIn: Linkedin, Telegram: Send };
const heroStack = [
  { name: "HTML5", mark: "H5", color: "from-orange-500 to-red-500" },
  { name: "CSS3", mark: "C3", color: "from-sky-500 to-blue-600" },
  { name: "JavaScript", mark: "JS", color: "from-yellow-300 to-amber-500" },
  { name: "React", mark: "Re", color: "from-cyan-300 to-sky-500" },
  { name: "Tailwind", mark: "Tw", color: "from-cyan-400 to-teal-500" },
];
export default function HomePage() {
  const { t, language } = useLanguage();
  const heroCapabilities = [
    { label: t("hero.responsive"), icon: MonitorSmartphone },
    { label: t("hero.fullstack"), icon: Code2 },
    { label: t("hero.uiux"), icon: Figma },
    { label: t("hero.clean"), icon: Braces },
  ];
  const localizedStats = stats.map((item, index) => ({ ...item, label: [
    language === "EN" ? "Years of experience" : language === "RU" ? "Год опыта" : "Yillik tajriba",
    language === "EN" ? "Completed projects" : language === "RU" ? "Завершенных проектов" : "Tugallangan loyihalar",
    language === "EN" ? "Happy clients" : language === "RU" ? "Довольных клиентов" : "Xursand mijozlar",
    language === "EN" ? "Client rating" : language === "RU" ? "Оценка клиентов" : "Mijozlar bahosi",
  ][index] }));
  const localizedServices = services.map((service, index) => {
    const en = [
      ["Web Development", "Modern, fast and secure web applications built with React, Node.js and other advanced technologies."],
      ["UI/UX Design", "Clear and attractive interfaces based on Figma, usability principles and modern design systems."],
      ["Mobile Adaptation", "Responsive experiences optimized for smartphones, tablets and every modern screen size."],
      ["Backend & API", "Reliable server-side systems, REST APIs and scalable database architecture."],
    ];
    const ru = [
      ["Веб-разработка", "Современные, быстрые и безопасные веб-приложения на React, Node.js и других технологиях."],
      ["UI/UX дизайн", "Понятные и привлекательные интерфейсы на основе Figma и современных дизайн-систем."],
      ["Мобильная адаптация", "Адаптивные решения для смартфонов, планшетов и экранов любого размера."],
      ["Backend и API", "Надежная серверная часть, REST API и масштабируемая архитектура базы данных."],
    ];
    const translation = language === "EN" ? en[index] : language === "RU" ? ru[index] : null;
    return translation ? { ...service, title: translation[0], description: translation[1] } : service;
  });
  const localizedFaq = language === "UZ" ? faq : language === "EN" ? [
    { question: "Which technologies do you use?", answer: "I primarily work with React, TypeScript, Node.js, Tailwind CSS and Firebase, and adapt the stack to each product’s requirements." },
    { question: "How long does a project take?", answer: "Depending on scope and complexity, a project usually takes between one week and two months. A precise timeline is provided after discovery." },
    { question: "Do you provide support after launch?", answer: "Yes. Ongoing maintenance, updates and technical support are available under a separate agreement." },
    { question: "How are payments handled?", answer: "Payments are usually split into two or three milestones, with 30–50% paid before development begins." },
  ] : [
    { question: "С какими технологиями вы работаете?", answer: "В основном я использую React, TypeScript, Node.js, Tailwind CSS и Firebase, подбирая стек под задачи продукта." },
    { question: "Сколько времени занимает проект?", answer: "В зависимости от масштаба и сложности проект занимает от одной недели до двух месяцев." },
    { question: "Есть ли поддержка после запуска?", answer: "Да. Техническая поддержка, обновления и дальнейшее сопровождение доступны по отдельному соглашению." },
    { question: "Как проходит оплата?", answer: "Обычно оплата делится на два или три этапа, а 30–50% вносится до начала разработки." },
  ];
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <CommandMenu />
      <DesktopInteractivePet />

      <main id="main-content" className="overflow-hidden bg-[#f5f7fb] text-slate-950 dark:bg-[#020611] dark:text-white">
        {/* ── HERO ── */}
        <section id="home" className="relative isolate min-h-screen overflow-hidden">
          <InteractiveHeroBackground />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,17,0.94)_0%,rgba(2,6,17,0.82)_28%,rgba(2,6,17,0.2)_55%,rgba(2,6,17,0.02)_100%)] max-lg:bg-[linear-gradient(90deg,rgba(2,6,17,0.92)_0%,rgba(2,6,17,0.7)_58%,rgba(2,6,17,0.24)_100%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#020611] to-transparent" />
          <div aria-hidden="true" className="absolute left-[4.5%] top-32 h-px w-24 bg-gradient-to-r from-blue-500 to-transparent" />

          <div className="container flex min-h-screen items-center pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pt-32">
            <ScrollReveal distance={32} className="w-full max-w-[34rem] xl:max-w-[38rem]">
              <div className="flex items-center gap-4 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.45em] text-[#6685ff] sm:text-sm">
                <span className="h-px w-8 bg-[#6685ff]" />
                {t("hero.greeting")}
              </div>

              <TypewriterName firstName="Sanjarbek" lastName="Otabekov" />

              <TypewriterRole roles={language === "RU" ? ["Full-Stack разработчик", "UI/UX дизайнер", "Креативный инженер", "Tech энтузиаст"] : ["Full-Stack Developer", "UI/UX Designer", "Creative Thinker", "Tech Enthusiast"]} />
              <p className="mt-5 max-w-md text-pretty text-sm leading-7 text-white/70 sm:text-base">
                {t("hero.description")}
              </p>
              <span className="mt-6 block h-0.5 w-20 bg-[#6685ff] shadow-[0_0_18px_rgba(102,133,255,0.9)]" />

              <div className="mt-8">
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#6685ff]">{t("hero.stack")}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {heroStack.map((technology) => (
                    <div
                      key={technology.name}
                      title={technology.name}
                      className="group grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#6685ff]/60 hover:bg-black/5 dark:bg-white/10"
                    >
                      <TechIcon tech={technology.name} className="h-7 w-7 transition group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 hidden sm:block">
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#6685ff]">{t("hero.capabilities")}</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {heroCapabilities.map((capability) => {
                    const Icon = capability.icon;
                    return (
                      <div key={capability.label} className="flex items-center gap-3 text-xs text-white/70 sm:text-sm">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#6685ff]/30 bg-[#6685ff]/10 text-[#8aa0ff]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {capability.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  onClick={() => trackEvent("hero_cta", { target: "contact", language })}
                  className="focus-ring group inline-flex h-12 items-center justify-center gap-3 rounded-lg border border-[#6685ff]/70 bg-[#4569ff]/10 px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#8aa0ff] backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#4569ff] hover:text-white hover:shadow-[0_0_35px_rgba(69,105,255,0.35)]"
                >
                  {t("hero.cta")}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#projects"
                  onClick={() => trackEvent("hero_cta", { target: "projects", language })}
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-black/20 px-6 text-xs font-semibold text-white/70 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/25 hover:text-white"
                >
                  {t("hero.projects")}
                </a>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-[0.65rem] font-medium text-emerald-300/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  {t("hero.available")}
                </p>
                <GitHubStats />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-[0.07]" />
          <div aria-hidden="true" className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#4569ff]/[0.07] blur-[140px]" />
          <div aria-hidden="true" className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="container relative z-10 py-20 sm:py-28">
            <ScrollReveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("about.label")}</p>
                <p className="mt-5 max-w-3xl text-balance text-2xl font-semibold leading-snug tracking-[-0.035em] text-foreground dark:text-white/90 sm:text-4xl">
                  {t("about.text", profile.fullAbout)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {localizedStats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] p-5 backdrop-blur-md">
                    <p className="text-3xl font-black tracking-[-0.055em] text-foreground dark:text-white sm:text-4xl">{item.value}</p>
                    <p className="mt-2 text-xs leading-5 text-foreground dark:text-white/50">{item.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
          <div aria-hidden="true" className="grid-surface absolute inset-0 opacity-[0.04]" />
          <div aria-hidden="true" className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[140px]" />
          <div className="container relative z-10 py-24 sm:py-28 lg:py-36">
            <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("services.label")}</p>
                <h2 className="mt-4 max-w-3xl text-balance text-3xl font-black tracking-[-0.055em] text-foreground dark:text-white sm:text-5xl lg:text-6xl">
                  {t("services.title")}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-foreground dark:text-white/50">
                {t("services.description")}
              </p>
            </ScrollReveal>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {localizedServices.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <ScrollReveal key={service.title} delay={index * 0.06}>
                    <div className="group relative overflow-hidden rounded-[1.75rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-7 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-black/5 dark:bg-white/[0.04] sm:p-9">
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10 flex h-full min-h-56 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-xs text-foreground dark:text-white/30">{service.number}</span>
                        </div>
                        <div className="mt-auto pt-12">
                          <h3 className="text-2xl font-bold tracking-[-0.04em] text-foreground dark:text-white">{service.title}</h3>
                          <p className="mt-4 max-w-lg text-sm leading-7 text-foreground dark:text-white/50">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-[0.08]" />
          <div aria-hidden="true" className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.08] blur-[140px]" />
          <div aria-hidden="true" className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-[#4569ff]/[0.07] blur-[120px]" />
          <div className="container relative z-10 py-20 sm:py-28">
            <ScrollReveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("skills.label")}</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.055em] text-foreground dark:text-white sm:text-5xl lg:text-6xl">{t("skills.title")}</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-foreground dark:text-white/50">{t("skills.description")}</p>
            </ScrollReveal>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {skills.map((skill, index) => (
                <ScrollReveal key={skill.name} delay={(index % 6) * 0.045}>
                  <div className="group rounded-3xl border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-primary/35 hover:bg-black/5 dark:bg-white/[0.06]">
                    <TechIcon tech={skill.name} className="h-10 w-10" />
                    <p className="mt-6 text-sm font-semibold text-foreground dark:text-white">{skill.name}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <Projects />

        {/* ── CERTIFICATES ── */}
        <Certificates />

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-[0.07]" />
          <div aria-hidden="true" className="absolute right-0 top-1/4 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="container relative z-10 py-24 sm:py-28 lg:py-36">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <ScrollReveal>
                <div className="rounded-[1.75rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-7 backdrop-blur-md sm:p-10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" /></span>
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary mt-10">{t("experience.label")}</p>
                  {timeline.map((item) => (
                    <div key={item.period} className="mt-8 border-l border-primary/35 pl-6">
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">{item.period}</p>
                      <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-foreground dark:text-white sm:text-3xl">{item.title}</h2>
                      <p className="mt-2 text-sm font-semibold text-foreground dark:text-white/70">{item.company}</p>
                      <p className="mt-5 text-sm leading-7 text-foreground dark:text-white/50">{item.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="rounded-[1.75rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-7 backdrop-blur-md sm:p-10">
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("workflow.label")}</p>
                  <h2 className="mt-4 text-2xl font-black tracking-[-0.05em] text-foreground dark:text-white sm:text-3xl lg:text-4xl">{t("workflow.title")}</h2>
                  <div className="mt-9 grid gap-3 sm:grid-cols-2">
                    {workflow.map((step) => (
                      <div key={step.number} className="rounded-2xl border border-black/5 dark:border-white/[0.06] bg-black/5 dark:bg-white/[0.02] p-5">
                        <span className="font-mono text-xs font-bold text-primary">{step.number}</span>
                        <h3 className="mt-5 text-base font-bold text-foreground dark:text-white">{step.title}</h3>
                        <p className="mt-3 text-xs leading-6 text-foreground dark:text-white/50">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL + FAQ ── */}
        <section className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
          <div aria-hidden="true" className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#4569ff]/[0.05] blur-[140px]" />
          <div className="container relative z-10 py-24 sm:py-28">
            <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
              <ScrollReveal>
                <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-8 backdrop-blur-md sm:p-10">
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent" />
                  <div className="relative z-10">
                    <Quote className="h-10 w-10 text-primary" />
                    <blockquote className="mt-10 text-balance text-xl font-semibold leading-snug tracking-[-0.035em] text-foreground dark:text-white sm:text-2xl">
                      “{t("testimonial.quote")}”
                    </blockquote>
                    <div className="mt-10 border-t border-black/5 dark:border-white/10 pt-6">
                      <p className="font-bold text-foreground dark:text-white">T-Mebel</p>
                    <p className="mt-1 text-xs text-foreground dark:text-white/50">{t("testimonial.role")}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="rounded-[1.75rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-7 backdrop-blur-md sm:p-10">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("faq.label")}</p>
                  </div>
                  <div className="mt-7 divide-y divide-slate-200/80 dark:divide-white/[0.06]">
                    {localizedFaq.map((item, index) => (
                      <details key={item.question} className="group py-5" open={index === 0}>
                        <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-5 rounded-lg text-base font-bold text-foreground dark:text-white marker:hidden">
                          {item.question}
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/5 dark:border-white/10 text-primary transition group-open:rotate-45">+</span>
                        </summary>
                        <p className="mt-4 max-w-2xl pr-10 text-sm leading-7 text-foreground dark:text-white/50">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="relative border-t border-black/5 dark:border-white/[0.06]">
          <div className="container relative z-10 pb-8 pt-24 sm:pb-12 sm:pt-28">
            <ScrollReveal className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-black/5 dark:bg-white/[0.025] px-6 py-16 backdrop-blur-md sm:px-12 sm:py-20 lg:px-24">
              <div aria-hidden="true" className="grid-surface absolute inset-0 opacity-[0.06]" />
              <div aria-hidden="true" className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />
              <div aria-hidden="true" className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#6685ff]/15 blur-[120px]" />
              <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">{t("contact.label")}</p>
                  <h2 className="mt-5 max-w-3xl text-balance text-3xl font-black leading-[0.95] tracking-[-0.06em] text-foreground dark:text-white sm:text-5xl lg:text-7xl">
                    {t("contact.title")}
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-foreground dark:text-white/50">{t("contact.description")}</p>
                </div>
                <div className="lg:justify-self-end">
                  <a
                    href={`mailto:${profile.email}`}
                    className="focus-ring group inline-flex max-w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#4569ff] to-primary px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(69,105,255,0.4)]"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{profile.email}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <div className="mt-5 flex flex-wrap gap-2 lg:justify-end">
                    {socialLinks.map((social) => {
                      const Icon = socialIcons[social.label as keyof typeof socialIcons];
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={social.label}
                          className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.04] text-foreground dark:text-white/60 backdrop-blur-md transition hover:-translate-y-1 hover:border-primary/50 hover:bg-black/5 dark:bg-white/[0.08] hover:text-primary"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="container flex flex-col gap-3 border-t border-black/5 dark:border-white/[0.06] py-8 text-xs text-foreground dark:text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sanjarbek Otabekov. Barcha huquqlar himoyalangan.</p>
          <p>{t("footer.built")}</p>
        </footer>
      </main>
    </>
  );
}
