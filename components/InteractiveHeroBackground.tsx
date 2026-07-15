"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const imageClass = "object-cover object-[62%_center] sm:object-[58%_center] lg:object-center";

export function InteractiveHeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);
  const [active, setActive] = useState(true);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [blinking, setBlinking] = useState(false);

  const paintFrame = useCallback(() => {
    frameRef.current = 0;
    const current = currentRef.current;
    const target = targetRef.current;
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;

    if (sceneRef.current) {
      sceneRef.current.style.transform = `translate3d(${-5 + current.x * 10}px, ${-3 + current.y * 6}px, 0) scale(1.018)`;
    }
    if (characterRef.current) {
      characterRef.current.style.transform = `translate3d(${-12 + current.x * 24}px, ${-8 + current.y * 16}px, 0) rotateX(${0.7 - current.y * 1.4}deg) rotateY(${-0.9 + current.x * 1.8}deg) scale(1.018)`;
    }
    if (glowRef.current) {
      glowRef.current.style.left = `${25 + current.x * 55}%`;
      glowRef.current.style.top = `${22 + current.y * 50}%`;
    }

    if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
      frameRef.current = window.requestAnimationFrame(paintFrame);
    }
  }, []);

  const schedulePaint = useCallback(() => {
    if (!frameRef.current) frameRef.current = window.requestAnimationFrame(paintFrame);
  }, [paintFrame]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setDesktopMotion(desktop.matches);
      setReducedMotion(reduce.matches);
    };
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !active || !desktopMotion) return;
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetRef.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };
      schedulePaint();
    };
    const resetPointer = () => {
      targetRef.current = { x: 0.5, y: 0.5 };
      schedulePaint();
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [active, desktopMotion, reducedMotion, schedulePaint]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.01 },
    );
    const handleVisibility = () => {
      setActive(document.visibilityState === "visible" && element.getBoundingClientRect().bottom > 0);
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !active || !desktopMotion) return;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlinking(true);
        closeTimer = setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 135);
      }, 2800 + Math.random() * 3600);
    };
    scheduleBlink();
    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(closeTimer);
    };
  }, [active, desktopMotion, reducedMotion]);

  const motionEnabled = desktopMotion && active && !reducedMotion;

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden [perspective:1100px]">
      <div ref={sceneRef} className="absolute -inset-3 scale-[1.018] will-change-transform">
        <Image src="/images/hero-anime-bg.webp" alt="" fill priority quality={82} sizes="100vw" className={imageClass} />
      </div>

      <div
        ref={characterRef}
        className="absolute -inset-3 hidden origin-[65%_56%] scale-[1.018] will-change-transform [mask-image:radial-gradient(ellipse_44%_72%_at_65%_58%,black_0%,black_58%,transparent_78%)] 2xl:[mask-image:radial-gradient(ellipse_60%_80%_at_65%_58%,black_0%,black_58%,transparent_85%)] 3xl:[mask-image:none] [transform-style:preserve-3d] lg:block"
      >
        <div className={`absolute inset-0 origin-[65%_78%] ${motionEnabled ? "hero-breathe" : ""}`}>
          <Image src="/images/hero-anime-bg.webp" alt="" fill quality={82} sizes="100vw" className={imageClass} />
          <div className="absolute inset-0 transition-opacity duration-75" style={{ opacity: blinking ? 1 : 0 }}>
            <Image src="/images/hero-anime-blink.webp" alt="" fill quality={82} sizes="100vw" className={imageClass} />
          </div>
        </div>
      </div>

      <div ref={glowRef} className="absolute left-1/2 top-1/2 hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4569ff]/[0.065] blur-[95px] will-change-[left,top] lg:block" />
      <div className={`absolute right-[8%] top-[16%] hidden h-24 w-64 rounded-full bg-blue-400/[0.08] blur-[55px] lg:block ${motionEnabled ? "hero-glow-pulse" : ""}`} />
    </div>
  );
}
