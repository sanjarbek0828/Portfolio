"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type DeferredRenderProps = {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

/** Mounts non-critical UI shortly before it reaches the viewport. */
export function DeferredRender({
  children,
  fallback,
  minHeight = 320,
  rootMargin = "600px 0px",
}: DeferredRenderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || ready) return;

    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [ready, rootMargin]);

  return (
    <div ref={hostRef} style={ready ? undefined : { minHeight }}>
      {ready ? children : fallback}
    </div>
  );
}
