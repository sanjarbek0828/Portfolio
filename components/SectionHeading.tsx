import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div
        className={cn(
          "mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-8 bg-primary" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

