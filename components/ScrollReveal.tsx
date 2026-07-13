"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  duration = 0.7,
  once = true,
  amount = 0.2,
  style,
  ...props
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold: amount },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [amount, once]);

  return (
    <div
      ref={elementRef}
      {...props}
      className={cn(className)}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${distance}px, 0)`,
        transition: `opacity ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s, transform ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
