"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Twitter,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profile, socialLinks } from "@/lib/portfolio-data";

type ContactFields = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
};

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Telegram: Send,
  Twitter,
};

export function Contact() {
  const [submitState, setSubmitState] = useState<
    "idle" | "success" | "mailto" | "error"
  >("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFields>({ mode: "onChange" });

  const onSubmit = async (values: ContactFields) => {
    setSubmitState("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Unable to send message");
      const result = (await response.json()) as { demo?: boolean };

      if (result.demo) {
        const subject = encodeURIComponent(`Portfolio inquiry: ${values.projectType}`);
        const body = encodeURIComponent(
          `Name: ${values.name}\nEmail: ${values.email}\nBudget: ${values.budget}\n\n${values.message}`,
        );
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
        setSubmitState("mailto");
        return;
      }

      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="content-auto relative pb-5">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[54rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
      <div className="section-shell pb-12 sm:pb-16">
        <ScrollReveal>
          <div id="contact-heading">
            <SectionHeading
              eyebrow="Get in touch"
              title="Have a bold idea? Let’s build it together."
              description="Tell me a little about your project, challenge or opportunity. I’ll get back to you with thoughtful next steps."
            />
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <ScrollReveal className="h-full">
            <div className="glass-panel relative flex h-full min-h-[430px] flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:p-9">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Usually replies within 24h
                </span>
                <h3 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
                  Prefer a direct line?
                </h3>
                <a
                  href={`mailto:${profile.email}`}
                  className="focus-ring group mt-5 inline-flex items-center gap-3 rounded-lg text-base font-semibold text-primary sm:text-lg"
                >
                  <Mail className="h-5 w-5" />
                  {profile.email}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {profile.location}
                </div>
              </div>

              <div className="relative mt-12">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Find me online
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const Icon = socialIcons[social.label as keyof typeof socialIcons];
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -3, rotate: -3 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={social.label}
                        className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-border bg-background/50 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="glass-panel rounded-[2rem] p-6 sm:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                    Your name
                  </label>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="John Doe"
                    aria-invalid={Boolean(errors.name)}
                    {...register("name", {
                      required: "Please enter your name.",
                      minLength: { value: 2, message: "Name must be at least 2 characters." },
                    })}
                  />
                  <p className="mt-1.5 min-h-5 text-xs text-destructive" role="alert">
                    {errors.name?.message}
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="john@company.com"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email", {
                      required: "Please enter your email.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address.",
                      },
                    })}
                  />
                  <p className="mt-1.5 min-h-5 text-xs text-destructive" role="alert">
                    {errors.email?.message}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="projectType" className="mb-2 block text-sm font-semibold">
                    Project type
                  </label>
                  <select
                    id="projectType"
                    defaultValue=""
                    aria-invalid={Boolean(errors.projectType)}
                    className="focus-ring flex h-11 w-full rounded-xl border border-input bg-background/60 px-3 text-sm shadow-sm outline-none"
                    {...register("projectType", { required: "Choose a project type." })}
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Web application">Web application</option>
                    <option value="Marketing website">Marketing website</option>
                    <option value="Product design">Product design</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                  <p className="mt-1.5 min-h-5 text-xs text-destructive" role="alert">
                    {errors.projectType?.message}
                  </p>
                </div>

                <div>
                  <label htmlFor="budget" className="mb-2 block text-sm font-semibold">
                    Estimated budget
                  </label>
                  <select
                    id="budget"
                    defaultValue=""
                    aria-invalid={Boolean(errors.budget)}
                    className="focus-ring flex h-11 w-full rounded-xl border border-input bg-background/60 px-3 text-sm shadow-sm outline-none"
                    {...register("budget", { required: "Choose an estimated budget." })}
                  >
                    <option value="" disabled>Select a range</option>
                    <option value="$1k – $3k">$1k – $3k</option>
                    <option value="$3k – $8k">$3k – $8k</option>
                    <option value="$8k+">$8k+</option>
                    <option value="Let's discuss">Let&apos;s discuss</option>
                  </select>
                  <p className="mt-1.5 min-h-5 text-xs text-destructive" role="alert">
                    {errors.budget?.message}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Tell me about the project
                </label>
                <Textarea
                  id="message"
                  placeholder="A few words about your goals, scope and timeline..."
                  aria-invalid={Boolean(errors.message)}
                  {...register("message", {
                    required: "Please add a short message.",
                    minLength: {
                      value: 20,
                      message: "Please share at least 20 characters.",
                    },
                    maxLength: {
                      value: 2000,
                      message: "Please keep your message below 2,000 characters.",
                    },
                  })}
                />
                <p className="mt-1.5 min-h-5 text-xs text-destructive" role="alert">
                  {errors.message?.message}
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div aria-live="polite" className="min-h-5 text-xs">
                  {submitState === "success" ? (
                    <span className="inline-flex items-center gap-2 font-medium text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" /> Message received. Thank you!
                    </span>
                  ) : null}
                  {submitState === "mailto" ? (
                    <span className="inline-flex items-center gap-2 font-medium text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" /> Your email app is ready.
                    </span>
                  ) : null}
                  {submitState === "error" ? (
                    <span className="text-destructive">
                      Something went wrong. Please email me directly.
                    </span>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isValid || isSubmitting}
                  className="w-full gap-2 sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>

      <footer className="container relative border-t border-border/70 py-7">
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Sanjarbek Otabekov. Crafted with care.</p>
          <a href="#home" className="focus-ring rounded-md transition hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
