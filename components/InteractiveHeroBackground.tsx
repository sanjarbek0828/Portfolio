"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const imageClass = "object-cover object-[62%_center] sm:object-[58%_center] lg:object-center";

export function InteractiveHeroBackground() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 42, damping: 20, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 42, damping: 20, mass: 0.7 });

  const sceneX = useTransform(smoothX, [0, 1], [-5, 5]);
  const sceneY = useTransform(smoothY, [0, 1], [-3, 3]);
  const characterX = useTransform(smoothX, [0, 1], [-12, 12]);
  const characterY = useTransform(smoothY, [0, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [0, 1], [0.7, -0.7]);
  const rotateY = useTransform(smoothX, [0, 1], [-0.9, 0.9]);
  const glowX = useTransform(smoothX, [0, 1], ["25%", "80%"]);
  const glowY = useTransform(smoothY, [0, 1], ["22%", "72%"]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (hover: hover)");
    const update = () => setDesktopMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || !active || !desktopMotion) return;
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX.set(event.clientX / window.innerWidth);
      pointerY.set(event.clientY / window.innerHeight);
    };
    const resetPointer = () => { pointerX.set(0.5); pointerY.set(0.5); };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    };
  }, [active, desktopMotion, pointerX, pointerY, reducedMotion]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && document.visibilityState === "visible"), { threshold: 0.01 });
    const handleVisibility = () => setActive(document.visibilityState === "visible" && element.getBoundingClientRect().bottom > 0);
    observer.observe(element);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", handleVisibility); };
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
    return () => { clearTimeout(blinkTimer); clearTimeout(closeTimer); };
  }, [active, desktopMotion, reducedMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden [perspective:1100px]">
      {/* Far scene: restrained reverse movement creates the first depth plane. */}
      <motion.div style={reducedMotion ? undefined : { x: sceneX, y: sceneY }} className="absolute -inset-3 scale-[1.018]">
        <Image src="/images/hero-anime-bg.webp" alt="" fill priority quality={90} sizes="100vw" className={imageClass} />
      </motion.div>

      {/* Feathered foreground plane keeps the character visually separated without hard cutout edges. */}
      <motion.div
        style={reducedMotion ? undefined : { x: characterX, y: characterY, rotateX, rotateY }}
        className="absolute -inset-3 hidden origin-[65%_56%] scale-[1.018] [mask-image:radial-gradient(ellipse_44%_72%_at_65%_58%,black_0%,black_58%,transparent_78%)] [transform-style:preserve-3d] lg:block"
      >
        <motion.div
          animate={reducedMotion || !active || !desktopMotion ? undefined : { y: [0, -1.5, 0], scaleY: [1, 1.0025, 1] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 origin-[65%_78%]"
        >
          <Image src="/images/hero-anime-bg.webp" alt="" fill priority quality={90} sizes="100vw" className={imageClass} />
          <motion.div
            initial={false}
            animate={{ opacity: blinking ? 1 : 0 }}
            transition={{ duration: blinking ? 0.035 : 0.055, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image src="/images/hero-anime-blink.webp" alt="" fill sizes="100vw" className={imageClass} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cursor-following monitor light ties the foreground motion into the scene. */}
      <motion.div style={reducedMotion ? undefined : { left: glowX, top: glowY }} className="absolute hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4569ff]/[0.065] blur-[95px] lg:block" />
      <motion.div animate={reducedMotion || !active || !desktopMotion ? undefined : { opacity: [0.28, 0.48, 0.28] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[8%] top-[16%] hidden h-24 w-64 rounded-full bg-blue-400/[0.08] blur-[55px] lg:block" />
    </div>
  );
}
