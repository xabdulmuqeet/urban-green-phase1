import type { ReactNode } from "react";

type BadgeTone = "default" | "accent" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  default: "border border-sage/18 bg-sage/10 text-sage",
  accent: "border border-terracotta/18 bg-terracotta/10 text-terracotta",
  muted: "border border-black/6 bg-white/88 text-bark/70"
};

export function Badge({
  children,
  tone = "default",
  className = ""
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${toneClasses[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
