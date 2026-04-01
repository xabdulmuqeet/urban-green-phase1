import Image from "next/image";
import type { ReactNode } from "react";

type BundleOptionCardProps = {
  title: string;
  subtitle: string;
  priceLabel: string;
  image: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  metaChips?: string[];
  expandedContent?: ReactNode;
};

export function BundleOptionCard({
  title,
  subtitle,
  priceLabel,
  image,
  selected,
  onClick,
  badge,
  metaChips = [],
  expandedContent
}: BundleOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[2rem] border bg-white text-left shadow-card transition ${
        selected
          ? "border-sage ring-2 ring-sage/20"
          : "border-black/5 hover:-translate-y-1 hover:border-sage/30"
      }`}
    >
      {badge ? (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
          {badge}
        </span>
      ) : null}

      <Image
        src={image}
        alt={title}
        width={700}
        height={760}
        className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-[family:var(--font-heading)] text-2xl leading-tight">{title}</h3>
          <p className="text-base font-semibold text-terracotta">{priceLabel}</p>
        </div>
        <p className="text-sm leading-6 text-bark/75">{subtitle}</p>
        {metaChips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {metaChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-bark/70"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {expandedContent ? (
          <div className="border-t border-black/5 pt-4">{expandedContent}</div>
        ) : null}
      </div>
    </button>
  );
}
