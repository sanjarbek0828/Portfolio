"use client";

import { Languages } from "lucide-react";
import { type Language, useLanguage } from "@/components/LanguageProvider";

const languages: Language[] = ["UZ", "RU", "EN"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex h-10 items-center rounded-full border border-white/[0.1] bg-white/[0.055] p-1" aria-label="Tilni tanlash">
      <Languages className="mx-1.5 h-3.5 w-3.5 text-white/35" />
      {languages.map((item) => (
        <button key={item} type="button" onClick={() => setLanguage(item)} aria-pressed={language === item} className={`focus-ring rounded-full px-2 py-1.5 font-mono text-[0.55rem] font-bold transition ${language === item ? "bg-[#657cff] text-white shadow-[0_0_14px_rgba(101,124,255,0.35)]" : "text-white/35 hover:text-white"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}
