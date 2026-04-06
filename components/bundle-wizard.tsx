"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { BundleOptionCard } from "@/components/bundle-option-card";
import { BundleProgress } from "@/components/bundle-progress";
import { BundleSummary } from "@/components/bundle-summary";
import { BundleSummarySkeleton } from "@/components/bundle-summary-skeleton";
import { useCart } from "@/components/cart-provider";
import { useBundleBuilder } from "@/hooks/use-bundle-builder";
import { getAllExtras, getAllPots, getPriceForSize } from "@/lib/data";
import { calculateBundlePricing } from "@/lib/bundle";
import { formatCurrency } from "@/lib/format";
import type { PlantSizeLabel, Product } from "@/lib/types";

const specimenImageMap: Record<string, string> = {
  "monstera-deliciosa":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTc-ENHJ317dD18eyA_b-thdVUhBmgvwyQ0pDXbBMYzeiYeVR-0TT_f94ujIVvhjnmmOxSBrewj4rrh7-atqEbBHhLNuYbec2YYgVpcUt6chLUn4LFkusWhWRwQW47yJOA0nyVJwMs2yK2_OuKTEGzg-V79IKj6sCbLMtF4ITWNrv3_nUNDGAnFWXDdu21lw0Zb3_BUJkS-WT7B8ylLkqi7zkLmp6UBJyP9MFRFIAMQMTppa9mhtuOl6qGnojAA5TYjIO7BYnECmpX",
  "ficus-lyrata":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxAGqYB2uQfXJzochHCsNDuK9B9GHcnYAEicPxJ_tWTZKgQixWcyfYKrSYbwbpmHbzTRlX0PzlBKwfxaPqK9QSZihUo5TiPQ7OANEboqWJqLhoHWS5d05r1WO4ytKnDBziBszXDxxlzbjFLROiFfuy4uixzKNljel4dIB7EqQoOdzPcrILoWRp1Xz9n8z0kew_Fc87l81h60Y6WExzPfv_m_HvkYI8pEdR2Iz4jC8nddpu2L6qUDkTAtR9sTLTvv0h8shtWl6LWOmL",
  "snake-plant-laurentii":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_4YMwK9NC2rY2dFH3A04ycjVnYMw1qJabUoaEM5PMwbKN2tKV41dgNnxFdtQo8R08Bi7pEyvDNOyXH6nfOeqq-r3bbu7P28ZtXSZoEt6ZxEznBJI-VYB646NmLTBp3I67_kcymd69ZmKdwNYMHvhV0JR1dEwRgGzaKzfR0QpoZlhLGzni_twl1zUbLSxKk42etrmZ0uZmmnIxIEXbL6xk8HBQPaNAEns7bz5keAqCFtHett8gMLnuTsl6I-egnkSZitl4LYolAXaO",
  "olive-tree":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAXfkPUN7OutkW8V9aQSZGkFhCrCgNg5L1GLgYpVTKI95bsAZDiPfIMlPwfP1TIJglSBPtMl-jk-uXmM5YUVMrm5c_BN1OCH6bD8j5BHX4pfkjr_XrEax0PNuMCXgLF9Rzw4W00ZqQixpTiAFz544ueBNrKVGAD1e4ynE_50cB_Jz8-RJT_IqfH3xkjcbNn_imKzI6WwpHqkBCA10GVjdSit_e6AqgG8aT9eRMwm42YAYRJ9jItktbrVXo7doqmmNgPnAnbY9CFHlPy"
};

type BundleWizardProps = {
  plants: Product[];
  editKey?: string | null;
};

export function BundleWizard({ plants, editKey = null }: BundleWizardProps) {
  const router = useRouter();
  const hasInitializedFreshMode = useRef(false);
  const extras = useMemo(() => getAllExtras(), []);
  const allPots = useMemo(() => getAllPots(), []);
  const {
    isHydrated,
    step,
    quantity,
    editingCartKey,
    selectedPlant,
    selectedPlantVariantSize,
    selectedPot,
    selectedExtras,
    setStep,
    selectPlant,
    selectPlantVariantSize,
    selectPot,
    toggleExtra,
    clearEditingState,
    reset
  } = useBundleBuilder({
    plants,
    pots: allPots.filter(
      (pot, index, current) => current.findIndex((item) => item.id === pot.id) === index
    ),
    extras
  });
  const { addBundleToCart, replaceBundleInCart } = useCart();

  const resolvedPlantFitSize = useMemo<PlantSizeLabel | null>(() => {
    if (!selectedPlant || !selectedPlantVariantSize) {
      return null;
    }

    if (selectedPlantVariantSize === '4"') {
      return "Small";
    }

    if (selectedPlantVariantSize === '6"') {
      return "Medium";
    }

    return "Large";
  }, [selectedPlant, selectedPlantVariantSize]);

  const availablePots = useMemo(
    () =>
      resolvedPlantFitSize
        ? allPots
            .filter((pot) => pot.fits.includes(resolvedPlantFitSize))
            .sort((left, right) => {
              const leftExact = left.fits.length === 1 && left.fits[0] === resolvedPlantFitSize;
              const rightExact = right.fits.length === 1 && right.fits[0] === resolvedPlantFitSize;

              if (leftExact === rightExact) {
                return left.price - right.price;
              }

              return leftExact ? -1 : 1;
            })
        : [],
    [allPots, resolvedPlantFitSize]
  );
  const recommendedExtraIds = useMemo(() => {
    if (!selectedPlant) {
      return [] as string[];
    }

    const recommended = new Set<string>();

    if (selectedPlant.condition === "fragile") {
      recommended.add("moisture-meter");
      recommended.add("heat-pack");
    }

    if (selectedPlant.collections.includes("rare-finds")) {
      recommended.add("fertilizer");
    }

    if (selectedPlant.collections.includes("tropicals")) {
      recommended.add("soil");
      recommended.add("moisture-meter");
    }

    if (recommended.size === 0) {
      recommended.add("soil");
    }

    return [...recommended];
  }, [selectedPlant]);
  const sortedExtras = useMemo(
    () =>
      [...extras].sort((left, right) => {
        const leftRecommended = recommendedExtraIds.includes(left.id);
        const rightRecommended = recommendedExtraIds.includes(right.id);

        if (leftRecommended === rightRecommended) {
          return left.price - right.price;
        }

        return leftRecommended ? -1 : 1;
      }),
    [extras, recommendedExtraIds]
  );
  const pricing = useMemo(
    () =>
      calculateBundlePricing({
        plant: selectedPlant,
        plantVariantSize: selectedPlantVariantSize,
        pot: selectedPot,
        extras: selectedExtras
      }),
    [selectedPlant, selectedPlantVariantSize, selectedPot, selectedExtras]
  );

  const canAddBundle = Boolean(selectedPlant && selectedPot);
  const canAccessStep = (targetStep: number) => {
    if (targetStep === 1) {
      return true;
    }

    if (targetStep === 2) {
      return Boolean(selectedPlant);
    }

    return Boolean(selectedPlant && selectedPot);
  };

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!editKey && !hasInitializedFreshMode.current) {
      hasInitializedFreshMode.current = true;
      reset();
    }
  }, [editKey, isHydrated, reset]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (editingCartKey && editKey !== editingCartKey) {
      clearEditingState();
    }
  }, [clearEditingState, editKey, editingCartKey, isHydrated]);

  const saveSelectedBundle = () => {
    if (!selectedPlant || !selectedPot) {
      return false;
    }

    const payload = {
      plant: selectedPlant,
      plantVariantSize: selectedPlantVariantSize ?? selectedPlant.sizes[0],
      pot: selectedPot,
      extras: selectedExtras,
      unitPrice: pricing.total,
      discount: pricing.discount,
      quantity
    };

    if (editingCartKey) {
      replaceBundleInCart(editingCartKey, payload);
      clearEditingState();
    } else {
      addBundleToCart(payload);
    }

    return true;
  };

  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {["Select Plant", "Select Pot", "Extras"].map((stepLabel) => (
            <div
              key={stepLabel}
              className="rounded-[1.75rem] border border-black/5 bg-white px-5 py-4"
            >
              <div className="premium-skeleton animate-shimmer h-3 w-14 rounded-full" />
              <div className="premium-skeleton animate-shimmer mt-3 h-8 w-36 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-card"
              >
                <div className="premium-skeleton animate-shimmer h-56 w-full rounded-[1.5rem]" />
                <div className="mt-4 space-y-3">
                  <div className="premium-skeleton animate-shimmer h-6 w-2/3 rounded-xl" />
                  <div className="premium-skeleton animate-shimmer h-4 w-1/2 rounded-xl" />
                  <div className="premium-skeleton animate-shimmer h-4 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
          <BundleSummarySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BundleProgress
        currentStep={step}
        canAccessStep={canAccessStep}
        onStepClick={(nextStep) => {
          if (canAccessStep(nextStep)) {
            setStep(nextStep);
          }
        }}
      />

      <div className="grid gap-12 lg:grid-cols-[0.66fr_0.34fr] lg:items-start">
        <div className="space-y-8">
          {step === 1 ? (
            <section className="space-y-5">
              <div className="flex items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="font-[family:var(--font-heading)] text-3xl leading-tight tracking-[-0.03em] text-[#486730]">
                    The Living Archive
                  </h2>
                  <p className="max-w-md text-sm leading-7 text-bark/80">
                    Filter through our catalog of curated species. Each plant is selected and
                    staged specifically for collectors.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 border-b border-[#777777]/35 pb-1 font-[family:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#474747] transition hover:text-[#486730]"
                >
                  <span>Filters</span>
                  <span className="material-symbols-outlined text-sm">tune</span>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {plants.map((plant) => (
                  <BundleOptionCard
                    key={plant.id}
                    title={plant.name === "Indoor Olive Tree" ? "Olea Europaea" : plant.name}
                    subtitle={`Level: ${
                      plant.condition === "fragile"
                        ? plant.plantSize === "Large"
                          ? "Enthusiast"
                          : "Intermediate"
                        : plant.plantSize === "Small"
                          ? "Beginner"
                          : "Intermediate"
                    }`}
                    priceLabel={formatCurrency(getPriceForSize(plant, plant.sizes[0]))}
                    image={specimenImageMap[plant.id] ?? plant.images[0]}
                    badge={plant.tag === "Best Seller" ? "Rare Find" : plant.tag}
                    selected={selectedPlant?.id === plant.id}
                    onClick={() => selectPlant(plant)}
                    expandedContent={
                      selectedPlant?.id === plant.id ? (
                        <div className="space-y-3">
                          <p className="font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#474747]/60">
                            Select Size
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {plant.variants
                              .filter((variant) => variant.inStock)
                              .map((variant) => (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    selectPlantVariantSize(variant.size);
                                  }}
                                  className={`px-3 py-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] transition ${
                                    selectedPlantVariantSize === variant.size
                                      ? "bg-[#486730] text-white"
                                      : "border border-[#777777]/20 bg-white text-[#474747] hover:border-[#486730]"
                                  }`}
                                >
                                  {variant.size} · {formatCurrency(variant.price)}
                                </button>
                              ))}
                          </div>
                        </div>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className="font-[family:var(--font-heading)] text-3xl leading-tight tracking-[-0.03em] text-[#486730]">
                  Choose Vessel
                </h2>
                <p className="text-sm leading-7 text-bark/80">
                  Only compatible pots are shown for your selected {selectedPlantVariantSize ?? selectedPlant?.sizes[0]} plant.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {availablePots.map((pot) => (
                  <BundleOptionCard
                    key={pot.id}
                    title={pot.name}
                    subtitle={`Fits ${pot.fits.join(" / ")}`}
                    priceLabel={formatCurrency(pot.price)}
                    image={pot.images[0]}
                    badge={
                      resolvedPlantFitSize && pot.fits.length === 1 && pot.fits[0] === resolvedPlantFitSize
                        ? "Best Match"
                        : `Fits ${resolvedPlantFitSize ?? selectedPlant?.plantSize}`
                    }
                    selected={selectedPot?.id === pot.id}
                    onClick={() => selectPot(pot)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className="font-[family:var(--font-heading)] text-3xl leading-tight tracking-[-0.03em] text-[#486730]">
                  Final Review
                </h2>
                <p className="text-sm leading-7 text-bark/80">
                  Add finishing extras to complete the bundle. Recommended items float to the top based on your plant style, and any extra still triggers the 10% bundle discount.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedExtras.map((extra) => (
                  <BundleOptionCard
                    key={extra.id}
                    title={extra.name}
                    subtitle={
                      recommendedExtraIds.includes(extra.id)
                        ? "Recommended for this bundle"
                        : "Bundle add-on"
                    }
                    priceLabel={formatCurrency(extra.price)}
                    image={extra.images[0]}
                    badge={recommendedExtraIds.includes(extra.id) ? "Suggested" : undefined}
                    selected={selectedExtras.some((item) => item.id === extra.id)}
                    onClick={() => toggleExtra(extra)}
                  />
                ))}
              </div>
            </section>
          ) : null}

        </div>

        <BundleSummary
          currentStep={step}
          plant={selectedPlant}
          plantVariantSize={selectedPlantVariantSize}
          pot={selectedPot}
          extras={selectedExtras}
          pricing={pricing}
          canAddBundle={canAddBundle}
          editingCartKey={editingCartKey}
          onPrimaryAction={() => {
            if (step === 1 && selectedPlant) {
              setStep(2);
              return;
            }

            if (step === 2 && selectedPlant && selectedPot) {
              setStep(3);
              return;
            }

            void saveSelectedBundle();
          }}
          onAddBundleAndViewCart={() => {
            if (saveSelectedBundle()) {
              router.push("/cart");
            }
          }}
        />
      </div>
    </div>
  );
}
