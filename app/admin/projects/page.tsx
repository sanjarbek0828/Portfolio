"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { projects as staticProjects, type Project, type ProjectCategory } from "@/lib/portfolio-data";

type AdminProject = Project & { id: string; source: "firebase" | "local" };

type ProjectForm = {
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  stack: string;
  year: string;
  github: string;
  live: string;
  image: string;
  metric: string;
  role: string;
  challenge: string;
  solution: string;
  outcomes: string;
};

const categories: Array<"Barchasi" | ProjectCategory> = ["Barchasi", "Web ilova", "PWA ilova", "Telegram bot"];

const emptyForm = (): ProjectForm => ({
  title: "",
  slug: "",
  description: "",
  category: "Web ilova",
  stack: "",
  year: new Date().getFullYear().toString(),
  github: "",
  live: "",
  image: "",
  metric: "",
  role: "Full-stack development",
  challenge: "",
  solution: "",
  outcomes: "",
});

const normalizeProject = (data: Partial<Project>, id: string, source: AdminProject["source"]): AdminProject => ({
  id,
  source,
  slug: data.slug || id,
  title: data.title || "Nomsiz loyiha",
  description: data.description || "",
  category: data.category || "Web ilova",
  stack: Array.isArray(data.stack) ? data.stack : [],
  accent: data.accent || "from-[#4569ff] via-[#657cff] to-cyan-500",
  metric: data.metric || "Digital product",
  year: data.year || new Date().getFullYear().toString(),
  role: data.role || "Full-stack development",
  challenge: data.challenge || "Loyiha muammosi kiritilmagan.",
  solution: data.solution || "Loyiha yechimi kiritilmagan.",
  outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
  github: data.github || "",
  live: data.live || "",
  image: data.image || "",
});

export default function AdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Barchasi");
  const [notice, setNotice] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      if (snapshot.empty) {
        setProjects(staticProjects.map((project) => normalizeProject(project, `local-${project.slug}`, "local")));
      } else {
        setProjects(snapshot.docs.map((projectDoc) => normalizeProject(projectDoc.data() as Partial<Project>, projectDoc.id, "firebase")));
      }
    } catch {
      setProjects(staticProjects.map((project) => normalizeProject(project, `local-${project.slug}`, "local")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "Barchasi" || project.category === category;
      const searchable = `${project.title} ${project.description} ${project.stack.join(" ")}`.toLowerCase();
      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [projects, query, category]);

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyForm());
    setImageFile(null);
    setImagePreview(null);
    setNotice("");
    setModalOpen(true);
  };

  const openEdit = (project: AdminProject) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      stack: project.stack.join(", "),
      year: project.year,
      github: project.github,
      live: project.live,
      image: project.image,
      metric: project.metric,
      role: project.role,
      challenge: project.challenge,
      solution: project.solution,
      outcomes: project.outcomes.join(", "),
    });
    setImageFile(null);
    setImagePreview(project.image || null);
    setNotice(project.source === "local" ? "Bu lokal ma’lumot. Saqlaganda Firebase’ga yangi nusxa yaratiladi." : "");
    setModalOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setNotice("Rasm hajmi 8MB dan kichik bo‘lishi kerak.");
      return;
    }
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
      const image = imageFile ? await uploadImage(imageFile) : form.image;
      const payload: Omit<Project, "accent"> & { accent: string } = {
        slug: form.slug.trim() || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        stack: form.stack.split(",").map((item) => item.trim()).filter(Boolean),
        accent: "from-[#4569ff] via-[#657cff] to-cyan-500",
        metric: form.metric.trim() || "Digital product",
        year: form.year,
        role: form.role.trim(),
        challenge: form.challenge.trim(),
        solution: form.solution.trim(),
        outcomes: form.outcomes.split(",").map((item) => item.trim()).filter(Boolean),
        github: form.github.trim(),
        live: form.live.trim(),
        image,
      };

      if (editingProject?.source === "firebase") await updateDoc(doc(db, "projects", editingProject.id), payload);
      else await addDoc(collection(db, "projects"), payload);

      setModalOpen(false);
      await fetchProjects();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Saqlashda xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: AdminProject) => {
    if (project.source === "local") {
      setNotice("Lokal loyihani o‘chirish uchun lib/portfolio-data.ts faylini tahrirlang.");
      return;
    }
    if (!window.confirm(`“${project.title}” loyihasini o‘chirmoqchimisiz?`)) return;
    await deleteDoc(doc(db, "projects", project.id));
    await fetchProjects();
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">Portfolio manager</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Loyihalarni boshqarish.</h1>
          <p className="mt-2 text-sm text-white/38">Loyihalarni qidiring, filtrlang, preview qiling va to‘liq case study ma’lumotlarini tahrirlang.</p>
        </div>
        <button type="button" onClick={openCreate} className="focus-ring inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-5 text-xs font-black text-white shadow-[0_0_28px_rgba(69,105,255,0.24)] transition hover:-translate-y-0.5 md:self-auto">
          <Plus className="h-4 w-4" /> Yangi loyiha
        </button>
      </section>

      <section className="midnight-panel p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Loyiha yoki texnologiyani qidiring..." className="admin-input h-11 border-0 bg-transparent pl-10 focus:ring-0" />
          </div>
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`focus-ring shrink-0 rounded-lg px-3.5 py-2 text-[0.65rem] font-bold transition ${category === item ? "bg-primary text-white shadow-[0_0_18px_rgba(69,105,255,0.25)]" : "text-white/38 hover:text-white"}`}>
                {item}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-2 px-3 text-[0.65rem] text-white/30"><Filter className="h-3.5 w-3.5" /> {filteredProjects.length} ta natija</span>
        </div>
      </section>

      {notice && !modalOpen ? <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.055] px-4 py-3 text-xs text-amber-100/70">{notice}</p> : null}

      {loading ? (
        <div className="grid min-h-72 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : filteredProjects.length ? (
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article key={project.id} className="midnight-panel group p-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/[0.03]">
                {project.image ? <Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover transition duration-700 group-hover:scale-[1.025]" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-9 w-9 text-white/15" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/80 via-transparent to-transparent" />
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-[#020611]/65 px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.13em] text-white/65 backdrop-blur-xl">{project.category}</span>
                  <span className={`rounded-full px-2.5 py-1.5 text-[0.52rem] font-bold uppercase tracking-[0.12em] backdrop-blur-xl ${project.source === "firebase" ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-300/15 text-amber-100"}`}>{project.source}</span>
                </div>
              </div>
              <div className="p-3 pb-2 pt-5">
                <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-primary">{project.metric}</p><h2 className="mt-2 text-xl font-black tracking-[-0.03em]">{project.title}</h2></div><span className="text-[0.62rem] text-white/25">{project.year}</span></div>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/38">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{project.stack.slice(0, 4).map((tech) => <span key={tech} className="rounded-lg bg-white/[0.04] px-2 py-1 text-[0.55rem] text-white/40">{tech}</span>)}</div>
                <div className="mt-5 grid grid-cols-[1fr_1fr_auto] gap-2">
                  <button type="button" onClick={() => openEdit(project)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2.5 text-[0.62rem] font-bold text-white/55 transition hover:border-primary/25 hover:text-white"><Pencil className="h-3.5 w-3.5" /> Tahrirlash</button>
                  {project.live ? <a href={project.live} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2.5 text-[0.62rem] font-bold text-white/55 transition hover:border-primary/25 hover:text-white"><ExternalLink className="h-3.5 w-3.5" /> Preview</a> : <span />}
                  <button type="button" onClick={() => handleDelete(project)} aria-label={`${project.title} loyihasini o‘chirish`} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-rose-400/10 bg-rose-400/[0.055] text-rose-300/55 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="midnight-panel grid min-h-72 place-items-center p-8 text-center"><div><BriefcaseBusiness className="mx-auto h-9 w-9 text-white/15" /><h2 className="mt-4 font-bold">Loyiha topilmadi</h2><p className="mt-2 text-xs text-white/30">Qidiruv yoki filtrlarni o‘zgartirib ko‘ring.</p></div></div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-3 backdrop-blur-xl sm:p-6">
          <div className="mx-auto my-4 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#070b18] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
              <div><p className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-primary">Project editor</p><h2 className="mt-1 text-lg font-black">{editingProject ? "Loyihani tahrirlash" : "Yangi loyiha yaratish"}</h2></div>
              <button type="button" onClick={() => setModalOpen(false)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-white/40 transition hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.68fr_1.32fr]">
              <div>
                <label className="mb-2 block text-xs font-bold text-white/55">Loyiha rasmi</label>
                <label className="group relative block aspect-[16/11] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.025]">
                  {imagePreview ? <Image src={imagePreview} alt="Loyiha rasmi preview" fill unoptimized={imagePreview.startsWith("blob:")} sizes="420px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-center"><span><UploadCloud className="mx-auto h-8 w-8 text-primary/55" /><span className="mt-3 block text-xs font-bold text-white/48">Rasm tanlash</span><span className="mt-1 block text-[0.58rem] text-white/22">PNG, JPG · maksimum 8MB</span></span></span>}
                  <span className="absolute inset-0 grid place-items-center bg-[#020611]/55 opacity-0 transition group-hover:opacity-100"><UploadCloud className="h-7 w-7 text-white" /></span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
                </label>
                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-xs font-bold text-white/55">Case study completeness</p>
                  <div className="mt-3 space-y-2 text-[0.6rem] text-white/30">
                    {[form.title, form.description, form.challenge, form.solution, form.outcomes].map((value, index) => <div key={index} className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${value.trim() ? "text-emerald-400" : "text-white/12"}`} /> {['Nomi','Tavsifi','Muammosi','Yechimi','Natijalari'][index]}</div>)}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Loyiha nomi"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="admin-input" /></Field>
                <Field label="Slug"><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="admin-input" placeholder="git-fast" /></Field>
                <Field label="Kategoriya"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProjectCategory })} className="admin-input"><option>Web ilova</option><option>PWA ilova</option><option>Telegram bot</option></select></Field>
                <Field label="Yil"><input required value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} className="admin-input" /></Field>
                <Field label="Qisqa tavsif" wide><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input min-h-24 resize-y" /></Field>
                <Field label="Texnologiyalar" wide><input required value={form.stack} onChange={(event) => setForm({ ...form, stack: event.target.value })} className="admin-input" placeholder="React, Node.js, Firebase" /></Field>
                <Field label="Highlight"><input value={form.metric} onChange={(event) => setForm({ ...form, metric: event.target.value })} className="admin-input" placeholder="Fast & responsive" /></Field>
                <Field label="Vazifa"><input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="admin-input" /></Field>
                <Field label="Muammo" wide><textarea required value={form.challenge} onChange={(event) => setForm({ ...form, challenge: event.target.value })} className="admin-input min-h-20 resize-y" /></Field>
                <Field label="Yechim" wide><textarea required value={form.solution} onChange={(event) => setForm({ ...form, solution: event.target.value })} className="admin-input min-h-20 resize-y" /></Field>
                <Field label="Natijalar" wide><input value={form.outcomes} onChange={(event) => setForm({ ...form, outcomes: event.target.value })} className="admin-input" placeholder="Tezkor UI, Mobil moslashuv, SEO" /></Field>
                <Field label="GitHub havolasi"><input type="url" value={form.github} onChange={(event) => setForm({ ...form, github: event.target.value })} className="admin-input" /></Field>
                <Field label="Live demo"><input type="url" value={form.live} onChange={(event) => setForm({ ...form, live: event.target.value })} className="admin-input" /></Field>
                <Field label="Rasm URL" wide><input value={form.image} onChange={(event) => { setForm({ ...form, image: event.target.value }); if (!imageFile) setImagePreview(event.target.value || null); }} className="admin-input" placeholder="https://..." /></Field>

                {notice ? <p className="sm:col-span-2 rounded-xl border border-amber-300/15 bg-amber-300/[0.055] px-3.5 py-3 text-xs text-amber-100/70">{notice}</p> : null}

                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setModalOpen(false)} className="focus-ring h-11 rounded-xl border border-white/[0.08] px-5 text-xs font-bold text-white/45 transition hover:text-white">Bekor qilish</button>
                  <button type="submit" disabled={saving} className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4569ff] to-[#657cff] px-6 text-xs font-black text-white shadow-[0_0_25px_rgba(69,105,255,0.22)] disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editingProject ? "O‘zgarishlarni saqlash" : "Loyihani yaratish"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-2 block text-xs font-bold text-white/52">{label}</span>{children}</label>;
}
