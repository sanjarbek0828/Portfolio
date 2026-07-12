"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "firebase/auth";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  ChevronRight,
  Command,
  LayoutDashboard,
  MessageSquare,
  ChartNoAxesCombined,
  Loader2,
  LogOut,
  Menu,
  Rocket,
  ShieldCheck,
  X,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";

const navItems = [
  { name: "Dashboard", description: "Umumiy ko‘rinish", href: "/admin", icon: LayoutDashboard },
  { name: "Loyihalar", description: "Portfolio ishlari", href: "/admin/projects", icon: BriefcaseBusiness },
  { name: "Sertifikatlar", description: "Yutuqlar va kurslar", href: "/admin/certificates", icon: Award },
  { name: "Xabarlar", description: "Kontakt inbox", href: "/admin/messages", icon: MessageSquare },
  { name: "Analytics", description: "Tashrif va konversiya", href: "/admin/analytics", icon: ChartNoAxesCombined },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") router.replace("/admin/login");
  }, [user, loading, router, pathname]);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020611] text-white">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_35px_rgba(102,133,255,0.22)]">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </span>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/40">Admin yuklanmoqda</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(69,105,255,0.13),transparent_30rem),radial-gradient(circle_at_92%_75%,rgba(0,212,255,0.07),transparent_28rem)]" />
      <div aria-hidden="true" className="grid-surface pointer-events-none fixed inset-0 opacity-[0.035]" />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            type="button"
            aria-label="Menyuni yopish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col border-r border-white/[0.07] bg-[#050916]/95 p-4 shadow-[20px_0_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-2">
          <Link href="/admin" className="focus-ring flex items-center gap-3 rounded-xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-gradient-to-br from-[#4569ff]/25 to-primary/5 font-black text-[#8aa0ff] shadow-[0_0_25px_rgba(69,105,255,0.18)]">S</span>
            <span>
              <span className="block text-sm font-black tracking-[-0.02em]">Sanjarbek<span className="text-primary">.</span></span>
              <span className="mt-0.5 block font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/35">Control center</span>
            </span>
          </Link>
          <button type="button" onClick={() => setMobileOpen(false)} className="focus-ring grid h-9 w-9 place-items-center rounded-xl text-white/45 transition hover:bg-white/[0.06] hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-3.5">
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </span>
            <span>
              <span className="block text-xs font-bold text-emerald-200">Xavfsiz sessiya</span>
              <span className="mt-0.5 block max-w-[175px] truncate text-[0.62rem] text-white/35">{user.email}</span>
            </span>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2" aria-label="Admin navigatsiyasi">
          <p className="mb-3 px-3 font-mono text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white/25">Boshqaruv</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`focus-ring group flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition ${active ? "border-primary/30 bg-primary/10 text-white shadow-[0_0_28px_rgba(69,105,255,0.1)]" : "border-transparent text-white/48 hover:border-white/[0.06] hover:bg-white/[0.035] hover:text-white"}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${active ? "bg-primary text-white shadow-[0_0_18px_rgba(69,105,255,0.3)]" : "bg-white/[0.045] text-white/50 group-hover:text-[#8aa0ff]"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="mt-0.5 block text-[0.62rem] text-white/28">{item.description}</span>
                </span>
                <ChevronRight className={`h-4 w-4 transition ${active ? "text-primary" : "text-white/15 group-hover:translate-x-0.5 group-hover:text-white/40"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/[0.07] pt-4">
          <Link href="/" target="_blank" className="focus-ring flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            Portfolio’ni ochish <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={handleLogout} className="focus-ring flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold text-rose-300/70 transition hover:bg-rose-400/[0.07] hover:text-rose-300">
            <LogOut className="h-4 w-4" /> Tizimdan chiqish
          </button>
        </div>
      </aside>

      <div className="relative lg:pl-[292px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#020611]/72 px-4 backdrop-blur-2xl sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/60 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.2em] text-primary">Admin workspace</p>
              <p className="mt-1 hidden text-xs text-white/35 sm:block">Kontent, loyihalar va yutuqlarni boshqaring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[0.62rem] text-white/35 md:flex">
              <Command className="h-3.5 w-3.5" /> Tezkor boshqaruv
            </span>
            <Link href="/admin/projects" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(69,105,255,0.22)] transition hover:-translate-y-0.5">
              <Rocket className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Yangi loyiha</span>
            </Link>
          </div>
        </header>

        <main id="main-content" className="min-h-[calc(100vh-5rem)] p-4 sm:p-7 lg:p-9">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1380px]">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
