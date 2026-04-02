import { formatCurrency } from "@/lib/format";
import type { CatalogExtra, CatalogPot, Product, ProductSizeLabel } from "@/lib/types";
import type { BundlePricing } from "@/lib/bundle";

type BundleSummaryProps = {
  plant: Product | null;
  plantVariantSize: ProductSizeLabel | null;
  pot: CatalogPot | null;
  extras: CatalogExtra[];
  pricing: BundlePricing;
  canAddBundle: boolean;
  editingCartKey: string | null;
  onAddBundle: () => void;
  onAddBundleAndViewCart: () => void;
};

export function BundleSummary({
  plant,
  plantVariantSize,
  pot,
  extras,
  pricing,
  canAddBundle,
  editingCartKey,
  onAddBundle,
  onAddBundleAndViewCart
}: BundleSummaryProps) {
  return (
    <aside className="h-fit self-start rounded-[2rem] border border-black/5 bg-white p-6 shadow-card lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
        Live Summary
      </p>

      <div className="mt-6 space-y-5">
        <div className="rounded-[1.5rem] bg-cream/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Plant</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {plant ? plant.name : "Choose a plant"}
              </p>
              <p className="text-sm text-bark/65">
                {plant ? `${plantVariantSize ?? plant.sizes[0]} selected` : "Your plant will anchor the bundle."}
              </p>
            </div>
            <p className="text-sm font-semibold text-bark/70">{formatCurrency(pricing.plantPrice)}</p>
          </div>
        </div>

        <div className="border-t border-black/5 pt-5">
          <div className="rounded-[1.5rem] bg-cream/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Pot</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{pot ? pot.name : "Choose a pot"}</p>
                <p className="text-sm text-bark/65">
                  {pot ? "Matched to your selected plant size." : "We will help you pair the right fit."}
                </p>
              </div>
              <p className="text-sm font-semibold text-bark/70">{formatCurrency(pricing.potPrice)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 pt-5">
          <div className="rounded-[1.5rem] bg-cream/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-bark/50">Extras</p>
            <div className="mt-2 space-y-2">
              {extras.length > 0 ? (
                extras.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between gap-4">
                    <p className="font-medium text-foreground">{extra.name}</p>
                    <p className="text-sm font-semibold text-bark/70">{formatCurrency(extra.price)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-dashed border-black/10 px-3 py-3 text-sm text-bark/60">
                  No extras selected yet. Add one to unlock the bundle discount.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-cream/60 p-5">
          <div className="flex items-center justify-between text-sm text-bark/80">
            <span>Subtotal</span>
            <span>{formatCurrency(pricing.subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-bark/80">
            <span>Bundle discount</span>
            <span className="font-semibold text-sage">-{formatCurrency(pricing.discount)}</span>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-black/5 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/55">Bundle Total</p>
              <span className="font-[family:var(--font-heading)] text-2xl">Total</span>
            </div>
            <span className="text-3xl font-semibold text-terracotta">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>

        <p className="text-sm leading-6 text-bark/70">
          Add any extra to a plant-and-pot pairing and the bundle discount is applied automatically.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onAddBundle}
            disabled={!canAddBundle}
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editingCartKey ? "Update Bundle" : "Add Bundle To Cart"}
          </button>
          <button
            type="button"
            onClick={onAddBundleAndViewCart}
            disabled={!canAddBundle}
            className="rounded-full bg-terracotta px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editingCartKey ? "Update Bundle & View Cart" : "Add Bundle & View Cart"}
          </button>
        </div>
      </div>
    </aside>
  );
}
