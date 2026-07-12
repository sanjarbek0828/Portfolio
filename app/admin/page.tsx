"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Eye,
  FileText,
  Github,
  Plus,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { certificates as staticCertificates, projects as staticProjects } from "@/lib/portfolio-data";

type DashboardStats = {
  projects: number;
  certificates: number;
  views: number;
  source: "firebase" | "local";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: staticProjects.length,
    certificates: staticCertificates.length,
    views: 0,
    source: "local",
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const [projectsSnap, certificatesSnap, viewsDoc] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "certificates")),
        getDoc(doc(db, "analytics", "views")),
      ]);

      setStats({
        projects: projectsSnap.empty ? staticProjects.length : projectsSnap.size,
        certificates: certificatesSnap.empty ? staticCertificates.length : certificatesSnap.size,
        views: viewsDoc.exists() && typeof viewsDoc.data().count === "number" ? viewsDoc.data().count : 0,
        source: projectsSnap.empty && certificatesSnap.empty ? "local" : "firebase",
      });
    } catch {
      setStats((current) => ({ ...current, source: "local" }));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: "Jami tashriflar", value: stats.views.toLocaleString("uz-UZ"), icon: Users, color: "from-sky-500/20 to-blue-500/5", iconColor: "text-sky-300", note: "Analytics kuzatuvi" },
    { label: "Faol loyihalar", value: stats.projects, icon: BriefcaseBusiness, color: "from-[#4569ff]/25 to-[#4569ff]/5", iconColor: "text-[#8aa0ff]", note: "Portfolio katalogi" },
    { label: "Sertifikatlar", value: stats.certificates, icon: Award, color: "from-amber-400/20 to-orange-500/5", iconColor: "text-amber-300", note: "Tasdiqlangan yutuqlar" },
    { label: "Kontent holati", value: "100%", icon: CircleGauge, color: "from-emerald-400/20 to-emerald-500/5", iconColor: "text-emerald-300", note: "Barcha bo‘limlar faol" },
  ];

  const quickActions = [
    { title: "Yangi loyiha", description: "Portfolio katalogiga yangi ish qo‘shing", href: "/admin/projects", icon: Plus, tone: "text-[#8aa0ff] bg-[#4569ff]/10" },
    { title: "Sertifikat qo‘shish", description: "Yangi yutuq yoki kursni kiriting", href: "/admin/certificates", icon: Award, tone: "text-amber-300 bg-amber-400/10" },
    { title: "Portfolio preview", description: "Saytning jonli ko‘rinishini tekshiring", href: "/", icon: Eye, tone: "text-cyan-300 bg-cyan-400/10", external: true },
  ];

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">
            <Radio className="h-3.5 w-3.5" /> Live dashboard
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Xush kelibsiz, Sanjarbek.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/42">Portfolio kontenti, loyiha statistikasi va tizim holatini bitta markazdan boshqaring.</p>
        </div>
        <button type="button" onClick={fetchStats} disabled={refreshing} className="focus-ring inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-xs font-bold text-white/60 transition hover:border-primary/30 hover:text-white disabled:opacity-50 md:self-auto">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Ma’lumotlarni yangilash
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="midnight-panel group p-5 sm:p-6">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-70`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.045] ${card.iconColor}`}><Icon className="h-5 w-5" /></span>
                  <BarChart3 className="h-4 w-4 text-white/15 transition group-hover:text-primary/60" />
                </div>
                <p className="mt-7 text-3xl font-black tracking-[-0.04em]">{card.value}</p>
                <p className="mt-1 text-xs font-bold text-white/68">{card.label}</p>
                <p className="mt-3 text-[0.62rem] text-white/28">{card.note}</p>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="midnight-panel p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary">Quick actions</p>
              <h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Tezkor boshqaruv</h2>
            </div>
            <Sparkles className="h-5 w-5 text-primary/60" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} target={action.external ? "_blank" : undefined} className="focus-ring group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.045]">
                  <div className="flex items-start justify-between">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${action.tone}`}><Icon className="h-4 w-4" /></span>
                    <ArrowUpRight className="h-4 w-4 text-white/18 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-5 text-sm font-bold">{action.title}</h3>
                  <p className="mt-2 text-[0.67rem] leading-5 text-white/30">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="midnight-panel p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-300">System health</p>
              <h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Tizim holati</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[0.6rem] font-bold text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Operational</span>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { name: "Firebase ulanishi", status: stats.source === "firebase" ? "Sinxron" : "Local fallback", icon: ShieldCheck },
              { name: "Portfolio kontenti", status: "Faol", icon: FileText },
              { name: "Build holati", status: "Production ready", icon: CheckCircle2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/[0.07] text-emerald-300"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold">{item.name}</span><span className="mt-0.5 block text-[0.6rem] text-white/28">{item.status}</span></span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.65fr_0.35fr]">
        <div className="midnight-panel p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Activity className="h-4 w-4" /></span>
            <div><h2 className="text-sm font-black">Kontent faolligi</h2><p className="mt-0.5 text-[0.62rem] text-white/28">Portfolio tarkibining joriy holati</p></div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: "Loyihalar", value: stats.projects, total: Math.max(stats.projects, 7), color: "bg-[#6685ff]" },
              { label: "Sertifikatlar", value: stats.certificates, total: Math.max(stats.certificates, 11), color: "bg-amber-400" },
              { label: "Profil ma’lumotlari", value: 8, total: 8, color: "bg-emerald-400" },
            ].map((item) => {
              const progress = Math.min(100, Math.round((item.value / item.total) * 100));
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs"><span className="font-semibold text-white/55">{item.label}</span><span className="font-mono text-[0.6rem] text-white/28">{item.value}/{item.total}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.055]"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${item.color}`} /></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="midnight-panel flex flex-col justify-between p-5 sm:p-7">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-white/50"><Clock3 className="h-4 w-4" /></span>
            <p className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/25">Oxirgi tekshiruv</p>
            <p className="mt-2 text-lg font-black">Hozirgina</p>
          </div>
          <a href="https://github.com/sanjarbek404" target="_blank" rel="noreferrer" className="focus-ring mt-7 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs font-bold text-white/50 transition hover:text-white">
            <span className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</span><ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
