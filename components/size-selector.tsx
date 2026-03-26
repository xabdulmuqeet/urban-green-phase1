import { formatCurrency } from "@/lib/format";
import type { Product, ProductSizeLabel } from "@/lib/types";

type SizeSelectorProps = {
  sizes: Product["sizes"];
  prices: Product["prices"];
  selectedSize: ProductSizeLabel;
  onSelect: (size: ProductSizeLabel) => void;
};

export function SizeSelector({
  sizes,
  prices,
  selectedSize,
  onSelect
}: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">Choose size</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              selectedSize === size
                ? "border-sage bg-sage/10 text-foreground"
                : "border-black/10 bg-white hover:border-sage/50"
            }`}
          >
            <span className="block font-semibold">{size}</span>
            <span className="mt-1 block text-sm text-bark/70">
              {formatCurrency(prices[size])}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
