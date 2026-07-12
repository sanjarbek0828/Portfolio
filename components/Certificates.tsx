"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { certificates as staticCerts } from "@/lib/portfolio-data";

export function Certificates() {
  const [certificates, setCertificates] = useState(staticCerts);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const snap = await getDocs(collection(db, "certificates"));
        if (!snap.empty) {
          const data = snap.docs.map((certificateDoc) => certificateDoc.data() as (typeof staticCerts)[number]);
          setCertificates(data);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    };
    fetchCerts();
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-black/5 dark:border-white/[0.06]">
      <div aria-hidden="true" className="grid-surface absolute inset-0 opacity-[0.04]" />
      <div aria-hidden="true" className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[140px]" />
      <div className="container relative z-10 py-24 sm:py-28">
        <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">Sertifikatlar</p>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-black tracking-[-0.055em] text-foreground dark:text-white sm:text-5xl lg:text-6xl">{`Doimiy o'rganish natijalari.`}</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-foreground dark:text-white/50">{`Meta, Google, Coursera, Packt va boshqa xalqaro ta'lim platformalaridagi yutuqlar.`}</p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => (
            <ScrollReveal key={certificate.title} delay={(index % 3) * 0.05}>
              <a
                href={certificate.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full min-h-40 items-start gap-4 rounded-[1.75rem] border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.025] p-5 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-black/5 dark:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/5 dark:border-white/[0.08] bg-white sm:h-20 sm:w-20">
                  <Image src={certificate.image} alt={certificate.title} fill sizes="(max-width: 640px) 64px, 80px" className="object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold leading-tight tracking-[-0.02em] text-foreground dark:text-white sm:text-lg">{certificate.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-foreground dark:text-white/60">
                    <span>{certificate.issuer}</span>
                    <span className="h-1 w-1 rounded-full bg-primary/50" />
                    <span>{certificate.year}</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
