"use client";

import { useEffect, useState } from "react";
import { Github, Loader2 } from "lucide-react";

type Stats = { repos: number; followers: number; gists: number; url: string; unavailable?: boolean };

export function GitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    fetch("/api/github").then((response) => response.json()).then(setStats).catch(() => setStats({ repos: 0, followers: 0, gists: 0, url: "https://github.com/sanjarbek404", unavailable: true }));
  }, []);

  return (
    <a href={stats?.url || "https://github.com/sanjarbek404"} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[0.58rem] text-white/45 backdrop-blur-md transition hover:border-[#6685ff]/40 hover:text-white">
      <Github className="h-3.5 w-3.5 text-[#8aa0ff]" />
      {!stats ? <Loader2 className="h-3 w-3 animate-spin" /> : <><span><b className="text-white/80">{stats.repos}</b> repos</span><span className="h-3 w-px bg-white/10" /><span><b className="text-white/80">{stats.followers}</b> followers</span></>}
    </a>
  );
}
