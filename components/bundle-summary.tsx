import { formatCurrency } from "@/lib/format";
import { useTransientFlag } from "@/hooks/use-transient-flag";
import type { CatalogExtra, CatalogPot, Product, ProductSizeLabel } from "@/lib/types";
import type { BundlePricing } from "@/lib/bundle";

type BundleSummaryProps = {
  currentStep: number;
  plant: Product | null;
  plantVariantSize: ProductSizeLabel | null;
  pot: CatalogPot | null;
  extras: CatalogExtra[];
  pricing: BundlePricing;
  canAddBundle: boolean;
  editingCartKey: string | null;
  onPrimaryAction: () => void;
  onAddBundleAndViewCart: () => void;
};

export function BundleSummary({
  currentStep,
  plant,
  plantVariantSize,
  pot,
  extras,
  pricing,
  canAddBundle,
  editingCartKey,
  onPrimaryAction,
  onAddBundleAndViewCart
}: BundleSummaryProps) {
  const { isActive: showAddedState, trigger: triggerAddedState } = useTransientFlag();
  const primaryActionLabel =
    currentStep === 1
      ? "Proceed to Vessels"
      : currentStep === 2
        ? "Proceed to Final Review"
        : editingCartKey
          ? "Update Bundle"
          : "Add Bundle To Cart";

  return (
    <aside className="h-fit self-start bg-[#ecefea] p-8 lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
      <h2 className="mb-8 font-[family:var(--font-heading)] text-2xl text-[#486730]">
        Live Summary
      </h2>

      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#f8faf5]">
            {plant ? (
              <img src={plant.images[0]} alt={plant.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#516448]/45">+</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-[family:var(--font-heading)] text-sm text-[#486730]">
                {plant ? plant.name : "Choose a plant"}
              </p>
              <p className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#474747]/60">
                {plant ? `${plantVariantSize ?? plant.sizes[0]} selected` : "Required step"}
              </p>
            </div>
            <p className="font-[family:var(--font-heading)] text-sm text-[#191c1a]">
              {formatCurrency(pricing.plantPrice)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 opacity-70">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-dashed border-[#516448]/35 bg-[#f8faf5]">
            {pot ? (
              <img src={pot.images[0]} alt={pot.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#516448]/45">+</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-[family:var(--font-heading)] text-sm italic text-[#486730]">
                {pot ? pot.name : "Vessel Selection"}
              </p>
              <p className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#474747]/60">
                {pot ? "Matched to selected size" : "Required step"}
              </p>
            </div>
            <p className="font-[family:var(--font-heading)] text-sm text-[#191c1a]">
              {formatCurrency(pricing.potPrice)}
            </p>
          </div>
        </div>

        {extras.length > 0 ? (
          <div className="space-y-3">
            {extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between gap-4">
                <p className="font-[family:var(--font-heading)] text-sm text-[#486730]">{extra.name}</p>
                <p className="font-[family:var(--font-heading)] text-sm text-[#191c1a]">
                  {formatCurrency(extra.price)}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="border-t border-[#777777]/30 pt-8">
          <div className="flex items-center justify-between text-sm text-[#474747]/80">
            <span className="font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em]">Subtotal</span>
            <span className="font-[family:var(--font-heading)] text-lg">{formatCurrency(pricing.subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#486730]">
            <span className="font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em]">
              Bundle discount
            </span>
            <span className="font-[family:var(--font-heading)] text-lg">-{formatCurrency(pricing.discount)}</span>
          </div>
        </div>

        <div className="bg-[#e7e9e4] p-6">
          <p className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#474747]/60">
            Total Estimated
          </p>
          <p className="font-[family:var(--font-heading)] text-5xl font-bold tracking-[-0.05em] text-[#486730]">
            {formatCurrency(pricing.total)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onPrimaryAction();

            if (currentStep === 3 && canAddBundle && !editingCartKey) {
              triggerAddedState();
            }
          }}
          disabled={currentStep >= 2 ? !canAddBundle : false}
          className="w-full bg-[#486730] py-5 font-[family:var(--font-body)] text-sm uppercase tracking-[0.18em] text-white shadow-xl transition hover:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {showAddedState && currentStep === 3 && !editingCartKey ? (
              <>
                <span className="material-symbols-outlined text-base leading-none">check</span>
                <span>Added Bundle To Cart</span>
              </>
            ) : (
              <span>{primaryActionLabel}</span>
            )}
          </span>
        </button>

        <p className="text-center font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#474747]/50">
          Carbon Neutral Shipping Included
        </p>

        {currentStep === 3 ? (
          <button
            type="button"
            onClick={onAddBundleAndViewCart}
            disabled={!canAddBundle}
            className="w-full border border-[#486730]/20 py-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em] text-[#486730] transition hover:bg-[#f8faf5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editingCartKey ? "Update Bundle & View Cart" : "Add Bundle & View Cart"}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
