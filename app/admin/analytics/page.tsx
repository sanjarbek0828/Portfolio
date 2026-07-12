"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Activity, BarChart3, Eye, Loader2, MessageSquare, MousePointerClick, TrendingUp } from "lucide-react";
import { db } from "@/lib/firebase";

type EventItem = { id: string; name: string; metadata?: Record<string, string | number>; createdAt?: { toDate?: () => Date } };

export default function AnalyticsPage() {
  const [views, setViews] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [viewDoc, eventDocs] = await Promise.all([
          getDoc(doc(db, "analytics", "views")),
          getDocs(query(collection(db, "analytics_events"), orderBy("createdAt", "desc"), limit(100))),
        ]);
        setViews(Number(viewDoc.data()?.count || 0));
        setEvents(eventDocs.docs.map((item) => ({ id: item.id, ...item.data() } as EventItem)));
      } finally { setLoading(false); }
    })();
  }, []);

  const totals = useMemo(() => ({
    contacts: events.filter((item) => item.name === "contact_submit").length,
    clicks: events.filter((item) => item.name === "hero_cta" || item.name === "project_click").length,
    pages: new Set(events.filter((item) => item.name === "page_view").map((item) => String(item.metadata?.path || "/"))).size,
  }), [events]);

  const pathCounts = useMemo(() => {
    const counts = new Map<string, number>();
    events.filter((item) => item.name === "page_view").forEach((item) => {
      const path = String(item.metadata?.path || "/");
      counts.set(path, (counts.get(path) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [events]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-7">
      <section><p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">Live analytics</p><h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Portfolio ko‘rsatkichlari.</h1><p className="mt-2 text-sm text-white/38">Tashriflar, konversiya va foydalanuvchi harakatlarining qisqa tahlili.</p></section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Eye} label="Jami tashrif" value={views.toLocaleString("uz-UZ")} tone="blue" />
        <Metric icon={MessageSquare} label="Kontakt so‘rovlari" value={String(totals.contacts)} tone="green" />
        <Metric icon={MousePointerClick} label="CTA bosishlari" value={String(totals.clicks)} tone="violet" />
        <Metric icon={BarChart3} label="Faol sahifalar" value={String(totals.pages)} tone="cyan" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="midnight-panel p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-primary">Top pages</p><h2 className="mt-2 text-lg font-black">Eng ko‘p ko‘rilgan</h2></div><TrendingUp className="h-5 w-5 text-emerald-400" /></div><div className="mt-6 space-y-4">{pathCounts.length ? pathCounts.map(([path, count]) => <div key={path}><div className="flex justify-between text-xs"><span className="font-semibold text-white/65">{path}</span><span className="text-white/30">{count}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-[#4569ff] to-primary" style={{ width: `${Math.max(8, count / Math.max(...pathCounts.map((item) => item[1])) * 100)}%` }} /></div></div>) : <p className="py-12 text-center text-xs text-white/30">Hali page-view ma’lumotlari yo‘q.</p>}</div></div>
        <div className="midnight-panel overflow-hidden"><div className="border-b border-white/[0.07] p-5 sm:p-6"><p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-primary">Event stream</p><h2 className="mt-2 text-lg font-black">So‘nggi harakatlar</h2></div><div className="max-h-[470px] divide-y divide-white/[0.055] overflow-y-auto">{events.length ? events.slice(0, 30).map((event) => <div key={event.id} className="flex items-center gap-4 p-4 sm:px-6"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Activity className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold text-white/65">{event.name.replaceAll("_", " ")}</p><p className="mt-1 truncate text-[0.6rem] text-white/27">{Object.entries(event.metadata || {}).map(([key, value]) => `${key}: ${value}`).join(" · ") || "Portfolio interaction"}</p></div><time className="shrink-0 text-[0.55rem] text-white/22">{event.createdAt?.toDate?.()?.toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" }) || "hozir"}</time></div>) : <p className="py-20 text-center text-xs text-white/30">Eventlar hali yozilmagan.</p>}</div></div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Eye; label: string; value: string; tone: "blue" | "green" | "violet" | "cyan" }) {
  const colors = { blue: "bg-blue-400/10 text-blue-300", green: "bg-emerald-400/10 text-emerald-300", violet: "bg-violet-400/10 text-violet-300", cyan: "bg-cyan-400/10 text-cyan-300" };
  return <div className="midnight-panel p-5"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${colors[tone]}`}><Icon className="h-5 w-5" /></span><p className="mt-5 text-3xl font-black tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs text-white/32">{label}</p></div>;
}
