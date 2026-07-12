"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const InteractivePet = dynamic(() => import("@/components/InteractivePet").then((module) => module.InteractivePet), { ssr: false });

export function DesktopInteractivePet() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (hover: hover)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return desktop ? <InteractivePet /> : null;
}
