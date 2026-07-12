"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Mail,
  Search,
} from "lucide-react";

import { navigation, profile } from "@/lib/portfolio-data";

type CommandAction = {
  label: string;
  description: string;
  href?: string;
  kind: "section" | "download" | "copy";
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<CommandAction[]>(
    () => [
      ...navigation.map((item) => ({
        label: item.label,
        description: `Jump to ${item.label.toLowerCase()} section`,
        href: item.href,
        kind: "section" as const,
      })),
      {
        label: "Download CV",
        description: "Get the latest portfolio resume",
        href: "/Sanjarbek-Otabekov-CV.pdf",
        kind: "download",
      },
      {
        label: "Copy email",
        description: profile.email,
        kind: "copy",
      },
    ],
    [],
  );

  const filteredActions = actions.filter((action) =>
    `${action.label} ${action.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("portfolio:open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("portfolio:open-command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCopied(false);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
    };
  }, [open]);

  const runAction = async (action: CommandAction) => {
    if (action.kind === "copy") {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setOpen(false), 500);
      return;
    }

    if (action.kind === "download" && action.href) {
      const link = document.createElement("a");
      link.href = action.href;
      link.download = "Sanjarbek-Otabekov-CV.pdf";
      link.click();
      setOpen(false);
      return;
    }

    if (action.href) {
      document.querySelector(action.href)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-slate-950/65 px-4 pt-[14vh] backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/95 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-border px-5">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages and actions..."
                className="h-16 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {filteredActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => runAction(action)}
                  className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition hover:bg-primary/10"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition group-hover:border-primary/30 group-hover:text-primary">
                    {action.kind === "download" ? (
                      <Download className="h-4 w-4" />
                    ) : action.kind === "copy" ? (
                      copied ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{action.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              ))}
              {filteredActions.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No matching action found.
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground">
              <span>Quick portfolio navigation</span>
              <span>Ctrl / Cmd + K</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
