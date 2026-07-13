"use client";

import { useState, useEffect } from "react";

export function TypewriterRole({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="mt-6 flex min-h-[30px] items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.38em] text-[#6685ff] sm:text-sm">
        <span key={index} className="role-enter inline-block">
          {roles[index]}
        </span>
      <span className="cursor-blink inline-block h-4 w-1.5 rounded-full bg-[#6685ff]" />
    </div>
  );
}
