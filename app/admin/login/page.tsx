"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/lib/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch {
      setError("Email yoki parol noto‘g‘ri. Ma’lumotlarni tekshirib qayta urinib ko‘ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-[#020611] text-white">
      <Image src="/images/hero-anime-bg.png" alt="" fill priority sizes="100vw" className="object-cover object-[68%_center] opacity-55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,17,0.99)_0%,rgba(2,6,17,0.94)_45%,rgba(2,6,17,0.45)_100%)]" />
      <div className="grid-surface absolute inset-0 opacity-[0.04]" />
      <div className="absolute left-4 top-4 z-20 sm:left-8 sm:top-8">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#050916]/60 px-4 py-2.5 text-xs font-bold text-white/55 backdrop-blur-xl transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Portfolio’ga qaytish
        </Link>
      </div>

      <div className="container relative z-10 grid min-h-screen items-center py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="w-full max-w-md rounded-[2rem] border border-white/[0.1] bg-[#050916]/78 p-6 shadow-[0_35px_100px_-35px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-[#8aa0ff] shadow-[0_0_28px_rgba(69,105,255,0.18)]"><LockKeyhole className="h-5 w-5" /></span>
            <span className="flex items-center gap-2 rounded-full bg-emerald-400/[0.07] px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Secure access</span>
          </div>
          <p className="mt-8 font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">Admin control center</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.045em]">Boshqaruv paneliga kirish.</h1>
          <p className="mt-3 text-sm leading-6 text-white/38">Portfolio ma’lumotlarini xavfsiz boshqarish uchun administrator hisobingizdan foydalaning.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-xs font-bold text-white/55">Email manzil</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input id="admin-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="admin-input h-12 pl-10" placeholder="admin@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-bold text-white/55">Parol</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input id="admin-password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input h-12 px-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"} className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white/60">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? <p role="alert" className="rounded-xl border border-rose-400/15 bg-rose-400/[0.065] px-3.5 py-3 text-xs leading-5 text-rose-200">{error}</p> : null}

            <button type="submit" disabled={loading} className="focus-ring group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] text-sm font-black text-white shadow-[0_0_28px_rgba(69,105,255,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(69,105,255,0.4)] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Tizimga kirish <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>}
            </button>
          </form>

          <p className="mt-7 text-center text-[0.6rem] text-white/22">Firebase Authentication orqali himoyalangan</p>
        </motion.section>

        <div className="hidden justify-self-end lg:block">
          <div className="max-w-sm text-right">
            <Sparkles className="ml-auto h-7 w-7 text-[#8aa0ff]" />
            <p className="mt-5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8aa0ff]">Build · Manage · Grow</p>
            <p className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em]">G‘oyalaringizni boshqaring. Natijalarni tezlashtiring.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
