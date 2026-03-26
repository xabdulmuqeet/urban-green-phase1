import { formatCurrency } from "@/lib/format";
import type { CatalogExtra, CatalogPlant, CatalogPot } from "@/lib/types";
import type { BundlePricing } from "@/lib/bundle";

type BundleSummaryProps = {
  plant: CatalogPlant | null;
  pot: CatalogPot | null;
  extras: CatalogExtra[];
  pricing: BundlePricing;
};

export function BundleSummary({
  plant,
  pot,
  extras,
  pricing
}: BundleSummaryProps) {
  return (
    <aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card lg:sticky lg:top-28">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
        Live Summary
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Plant</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="font-medium text-foreground">
              {plant ? `${plant.name} (${plant.plantSize})` : "Choose a plant"}
            </p>
            <p className="text-sm text-bark/70">{formatCurrency(pricing.plantPrice)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Pot</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="font-medium text-foreground">{pot ? pot.name : "Choose a pot"}</p>
            <p className="text-sm text-bark/70">{formatCurrency(pricing.potPrice)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Extras</p>
          <div className="mt-2 space-y-2">
            {extras.length > 0 ? (
              extras.map((extra) => (
                <div key={extra.id} className="flex items-center justify-between gap-4">
                  <p className="font-medium text-foreground">{extra.name}</p>
                  <p className="text-sm text-bark/70">{formatCurrency(extra.price)}</p>
                </div>
              ))
            ) : (
              <p className="font-medium text-foreground">No extras selected yet</p>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-cream/60 p-4">
          <div className="flex items-center justify-between text-sm text-bark/80">
            <span>Subtotal</span>
            <span>{formatCurrency(pricing.subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-bark/80">
            <span>Bundle discount</span>
            <span className="text-sage">-{formatCurrency(pricing.discount)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
            <span className="font-[family:var(--font-heading)] text-2xl">Total</span>
            <span className="text-2xl font-semibold text-terracotta">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>

        <p className="text-sm leading-6 text-bark/70">
          Add any extra to a plant-and-pot pairing and the bundle discount is applied automatically.
        </p>
      </div>
    </aside>
  );
}
