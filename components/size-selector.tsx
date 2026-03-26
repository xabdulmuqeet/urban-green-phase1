import type { ProductSize } from "@/lib/types";

type SizeSelectorProps = {
  sizes: ProductSize[];
  selectedSize: string;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">Choose size</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sizes.map((size) => (
          <button
            key={size.label}
            type="button"
            onClick={() => onSelect(size.label)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              selectedSize === size.label
                ? "border-sage bg-sage/10 text-foreground"
                : "border-black/10 bg-white hover:border-sage/50"
            }`}
          >
            <span className="block font-semibold">{size.label}</span>
            <span className="mt-1 block text-sm text-bark/70">${size.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
