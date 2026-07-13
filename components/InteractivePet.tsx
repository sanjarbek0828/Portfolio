"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { ArrowUp, BriefcaseBusiness, Check, Code2, Command, Copy, Download, Github, Grip, Languages, Mail, MessageSquareText, Moon, Sparkles, Sun, UserRound, Wrench, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/LanguageProvider";
import { profile } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";
import Byte3D from "@/components/Byte3D";

const PET_WIDTH = 96;
const PET_HEIGHT = 106;
type SectionId = "home" | "about" | "skills" | "projects" | "experience" | "contact";

const copy = {
  UZ: { greeting: "Salom! Men Byte — yordamchingizman.", hint: "Portfolio bo‘ylab yo‘l ko‘rsataman. Meni ko‘chiring yoki tezkor amalni tanlang.", about: "Men haqimda", skills: "Ko‘nikmalar", projects: "Loyihalar", contact: "Bog‘lanish", resume: "CV yuklash", top: "Yuqoriga", drag: "Meni ko‘chirish uchun ushlab torting", tools: "Tezkor vositalar", command: "Buyruqlar", email: "Email", copied: "Nusxalandi", theme: "Rejim", language: "Til", bubbles: { home: "Xush kelibsiz! Ctrl + K orqali tezkor qidiruvni oching.", about: "Sanjarbekning yondashuvi va maqsadlari shu yerda.", skills: "Texnologiyalarni ko‘rish uchun pastga davom eting.", projects: "Har bir loyihada real muammo va yechim ko‘rsatilgan.", experience: "Tajriba va ish jarayoni bilan tanishing.", contact: "Loyihangiz bormi? Kontakt formasidan yozib qoldiring." } },
  RU: { greeting: "Привет! Я Byte — ваш помощник.", hint: "Я помогу ориентироваться в портфолио. Перетащите меня или выберите действие.", about: "Обо мне", skills: "Навыки", projects: "Проекты", contact: "Связаться", resume: "Скачать CV", top: "Наверх", drag: "Удерживайте и перетащите меня", tools: "Быстрые инструменты", command: "Команды", email: "Email", copied: "Скопировано", theme: "Тема", language: "Язык", bubbles: { home: "Добро пожаловать! Нажмите Ctrl + K для быстрого поиска.", about: "Здесь — подход и цели Санжарбека.", skills: "Продолжайте ниже, чтобы изучить технологии.", projects: "Каждый проект показывает реальную задачу и решение.", experience: "Познакомьтесь с опытом и процессом работы.", contact: "Есть проект? Отправьте сообщение через форму." } },
  EN: { greeting: "Hi! I’m Byte, your companion.", hint: "I can guide you through the portfolio. Drag me or choose a quick action.", about: "About me", skills: "Skills", projects: "Projects", contact: "Contact", resume: "Download CV", top: "Back to top", drag: "Hold and drag me to move", tools: "Quick tools", command: "Commands", email: "Email", copied: "Copied", theme: "Theme", language: "Language", bubbles: { home: "Welcome! Press Ctrl + K for instant navigation.", about: "Explore Sanjarbek’s approach and goals here.", skills: "Continue below to discover the technology stack.", projects: "Every project presents a real challenge and solution.", experience: "Explore the experience and delivery workflow.", contact: "Have a project? Send a message through the contact form." } },
} as const;

export function InteractivePet() {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const x = useMotionValue(24);
  const y = useMotionValue(24);
  const [ready, setReady] = useState(false);
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = copy[language];

  useEffect(() => {
    const maxX = Math.max(20, window.innerWidth - PET_WIDTH - 28);
    const maxY = Math.max(92, window.innerHeight - PET_HEIGHT - 28);
    try {
      const saved = JSON.parse(window.localStorage.getItem("byte-position") || "null") as { x?: number; y?: number } | null;
      x.set(Math.max(12, Math.min(maxX, saved?.x ?? maxX)));
      y.set(Math.max(80, Math.min(maxY, saved?.y ?? maxY)));
    } catch { x.set(maxX); y.set(maxY); }
    setReady(true);
    if (!window.sessionStorage.getItem("byte-assistant-v3-seen")) {
      const timer = window.setTimeout(() => { setOpen(true); window.sessionStorage.setItem("byte-assistant-v3-seen", "1"); }, 1900);
      return () => window.clearTimeout(timer);
    }
  }, [x, y]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = current?.target.id as SectionId | undefined;
      if (!id) return;
      setActiveSection((previous) => {
        if (previous === id) return previous;
        clearTimeout(bubbleTimerRef.current);
        setBubbleVisible(true);
        bubbleTimerRef.current = setTimeout(() => setBubbleVisible(false), 4200);
        return id;
      });
    }, { threshold: 0.28 });
    (["home", "about", "skills", "projects", "experience", "contact"] as SectionId[]).forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => { observer.disconnect(); clearTimeout(bubbleTimerRef.current); };
  }, []);

  const navigate = (href: string) => {
    setOpen(false); setBubbleVisible(false);
    if (href === "#home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("byte_action", { action: href, language });
  };
  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email); setCopied(true);
    trackEvent("byte_action", { action: "copy_email", language });
    window.setTimeout(() => setCopied(false), 1600);
  };
  const cycleLanguage = () => setLanguage(language === "UZ" ? "RU" : language === "RU" ? "EN" : "UZ");
  const handleClick = () => {
    if (draggedRef.current) return;
    setSpinTrigger((value) => value + 1); setOpen((value) => !value); setBubbleVisible(false);
    trackEvent("byte_action", { action: "open_assistant", language });
  };

  return <div ref={constraintsRef} className="pointer-events-none fixed inset-3 z-40 hidden overflow-hidden lg:block">
    <motion.div drag dragConstraints={constraintsRef} dragElastic={0.035} dragMomentum={false} style={{ x, y }} initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.72 }} onDragStart={() => { draggedRef.current = true; setMoving(true); setOpen(false); setBubbleVisible(false); }} onDrag={(_, info) => { if (Math.abs(info.delta.x) > 0.2) setFacing((current) => { const next = info.delta.x > 0 ? 1 : -1; return current === next ? current : next; }); }} onDragEnd={() => { setMoving(false); const maxX = Math.max(12, window.innerWidth - PET_WIDTH - 28); const snapX = x.get() + PET_WIDTH / 2 < window.innerWidth / 2 ? 12 : maxX; const safeY = Math.max(80, Math.min(window.innerHeight - PET_HEIGHT - 28, y.get())); animate(x, snapX, { type: "spring", stiffness: 310, damping: 27 }); animate(y, safeY, { type: "spring", stiffness: 310, damping: 27 }); window.localStorage.setItem("byte-position", JSON.stringify({ x: snapX, y: safeY })); trackEvent("byte_action", { action: "drag", side: snapX === 12 ? "left" : "right", language }); window.setTimeout(() => { draggedRef.current = false; }, 90); }} className="pointer-events-auto absolute left-0 top-0 h-[106px] w-[96px] cursor-grab touch-none select-none will-change-transform active:cursor-grabbing">
      <AnimatePresence>{bubbleVisible && !open && !moving ? <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.9 }} className={`absolute bottom-[110%] ${facing === 1 ? "right-4" : "left-4"} w-[14rem] cursor-default rounded-2xl border border-primary/20 bg-white/95 p-3 text-xs font-semibold leading-5 text-slate-700 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#07101f] dark:text-white/85`}><div className="flex items-start gap-2"><MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{text.bubbles[activeSection]}</span></div></motion.div> : null}</AnimatePresence>
      <AnimatePresence>{open ? <motion.aside initial={{ opacity: 0, y: 10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute bottom-[7.5rem] right-0 w-[20.5rem] cursor-default rounded-3xl border border-slate-200/80 bg-white/95 p-5 text-slate-900 shadow-[0_24px_80px_rgba(0,100,255,0.18)] backdrop-blur-3xl dark:border-white/15 dark:bg-[#08101f] dark:text-white">
        <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-black text-slate-900 dark:text-white">{text.greeting}</p><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /></div><p className="mt-1 text-[0.65rem] leading-5 text-slate-600 dark:text-white/70">{text.hint}</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Yordamchini yopish" className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/60"><X className="h-3.5 w-3.5" /></button></div>
        <div className="mt-5 grid grid-cols-2 gap-2.5"><Action icon={UserRound} label={text.about} onClick={() => navigate("#about")} /><Action icon={Wrench} label={text.skills} onClick={() => navigate("#skills")} /><Action icon={BriefcaseBusiness} label={text.projects} onClick={() => navigate("#projects")} /><Action icon={Mail} label={text.contact} onClick={() => navigate("#contact")} primary /><a href={profile.resume} target="_blank" rel="noreferrer" onClick={() => trackEvent("byte_action", { action: "resume", language })} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2.5 text-[0.62rem] font-bold text-slate-700 hover:text-primary dark:border-white/10 dark:bg-white/[0.07] dark:text-white/80"><Download className="h-3.5 w-3.5" />{text.resume}</a><Action icon={ArrowUp} label={text.top} onClick={() => navigate("#home")} /></div>
        <p className="mb-2 mt-4 font-mono text-[0.52rem] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-white/55">{text.tools}</p>
        <div className="grid grid-cols-5 gap-1.5"><Tool icon={Command} label={text.command} onClick={() => { setOpen(false); window.dispatchEvent(new Event("portfolio:open-command")); }} /><Tool icon={copied ? Check : Copy} label={copied ? text.copied : text.email} onClick={copyEmail} /><Tool icon={resolvedTheme === "dark" ? Sun : Moon} label={text.theme} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} /><Tool icon={Languages} label={text.language} onClick={cycleLanguage} /><a href="https://github.com/sanjarbek404" target="_blank" rel="noreferrer" aria-label="GitHub" className="focus-ring grid min-h-14 place-items-center rounded-xl border border-slate-200/70 bg-slate-50 text-slate-600 hover:text-primary dark:border-white/10 dark:bg-white/[0.07] dark:text-white/75"><Github className="h-4 w-4" /></a></div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/70 px-3 py-2 text-[0.58rem] text-slate-600 dark:border-white/15 dark:text-white/65"><Grip className="h-3.5 w-3.5 text-primary" />{text.drag}</div>
      </motion.aside> : null}</AnimatePresence>
      <motion.button type="button" onClick={handleClick} onDoubleClick={() => navigate("#home")} aria-label="Byte portfolio yordamchisini ochish" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.92 }} className="relative block h-full w-full border-0 bg-transparent p-0 outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-primary"><Byte3D facing={facing} moving={moving} spinTrigger={spinTrigger} /></motion.button>
      <motion.span animate={{ scaleX: moving ? 1.4 : 0.8, opacity: moving ? 0.55 : 0.18 }} className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-primary blur-[6px]" />
    </motion.div>
  </div>;
}

function Action({ icon: Icon, label, onClick, primary = false }: { icon: typeof Code2; label: string; onClick: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`focus-ring inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[0.62rem] font-bold transition ${primary ? "border-primary bg-primary text-white" : "border-slate-200/70 bg-slate-50 text-slate-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-white/[0.07] dark:text-white/80"}`}><Icon className="h-3.5 w-3.5 shrink-0" />{label}</button>;
}

function Tool({ icon: Icon, label, onClick }: { icon: typeof Code2; label: string; onClick: () => void | Promise<void> }) {
  return <button type="button" onClick={onClick} title={label} aria-label={label} className="focus-ring grid min-h-14 place-items-center rounded-xl border border-slate-200/70 bg-slate-50 text-slate-600 transition hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-white/[0.07] dark:text-white/75"><Icon className="h-4 w-4" /></button>;
}
