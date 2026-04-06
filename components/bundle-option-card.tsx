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
      className={`group relative overflow-hidden bg-[#f2f4ef] p-5 text-left transition ${
        selected
          ? "ring-1 ring-[#486730]/20"
          : "hover:bg-[#f8faf5]"
      }`}
    >
      {badge ? (
        <span className="absolute left-4 top-4 z-10 bg-[#486730] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          {badge}
        </span>
      ) : null}
      {selected ? (
        <span className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#f8faf5] text-[#486730]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 10.5L8.4 13.9L15.2 7.1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}

      <div className="mb-5 aspect-square overflow-hidden bg-[#e7e9e4]">
        <Image
          src={image}
          alt={title}
          width={700}
          height={760}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-[family:var(--font-heading)] text-[1.65rem] leading-tight tracking-[-0.03em] text-[#486730]">
            {title}
          </h3>
          <p className="font-[family:var(--font-heading)] text-lg text-[#191c1a]">{priceLabel}</p>
        </div>
        <p className="font-[family:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#474747]/60">
          {subtitle}
        </p>
        {metaChips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {metaChips.map((chip) => (
              <span
                key={chip}
                className="bg-[#e7e9e4] px-3 py-1 font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#474747]"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {expandedContent ? (
          <div className="pt-2">{expandedContent}</div>
        ) : null}
        <div className={`mt-3 px-4 py-2.5 text-center font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.22em] ${
          selected ? "border border-[#486730] text-[#486730]" : "bg-[#516448] text-[#d4e9c5]"
        }`}>
          {selected ? "Selected" : "Add To Bundle"}
        </div>
      </div>
    </button>
  );
}
