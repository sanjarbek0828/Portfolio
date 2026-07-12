import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiMongodb,
  SiFirebase,
  SiFigma,
  SiPython,
  SiHtml5,
  SiGit,
  SiVercel,
  SiNextdotjs,
  SiMysql,
  SiTelegram,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
import { Code2, Layers, Zap, Globe } from "lucide-react";

export function TechIcon({ tech, className = "" }: { tech: string; className?: string }) {
  const iconClass = `shrink-0 ${className}`;

  switch (tech.toLowerCase()) {
    case "javascript": return <SiJavascript className={`${iconClass} text-[#F7DF1E]`} />;
    case "typescript": return <SiTypescript className={`${iconClass} text-[#3178C6]`} />;
    case "react": return <SiReact className={`${iconClass} text-[#61DAFB]`} />;
    case "next.js":
    case "nextjs": return <SiNextdotjs className={iconClass} />;
    case "node.js":
    case "nodejs": return <SiNodedotjs className={`${iconClass} text-[#339933]`} />;
    case "tailwindcss":
    case "tailwind css":
    case "tailwind": return <SiTailwindcss className={`${iconClass} text-[#06B6D4]`} />;
    case "mongodb": return <SiMongodb className={`${iconClass} text-[#47A248]`} />;
    case "firebase": return <SiFirebase className={`${iconClass} text-[#FFCA28]`} />;
    case "figma": return <SiFigma className={`${iconClass} text-[#F24E1E]`} />;
    case "python": return <SiPython className={`${iconClass} text-[#3776AB]`} />;
    case "html5": return <SiHtml5 className={`${iconClass} text-[#E34F26]`} />;
    case "css":
    case "css3": return <FaCss3Alt className={`${iconClass} text-[#1572B6]`} />;
    case "git": return <SiGit className={`${iconClass} text-[#F05032]`} />;
    case "vercel": return <SiVercel className={iconClass} />;
    case "mysql": return <SiMysql className={`${iconClass} text-[#4479A1]`} />;
    case "ui/ux design":
    case "ui/ux": return <Layers className={`${iconClass} text-[#A259FF]`} />;
    case "telegram bot api":
    case "telegram": return <SiTelegram className={`${iconClass} text-[#26A5E4]`} />;
    case "rest api": return <Globe className={`${iconClass} text-[#FF6C37]`} />;
    case "automation": return <Zap className={`${iconClass} text-[#FFB800]`} />;
    default:
      return <Code2 className={`${iconClass} text-muted-foreground`} />;
  }
}
