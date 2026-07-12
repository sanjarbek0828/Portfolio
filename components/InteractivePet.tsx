"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { ArrowUp, BriefcaseBusiness, Code2, Download, Grip, Mail, Sparkles, UserRound, Wrench, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { profile } from "@/lib/portfolio-data";
import Byte3D from "./Byte3D";
const PET_WIDTH = 96;
const PET_HEIGHT = 106;

const copy = {
  UZ: { greeting: "Salom! Men Byte — portfolio yordamchisiman.", hint: "Meni ushlab istalgan joyga ko‘chiring yoki kerakli bo‘limni tanlang.", about: "Men haqimda", skills: "Ko‘nikmalar", projects: "Loyihalar", contact: "Bog‘lanish", resume: "CV yuklash", top: "Yuqoriga", drag: "Ko‘chirish uchun ushlang" },
  RU: { greeting: "Привет! Я Byte — помощник портфолио.", hint: "Перетащите меня в удобное место или выберите нужный раздел.", about: "Обо мне", skills: "Навыки", projects: "Проекты", contact: "Связаться", resume: "Скачать CV", top: "Наверх", drag: "Удерживайте для перемещения" },
  EN: { greeting: "Hi! I’m Byte, your portfolio companion.", hint: "Drag me anywhere or choose where you would like to go.", about: "About me", skills: "Skills", projects: "Projects", contact: "Contact", resume: "Download CV", top: "Back to top", drag: "Hold and drag to move" },
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
  const text = copy[language];

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

  const navigate = (href: string) => {
    setOpen(false);
    if (href === "#home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        onDragStart={() => { draggedRef.current = true; setMoving(true); setOpen(false); }}
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
        <AnimatePresence>
          {open ? (
            <motion.aside initial={{ opacity: 0, y: 10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute bottom-[7.3rem] right-0 w-[19rem] cursor-default rounded-3xl border border-slate-200/80 bg-white/95 p-4 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl dark:border-white/[0.1] dark:bg-[#07101f]/95 dark:text-white">
              <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-black">{text.greeting}</p><p className="mt-1 text-[0.65rem] leading-5 text-slate-500 dark:text-white/42">{text.hint}</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Yordamchini yopish" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"><X className="h-3.5 w-3.5" /></button></div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Action icon={UserRound} label={text.about} onClick={() => navigate("#about")} />
                <Action icon={Wrench} label={text.skills} onClick={() => navigate("#skills")} />
                <Action icon={BriefcaseBusiness} label={text.projects} onClick={() => navigate("#projects")} />
                <Action icon={Mail} label={text.contact} onClick={() => navigate("#contact")} primary />
                <a href={profile.resume} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[0.62rem] font-bold text-slate-600 transition hover:border-primary/30 hover:text-primary dark:border-white/[0.07] dark:text-white/48"><Download className="h-3.5 w-3.5" />{text.resume}</a>
                <Action icon={ArrowUp} label={text.top} onClick={() => navigate("#home")} />
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 text-[0.58rem] text-slate-500 dark:bg-white/[0.035] dark:text-white/30"><Grip className="h-3.5 w-3.5 text-primary" />{text.drag}</div>
              <span className="absolute -bottom-1.5 right-10 h-3 w-3 rotate-45 border-b border-r border-slate-200/80 bg-white dark:border-white/[0.1] dark:bg-[#07101f]" />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => { if (!draggedRef.current) setOpen((value) => !value); }}
          onDoubleClick={() => navigate("#home")}
          aria-label="Byte portfolio yordamchisini ochish"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          className="relative block h-full w-full border-0 bg-transparent p-0 outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="absolute inset-0">
            <Byte3D facing={facing} moving={moving} />
          </div>
        </motion.button>
        <motion.span animate={{ scaleX: moving ? 1.2 : 0.82, opacity: moving ? 0.28 : 0.16 }} className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-2 w-12 -translate-x-1/2 rounded-full bg-black blur-[3px] dark:bg-blue-300" />
      </motion.div>
    </div>
  );
}

function Action({ icon: Icon, label, onClick, primary = false }: { icon: typeof Code2; label: string; onClick: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`focus-ring inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[0.62rem] font-bold transition ${primary ? "border-primary bg-primary text-white" : "border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary dark:border-white/[0.07] dark:text-white/48"}`}><Icon className="h-3.5 w-3.5 shrink-0" />{label}</button>;
}
