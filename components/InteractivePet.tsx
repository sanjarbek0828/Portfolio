"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { ArrowUp, BriefcaseBusiness, Code2, Download, Grip, Mail, Sparkles, UserRound, Wrench, X, MessageSquareText } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { profile } from "@/lib/portfolio-data";
import Byte3D from "./Byte3D";
import Byte3D from "./Byte3D";

const PET_WIDTH = 96;
const PET_HEIGHT = 106;

type SectionId = "home" | "about" | "skills" | "projects" | "experience" | "contact";

const copy = {
  UZ: { 
    greeting: "Salom! Men Byte — yordamchingizman.", 
    hint: "Meni ushlab istalgan joyga ko‘chiring yoki kerakli bo‘limni tanlang.", 
    about: "Men haqimda", skills: "Ko‘nikmalar", projects: "Loyihalar", contact: "Bog‘lanish", resume: "CV yuklash", top: "Yuqoriga", drag: "Ko‘chirish uchun ushlang",
    bubbles: { home: "Salom! Meni tortib ko'ring!", about: "Men yaratuvchim haqida ko'p narsalarni bilaman.", skills: "Bu texnologiyalar juda zo'r!", projects: "Eng qiziqarli loyihalar shu yerda!", experience: "Katta tajriba va natijalar.", contact: "Keling, birga ishlaymiz!" }
  },
  RU: { 
    greeting: "Привет! Я Byte — ваш помощник.", 
    hint: "Перетащите меня в удобное место или выберите нужный раздел.", 
    about: "Обо мне", skills: "Навыки", projects: "Проекты", contact: "Связаться", resume: "Скачать CV", top: "Наверх", drag: "Удерживайте для перемещения",
    bubbles: { home: "Привет! Попробуй потянуть меня!", about: "Я знаю всё о моём создателе.", skills: "Эти технологии просто супер!", projects: "Самые интересные проекты здесь!", experience: "Богатый опыт и результаты.", contact: "Давайте работать вместе!" }
  },
  EN: { 
    greeting: "Hi! I’m Byte, your companion.", 
    hint: "Drag me anywhere or choose where you would like to go.", 
    about: "About me", skills: "Skills", projects: "Projects", contact: "Contact", resume: "Download CV", top: "Back to top", drag: "Hold and drag to move",
    bubbles: { home: "Hi there! Try dragging me around!", about: "I know everything about my creator.", skills: "These technologies are awesome!", projects: "The coolest projects are right here!", experience: "Rich experience and great results.", contact: "Let's build something together!" }
  },
} as const;

export function InteractivePet() {
  const { language } = useLanguage();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const x = useMotionValue(24);
  const y = useMotionValue(24);
  
  const [ready, setReady] = useState(false);
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const text = copy[language];

  // Initialize position
  useEffect(() => {
    x.set(Math.max(20, window.innerWidth - PET_WIDTH - 32));
    y.set(Math.max(92, window.innerHeight - PET_HEIGHT - 24));
    setReady(true);
    if (!window.sessionStorage.getItem("byte-desktop-helper-seen")) {
      const timer = setTimeout(() => {
        setOpen(true);
        window.sessionStorage.setItem("byte-desktop-helper-seen", "1");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [x, y]);

  // Intersection Observer for scroll tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to find the most visible section
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const id = visibleEntries[0].target.id as SectionId;
          if (id && id !== activeSection) {
            setActiveSection(id);
            setBubbleVisible(true);
            // Hide bubble after 4 seconds
            setTimeout(() => setBubbleVisible(false), 4000);
          }
        }
      },
      { threshold: 0.3 }
    );

    const sections = ["home", "about", "skills", "projects", "experience", "contact"];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  const navigate = (href: string) => {
    setOpen(false);
    setBubbleVisible(false);
    if (href === "#home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClick = () => {
    if (!draggedRef.current) {
      setSpinTrigger(prev => prev + 1); // Trigger 3D spin
      setOpen(val => !val);
      setBubbleVisible(false);
    }
  };

  return (
    <div ref={constraintsRef} className="pointer-events-none fixed inset-3 z-40 overflow-hidden hidden lg:block">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.035}
        dragMomentum={false}
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.72 }}
        onDragStart={() => { draggedRef.current = true; setMoving(true); setOpen(false); setBubbleVisible(false); }}
        onDrag={(_, info) => {
          if (Math.abs(info.delta.x) > 0.2) setFacing((current) => {
            const next = info.delta.x > 0 ? 1 : -1;
            return current === next ? current : next;
          });
        }}
        onDragEnd={() => {
          setMoving(false);
          window.setTimeout(() => { draggedRef.current = false; }, 80);
        }}
        className="pointer-events-auto absolute left-0 top-0 h-[106px] w-[96px] cursor-grab touch-none select-none will-change-transform active:cursor-grabbing"
      >
        
        {/* Dynamic Speech Bubble */}
        <AnimatePresence>
          {bubbleVisible && !open && !moving ? (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9, rotate: facing === 1 ? -10 : 10 }} 
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} 
              exit={{ opacity: 0, y: 5, scale: 0.9 }} 
              className={`absolute bottom-[110%] ${facing === 1 ? 'right-4' : 'left-4'} w-[13rem] cursor-default rounded-2xl border border-primary/20 bg-white/90 p-3 text-sm font-semibold text-slate-800 shadow-[0_12px_40px_rgba(0,240,255,0.15)] backdrop-blur-xl dark:border-primary/30 dark:bg-[#07101f]/90 dark:text-blue-100 dark:shadow-[0_12px_40px_rgba(0,240,255,0.1)]`}
            >
              <div className="flex items-start gap-2">
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="leading-snug">{text.bubbles[activeSection] || text.bubbles.home}</span>
              </div>
              <span className={`absolute -bottom-1.5 ${facing === 1 ? 'right-6' : 'left-6'} h-3 w-3 rotate-45 border-b border-r border-primary/20 bg-white dark:border-primary/30 dark:bg-[#07101f]`} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main Context Menu */}
        <AnimatePresence>
          {open ? (
            <motion.aside 
              initial={{ opacity: 0, y: 10, scale: 0.94 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 8, scale: 0.95 }} 
              className="absolute bottom-[7.5rem] right-0 w-[19.5rem] cursor-default rounded-3xl border border-white/40 bg-white/80 p-5 text-slate-900 shadow-[0_24px_80px_rgba(0,100,255,0.15)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#0a1128]/80 dark:text-white dark:shadow-[0_24px_80px_rgba(0,240,255,0.07)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black tracking-wide text-slate-800 dark:text-blue-50">{text.greeting}</p>
                  <p className="mt-1 text-[0.65rem] leading-5 text-slate-500 dark:text-blue-200/70">{text.hint}</p>
                </div>
                <button type="button" onClick={() => { setOpen(false); }} aria-label="Yordamchini yopish" className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-slate-100/50 text-slate-400 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Action icon={UserRound} label={text.about} onClick={() => { navigate("#about"); }} />
                <Action icon={Wrench} label={text.skills} onClick={() => { navigate("#skills"); }} />
                <Action icon={BriefcaseBusiness} label={text.projects} onClick={() => { navigate("#projects"); }} />
                <Action icon={Mail} label={text.contact} onClick={() => { navigate("#contact"); }} primary />
                <a href={profile.resume} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200/50 bg-white/50 px-3 py-2.5 text-[0.62rem] font-bold text-slate-600 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-white/5 dark:bg-white/5 dark:text-blue-200/70 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"><Download className="h-3.5 w-3.5" />{text.resume}</a>
                <Action icon={ArrowUp} label={text.top} onClick={() => { navigate("#home"); }} />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/60 bg-slate-100/30 px-3 py-2 text-[0.6rem] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-blue-200/50">
                <Grip className="h-3.5 w-3.5 text-primary" />{text.drag}
              </div>
              <span className="absolute -bottom-1.5 right-10 h-3 w-3 rotate-45 border-b border-r border-white/40 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1128]" />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleClick}
          onDoubleClick={() => { navigate("#home"); }}
          aria-label="Byte portfolio yordamchisini ochish"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          className="relative block h-full w-full border-0 bg-transparent p-0 outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="absolute inset-0">
            <Byte3D facing={facing} moving={moving} spinTrigger={spinTrigger} />
          </div>
        </motion.button>
        
        {/* Glow Trail under the robot */}
        <motion.span 
          animate={{ scaleX: moving ? 1.4 : 0.8, scaleY: moving ? 1.2 : 0.8, opacity: moving ? 0.6 : 0.2 }} 
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-3 w-14 -translate-x-1/2 rounded-[100%] bg-primary blur-[6px] dark:bg-cyan-400" 
        />
      </motion.div>
    </div>
  );
}

function Action({ icon: Icon, label, onClick, primary = false }: { icon: typeof Code2; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className={`focus-ring inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[0.62rem] font-bold transition shadow-sm ${
        primary 
          ? "border-primary bg-primary text-white shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40" 
          : "border-slate-200/50 bg-white/50 text-slate-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-white/5 dark:bg-white/5 dark:text-blue-200/70 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </button>
  );
}
