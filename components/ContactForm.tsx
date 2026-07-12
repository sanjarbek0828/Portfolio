"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics";

type FormState = { name: string; email: string; projectType: string; budget: string; message: string };
const initialForm: FormState = { name: "", email: "", projectType: "Web application", budget: "$500 – $1,500", message: "" };

export function ContactForm() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState<FormState>(initialForm);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    try {
      await addDoc(collection(db, "messages"), { ...form, language, status: "unread", source: "portfolio", createdAt: serverTimestamp() });
      await trackEvent("contact_submit", { projectType: form.projectType, language });
      setForm(initialForm);
      setState("success");
    } catch {
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!response.ok) throw new Error();
        setState("success");
        setForm(initialForm);
      } catch {
        setState("error");
      }
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-xl backdrop-blur-xl dark:border-white/[0.09] dark:bg-white/[0.035] sm:p-5">
      <p className="mb-4 text-sm font-black text-slate-900 dark:text-white">{t("contact.formTitle")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={t("contact.name")} className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/25" />
        <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder={t("contact.email")} className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/25" />
        <select value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })} aria-label={t("contact.type")} className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-primary dark:border-white/[0.08] dark:bg-[#0b1020] dark:text-white/65"><option>Web application</option><option>Telegram bot</option><option>UI/UX design</option><option>Consulting</option></select>
        <select value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} aria-label={t("contact.budget")} className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-primary dark:border-white/[0.08] dark:bg-[#0b1020] dark:text-white/65"><option>$500 – $1,500</option><option>$1,500 – $3,000</option><option>$3,000+</option><option>Let’s discuss</option></select>
      </div>
      <textarea required minLength={20} maxLength={2000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={t("contact.message")} className="mt-3 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/25" />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`min-h-5 text-xs ${state === "error" ? "text-rose-500" : "text-emerald-500"}`}>{state === "success" ? <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />{t("contact.success")}</span> : state === "error" ? t("contact.error") : null}</p>
        <button type="submit" disabled={state === "sending"} className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-5 text-xs font-black text-white shadow-[0_0_24px_rgba(69,105,255,0.22)] disabled:opacity-60">{state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{state === "sending" ? t("contact.sending") : t("contact.send")}</button>
      </div>
    </form>
  );
}
