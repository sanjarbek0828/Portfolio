"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LazyCommandMenu = dynamic(
  () => import("@/components/CommandMenu").then((module) => module.CommandMenu),
  { ssr: false },
);

export function DeferredCommandMenu() {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (requested) return;
    const request = () => setRequested(true);
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        request();
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("portfolio:open-command", request);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("portfolio:open-command", request);
    };
  }, [requested]);

  return requested ? <LazyCommandMenu initiallyOpen /> : null;
}
