"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { CheckCheck, Clock3, Loader2, Mail, MessageSquare, Search, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";

type InboxMessage = {
  id: string;
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message: string;
  status: "unread" | "read";
  language?: string;
  createdAt?: { toDate?: () => Date };
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<InboxMessage | null>(null);

  useEffect(() => {
    const inboxQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    return onSnapshot(inboxQuery, (snapshot) => {
      const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as InboxMessage));
      setMessages(data);
      setSelected((current) => current ? data.find((item) => item.id === current.id) || null : data[0] || null);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const filtered = useMemo(() => messages.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const haystack = `${item.name} ${item.email} ${item.projectType || ""} ${item.message}`.toLowerCase();
    return matchesFilter && haystack.includes(search.trim().toLowerCase());
  }), [messages, filter, search]);

  const openMessage = async (message: InboxMessage) => {
    setSelected(message);
    if (message.status === "unread") await updateDoc(doc(db, "messages", message.id), { status: "read" });
  };

  const remove = async (message: InboxMessage) => {
    if (!window.confirm(`${message.name} xabarini o‘chirasizmi?`)) return;
    await deleteDoc(doc(db, "messages", message.id));
  };

  const formatDate = (value?: InboxMessage["createdAt"]) => {
    const date = value?.toDate?.();
    return date ? new Intl.DateTimeFormat("uz-UZ", { dateStyle: "medium", timeStyle: "short" }).format(date) : "Hozirgina";
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">Contact inbox</p>
        <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">Mijozlar xabarlari.</h1><p className="mt-2 text-sm text-white/38">Portfolio kontakt formasidan kelgan murojaatlarni bir joyda boshqaring.</p></div>
          <span className="self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold text-[#9aabff]">{messages.filter((item) => item.status === "unread").length} yangi</span>
        </div>
      </section>

      <section className="midnight-panel overflow-hidden">
        <div className="grid min-h-[620px] lg:grid-cols-[390px_1fr]">
          <div className="border-b border-white/[0.07] lg:border-b-0 lg:border-r">
            <div className="space-y-3 border-b border-white/[0.07] p-4">
              <div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="admin-input pl-10" placeholder="Xabarlarni qidirish..." /></div>
              <div className="flex gap-1 rounded-xl bg-white/[0.025] p-1">{(["all", "unread", "read"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`flex-1 rounded-lg px-3 py-2 text-[0.62rem] font-bold transition ${filter === item ? "bg-primary text-white" : "text-white/35 hover:text-white"}`}>{item === "all" ? "Barchasi" : item === "unread" ? "Yangi" : "O‘qilgan"}</button>)}</div>
            </div>
            <div className="max-h-[490px] overflow-y-auto">
              {loading ? <div className="grid h-52 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : filtered.length ? filtered.map((message) => (
                <button key={message.id} type="button" onClick={() => openMessage(message)} className={`w-full border-b border-white/[0.055] p-4 text-left transition hover:bg-white/[0.035] ${selected?.id === message.id ? "bg-primary/[0.09]" : ""}`}>
                  <div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${message.status === "unread" ? "bg-primary shadow-[0_0_10px_#6685ff]" : "bg-white/15"}`} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{message.name}</strong><small className="shrink-0 text-[0.55rem] text-white/25">{formatDate(message.createdAt)}</small></span><span className="mt-1 block truncate text-xs text-white/35">{message.projectType || "Yangi loyiha"} · {message.budget || "Kelishiladi"}</span><span className="mt-2 block truncate text-xs text-white/25">{message.message}</span></span></div>
                </button>
              )) : <div className="grid h-52 place-items-center text-center"><div><MessageSquare className="mx-auto h-7 w-7 text-white/12" /><p className="mt-3 text-xs text-white/30">Xabar topilmadi</p></div></div>}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {selected ? <div className="mx-auto max-w-3xl">
              <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-start">
                <div><p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-primary">{selected.projectType || "Yangi loyiha"}</p><h2 className="mt-2 text-2xl font-black">{selected.name}</h2><a href={`mailto:${selected.email}`} className="mt-1 inline-block text-sm text-white/40 hover:text-primary">{selected.email}</a></div>
                <div className="flex gap-2"><a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.projectType || "Loyiha haqida")}`} className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white"><Mail className="h-4 w-4" /> Javob yozish</a><button type="button" onClick={() => updateDoc(doc(db, "messages", selected.id), { status: selected.status === "read" ? "unread" : "read" })} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] text-white/45 hover:text-white" title="Statusni almashtirish"><CheckCheck className="h-4 w-4" /></button><button type="button" onClick={() => remove(selected)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-rose-400/15 text-rose-300/55 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button></div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3"><Meta label="Budjet" value={selected.budget || "Kelishiladi"} /><Meta label="Til" value={selected.language || "UZ"} /><Meta label="Vaqt" value={formatDate(selected.createdAt)} icon={<Clock3 className="h-3 w-3" />} /></div>
              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7"><p className="whitespace-pre-wrap text-sm leading-7 text-white/65">{selected.message}</p></div>
            </div> : <div className="grid h-full min-h-80 place-items-center text-center"><div><MessageSquare className="mx-auto h-10 w-10 text-white/12" /><h2 className="mt-4 font-bold">Xabarni tanlang</h2><p className="mt-2 text-xs text-white/30">Batafsil ko‘rish uchun chap ro‘yxatdan xabarni oching.</p></div></div>}
          </div>
        </div>
      </section>
    </div>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[0.55rem] uppercase tracking-[0.14em] text-white/25">{label}</p><p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-white/60">{icon}{value}</p></div>;
}
