"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { Award, ExternalLink, Image as ImageIcon, Loader2, Pencil, Plus, Search, Trash2, UploadCloud, X } from "lucide-react";

import { db } from "@/lib/firebase";
import { certificates as staticCertificates } from "@/lib/portfolio-data";

type Certificate = (typeof staticCertificates)[number];
type AdminCertificate = Certificate & { id: string; source: "firebase" | "local" };
type CertificateForm = { title: string; issuer: string; year: string; href: string; image: string };

const emptyForm = (): CertificateForm => ({ title: "", issuer: "", year: new Date().getFullYear().toString(), href: "", image: "" });

const normalizeCertificate = (data: Partial<Certificate>, id: string, source: AdminCertificate["source"]): AdminCertificate => ({
  id,
  source,
  title: data.title || "Nomsiz sertifikat",
  issuer: data.issuer || "Noma’lum tashkilot",
  year: data.year || new Date().getFullYear().toString(),
  href: data.href || "",
  image: data.image || "",
});

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<AdminCertificate | null>(null);
  const [form, setForm] = useState<CertificateForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "certificates"));
      setCertificates(snapshot.empty
        ? staticCertificates.map((certificate, index) => normalizeCertificate(certificate, `local-${index}`, "local"))
        : snapshot.docs.map((certificateDoc) => normalizeCertificate(certificateDoc.data() as Partial<Certificate>, certificateDoc.id, "firebase")));
    } catch {
      setCertificates(staticCertificates.map((certificate, index) => normalizeCertificate(certificate, `local-${index}`, "local")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCertificates(); }, []);
  useEffect(() => () => { if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return certificates.filter((certificate) => `${certificate.title} ${certificate.issuer} ${certificate.year}`.toLowerCase().includes(normalizedQuery));
  }, [certificates, query]);

  const openCreate = () => {
    setEditingCertificate(null);
    setForm(emptyForm());
    setImageFile(null);
    setImagePreview(null);
    setNotice("");
    setModalOpen(true);
  };

  const openEdit = (certificate: AdminCertificate) => {
    setEditingCertificate(certificate);
    setForm({ title: certificate.title, issuer: certificate.issuer, year: certificate.year, href: certificate.href, image: certificate.image });
    setImageFile(null);
    setImagePreview(certificate.image || null);
    setNotice(certificate.source === "local" ? "Bu lokal ma’lumot. Saqlaganda Firebase’ga yangi nusxa yaratiladi." : "");
    setModalOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setNotice("Rasm hajmi 8MB dan kichik bo‘lishi kerak."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("NEXT_PUBLIC_IMGBB_API_KEY sozlanmagan.");
    const payload = new FormData();
    payload.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: payload });
    const result = await response.json() as { success?: boolean; data?: { url?: string }; error?: { message?: string } };
    if (!response.ok || !result.success || !result.data?.url) throw new Error(result.error?.message || "Rasm yuklanmadi.");
    return result.data.url;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const payload: Certificate = { ...form, image: imageFile ? await uploadImage(imageFile) : form.image };
      if (editingCertificate?.source === "firebase") await updateDoc(doc(db, "certificates", editingCertificate.id), payload);
      else await addDoc(collection(db, "certificates"), payload);
      setModalOpen(false);
      await fetchCertificates();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Saqlashda xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (certificate: AdminCertificate) => {
    if (certificate.source === "local") { setNotice("Lokal sertifikatni o‘chirish uchun lib/portfolio-data.ts faylini tahrirlang."); return; }
    if (!window.confirm(`“${certificate.title}” sertifikatini o‘chirmoqchimisiz?`)) return;
    await deleteDoc(doc(db, "certificates", certificate.id));
    await fetchCertificates();
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">Achievement manager</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Sertifikatlarni boshqarish.</h1>
          <p className="mt-2 text-sm text-white/38">Yutuqlarni qidiring, preview qiling va yangi sertifikatlarni joylang.</p>
        </div>
        <button type="button" onClick={openCreate} className="focus-ring inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-5 text-xs font-black text-white shadow-[0_0_28px_rgba(69,105,255,0.24)] transition hover:-translate-y-0.5 md:self-auto"><Plus className="h-4 w-4" /> Yangi sertifikat</button>
      </section>

      <section className="midnight-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-input h-11 border-0 bg-transparent pl-10 focus:ring-0" placeholder="Sertifikat, tashkilot yoki yilni qidiring..." /></div>
        <span className="px-3 text-[0.65rem] text-white/30">{filteredCertificates.length} ta natija</span>
      </section>

      {notice && !modalOpen ? <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.055] px-4 py-3 text-xs text-amber-100/70">{notice}</p> : null}

      {loading ? <div className="grid min-h-72 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : filteredCertificates.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCertificates.map((certificate) => (
            <article key={certificate.id} className="midnight-panel group p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.03]">
                {certificate.image ? <Image src={certificate.image} alt={certificate.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition duration-700 group-hover:scale-[1.035]" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-9 w-9 text-white/15" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/85 via-transparent to-transparent" />
                <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1.5 text-[0.52rem] font-bold uppercase tracking-[0.12em] backdrop-blur-xl ${certificate.source === "firebase" ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-300/15 text-amber-100"}`}>{certificate.source}</span>
                <div className="absolute inset-x-4 bottom-4"><p className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-amber-300">{certificate.issuer} · {certificate.year}</p></div>
              </div>
              <div className="p-3 pb-2 pt-5">
                <h2 className="line-clamp-2 min-h-12 text-base font-black leading-6 tracking-[-0.025em]">{certificate.title}</h2>
                <div className="mt-5 grid grid-cols-[1fr_1fr_auto] gap-2">
                  <button type="button" onClick={() => openEdit(certificate)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-2 py-2.5 text-[0.6rem] font-bold text-white/50 transition hover:text-white"><Pencil className="h-3.5 w-3.5" /> Tahrirlash</button>
                  {certificate.href ? <a href={certificate.href} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-2 py-2.5 text-[0.6rem] font-bold text-white/50 transition hover:text-white"><ExternalLink className="h-3.5 w-3.5" /> Preview</a> : <span />}
                  <button type="button" onClick={() => handleDelete(certificate)} aria-label={`${certificate.title} sertifikatini o‘chirish`} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-rose-400/10 bg-rose-400/[0.055] text-rose-300/55 transition hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : <div className="midnight-panel grid min-h-72 place-items-center p-8 text-center"><div><Award className="mx-auto h-9 w-9 text-white/15" /><h2 className="mt-4 font-bold">Sertifikat topilmadi</h2><p className="mt-2 text-xs text-white/30">Qidiruv so‘rovini o‘zgartirib ko‘ring.</p></div></div>}

      {modalOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-3 backdrop-blur-xl sm:p-6">
          <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#070b18] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7"><div><p className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-primary">Certificate editor</p><h2 className="mt-1 text-lg font-black">{editingCertificate ? "Sertifikatni tahrirlash" : "Yangi sertifikat yaratish"}</h2></div><button type="button" onClick={() => setModalOpen(false)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-white/40 transition hover:text-white"><X className="h-5 w-5" /></button></div>
            <form onSubmit={handleSubmit} className="grid gap-6 p-5 sm:p-7 md:grid-cols-[0.72fr_1.28fr]">
              <label className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.025]">
                {imagePreview ? <Image src={imagePreview} alt="Sertifikat preview" fill unoptimized={imagePreview.startsWith("blob:")} sizes="320px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-center"><span><UploadCloud className="mx-auto h-8 w-8 text-primary/55" /><span className="mt-3 block text-xs font-bold text-white/48">Rasm tanlash</span></span></span>}
                <span className="absolute inset-0 grid place-items-center bg-[#020611]/55 opacity-0 transition group-hover:opacity-100"><UploadCloud className="h-7 w-7" /></span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
              </label>
              <div className="space-y-4">
                <Field label="Sertifikat nomi"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="admin-input" /></Field>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Tashkilot"><input required value={form.issuer} onChange={(event) => setForm({ ...form, issuer: event.target.value })} className="admin-input" /></Field><Field label="Yil"><input required value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} className="admin-input" /></Field></div>
                <Field label="Sertifikat havolasi"><input type="url" value={form.href} onChange={(event) => setForm({ ...form, href: event.target.value })} className="admin-input" /></Field>
                <Field label="Rasm URL"><input value={form.image} onChange={(event) => { setForm({ ...form, image: event.target.value }); if (!imageFile) setImagePreview(event.target.value || null); }} className="admin-input" /></Field>
                {notice ? <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.055] px-3.5 py-3 text-xs text-amber-100/70">{notice}</p> : null}
                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalOpen(false)} className="focus-ring h-11 rounded-xl border border-white/[0.08] px-5 text-xs font-bold text-white/45">Bekor qilish</button><button type="submit" disabled={saving} className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-6 text-xs font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editingCertificate ? "Saqlash" : "Sertifikat yaratish"}</button></div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="mb-2 block text-xs font-bold text-white/52">{label}</span>{children}</label>;
}
