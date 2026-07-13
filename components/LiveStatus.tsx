"use client";

import { useEffect, useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function LiveStatus() {
  const { language, t } = useLanguage();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat(language === "RU" ? "ru-RU" : language === "EN" ? "en-GB" : "uz-UZ", { timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, [language]);

  return <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-semibold">
    <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />{t("hero.available")}</span>
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/55"><Clock3 className="h-3.5 w-3.5 text-[#8aa0ff]" />{time || "--:--"}</span>
    <span className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/55 xl:inline-flex"><MapPin className="h-3.5 w-3.5 text-[#8aa0ff]" />Tashkent · UTC+5</span>
  </div>;
}
