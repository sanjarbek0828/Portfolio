"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Download, FileText, Github, Languages, Mail, Moon, Search, Send, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, type Language } from "@/components/LanguageProvider";
import { profile } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";
import { useSound } from "@/hooks/useSound";

type CommandAction = { id: string; label: string; description: string; icon: typeof Search; keywords: string; run: () => void | Promise<void> };

const commandCopy = {
  UZ: { placeholder: "Bo‘lim yoki amalni qidiring...", empty: "Mos buyruq topilmadi", footer: "Tezkor portfolio boshqaruvi", copied: "Email nusxalandi", theme: "Rang rejimini almashtirish", language: "Tilni almashtirish", github: "GitHub profilini ochish", email: "Email manzilini nusxalash", resume: "CV yuklab olish", mail: "Email yozish" },
  RU: { placeholder: "Найдите раздел или действие...", empty: "Команда не найдена", footer: "Быстрое управление портфолио", copied: "Email скопирован", theme: "Сменить тему", language: "Сменить язык", github: "Открыть GitHub", email: "Скопировать email", resume: "Скачать CV", mail: "Написать письмо" },
  EN: { placeholder: "Search sections and actions...", empty: "No matching command", footer: "Quick portfolio controls", copied: "Email copied", theme: "Switch color theme", language: "Change language", github: "Open GitHub profile", email: "Copy email address", resume: "Download CV", mail: "Write an email" },
} as const;

export function CommandMenu() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { playClick, playHover } = useSound();
  
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const text = commandCopy[language];

  const close = useCallback(() => setOpen(false), []);
  const scrollTo = useCallback((href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("command_palette_action", { action: href, language });
    close();
  }, [close, language]);

  const actions = useMemo<CommandAction[]>(() => {
    const sectionActions = [
      ["about", t("nav.about"), "#about"], ["skills", t("nav.skills"), "#skills"], ["projects", t("nav.projects"), "#projects"], ["experience", t("nav.experience"), "#experience"], ["contact", t("nav.contact"), "#contact"],
    ].map(([id, label, href]) => ({ id, label, description: href, icon: FileText, keywords: `${label} section bo‘lim`, run: () => scrollTo(href) }));
    const nextLanguage: Language = language === "UZ" ? "RU" : language === "RU" ? "EN" : "UZ";
    return [
      ...sectionActions,
      { id: "copy-email", label: text.email, description: copied ? text.copied : profile.email, icon: copied ? Check : Mail, keywords: "email mail copy aloqa", run: async () => { await navigator.clipboard.writeText(profile.email); setCopied(true); trackEvent("command_palette_action", { action: "copy_email", language }); window.setTimeout(close, 650); } },
      { id: "write-email", label: text.mail, description: profile.email, icon: Send, keywords: "email send xat contact", run: () => { window.location.href = `mailto:${profile.email}`; close(); } },
      { id: "resume", label: text.resume, description: "PDF · CV · Resume", icon: Download, keywords: "cv resume download yuklash", run: () => { window.open(profile.resume, "_blank", "noopener,noreferrer"); trackEvent("command_palette_action", { action: "resume", language }); close(); } },
      { id: "github", label: text.github, description: "github.com/sanjarbek404", icon: Github, keywords: "github source code repository", run: () => { window.open("https://github.com/sanjarbek404", "_blank", "noopener,noreferrer"); trackEvent("command_palette_action", { action: "github", language }); close(); } },
      { id: "theme", label: text.theme, description: resolvedTheme === "dark" ? "Dark → Light" : "Light → Dark", icon: resolvedTheme === "dark" ? Sun : Moon, keywords: "theme dark light rang rejim", run: () => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); trackEvent("command_palette_action", { action: "theme", language }); close(); } },
      { id: "language", label: text.language, description: `${language} → ${nextLanguage}`, icon: Languages, keywords: "language til язык uz ru en", run: () => { setLanguage(nextLanguage); trackEvent("command_palette_action", { action: "language", language: nextLanguage }); close(); } },
    ];
  }, [close, copied, language, resolvedTheme, scrollTo, setLanguage, setTheme, t, text]);

  const filtered = actions.filter((action) => `${action.label} ${action.description} ${action.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { 
        event.preventDefault(); 
        setOpen((current) => {
          if (!current) playClick();
          return !current;
        }); 
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => {
      playClick();
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("portfolio:open-command", onOpen);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("portfolio:open-command", onOpen); };
  }, [playClick]);

  useEffect(() => {
    setSelected(0);
    if (!open) { setQuery(""); setCopied(false); document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 70);
    return () => { window.clearTimeout(timer); document.body.style.overflow = ""; };
  }, [open]);

  return <AnimatePresence>{open ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }} className="fixed inset-0 z-[100] flex items-start justify-center bg-[#020611]/72 px-4 pt-[12vh] backdrop-blur-xl">
    <motion.div role="dialog" aria-modal="true" aria-label="Portfolio command palette" initial={{ opacity: 0, y: -18, scale: 0.965 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.975 }} transition={{ type: "spring", stiffness: 360, damping: 28 }} className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-white/95 text-slate-900 shadow-[0_35px_120px_rgba(0,0,0,0.6)] dark:bg-[#07101f]/96 dark:text-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 dark:border-white/[0.07]"><Search className="h-5 w-5 text-primary" /><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setSelected((value) => Math.min(filtered.length - 1, value + 1)); playHover(); } if (event.key === "ArrowUp") { event.preventDefault(); setSelected((value) => Math.max(0, value - 1)); playHover(); } if (event.key === "Enter" && filtered[selected]) { event.preventDefault(); playClick(); filtered[selected].run(); } }} placeholder={text.placeholder} className="h-17 flex-1 bg-transparent py-5 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/25" /><kbd className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[0.58rem] text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/35">ESC</kbd></div>
      <div className="max-h-[430px] overflow-y-auto p-2">{filtered.map((action, index) => { const Icon = action.icon; return <button key={action.id} type="button" onMouseEnter={() => { setSelected(index); playHover(); }} onClick={() => { playClick(); action.run(); }} className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${selected === index ? "bg-primary/10" : "hover:bg-slate-100 dark:hover:bg-white/[0.035]"}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${selected === index ? "border-primary/30 bg-primary/10 text-primary" : "border-slate-200 text-slate-400 dark:border-white/[0.07] dark:text-white/35"}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{action.label}</span><span className="mt-0.5 block truncate text-xs text-slate-400 dark:text-white/30">{action.description}</span></span><ArrowRight className={`h-4 w-4 transition ${selected === index ? "translate-x-1 text-primary" : "text-slate-300 dark:text-white/15"}`} /></button>; })}{!filtered.length ? <p className="px-4 py-14 text-center text-sm text-slate-400 dark:text-white/30">{text.empty}</p> : null}</div>
      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-[0.6rem] text-slate-400 dark:border-white/[0.07] dark:text-white/25"><span>{text.footer}</span><span>↑↓ · Enter · Ctrl/⌘ K</span></div>
    </motion.div>
  </motion.div> : null}</AnimatePresence>;
}
