"use client";

import { useMemo, useState } from "react";
import { BundleOptionCard } from "@/components/bundle-option-card";
import { BundleProgress } from "@/components/bundle-progress";
import { BundleSummary } from "@/components/bundle-summary";
import { getAllExtras, getPotsByPlantSize, getPriceForSize } from "@/lib/data";
import { calculateBundlePricing } from "@/lib/bundle";
import { formatCurrency } from "@/lib/format";
import type { CatalogExtra, CatalogPlant, CatalogPot } from "@/lib/types";

type BundleWizardProps = {
  plants: CatalogPlant[];
};

export function BundleWizard({ plants }: BundleWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedPlant, setSelectedPlant] = useState<CatalogPlant | null>(null);
  const [selectedPot, setSelectedPot] = useState<CatalogPot | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<CatalogExtra[]>([]);

  const availablePots = useMemo(
    () => (selectedPlant ? getPotsByPlantSize(selectedPlant.plantSize) : []),
    [selectedPlant]
  );
  const extras = useMemo(() => getAllExtras(), []);
  const pricing = useMemo(
    () =>
      calculateBundlePricing({
        plant: selectedPlant,
        pot: selectedPot,
        extras: selectedExtras
      }),
    [selectedPlant, selectedPot, selectedExtras]
  );

  const toggleExtra = (extra: CatalogExtra) => {
    setSelectedExtras((current) =>
      current.some((item) => item.id === extra.id)
        ? current.filter((item) => item.id !== extra.id)
        : [...current, extra]
    );
  };

  const handlePlantSelect = (plant: CatalogPlant) => {
    setSelectedPlant(plant);
    setSelectedPot((currentPot) =>
      currentPot && currentPot.fits.includes(plant.plantSize) ? currentPot : null
    );
    setStep(2);
  };

  const handlePotSelect = (pot: CatalogPot) => {
    setSelectedPot(pot);
    setStep(3);
  };

  const canContinueFromStep1 = Boolean(selectedPlant);
  const canContinueFromStep2 = Boolean(selectedPot);

  return (
    <div className="space-y-8">
      <BundleProgress currentStep={step} />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          {step === 1 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage">
                  Step 1
                </p>
                <h2 className="font-[family:var(--font-heading)] text-4xl leading-tight">
                  Pick the plant that sets the tone.
                </h2>
                <p className="text-sm leading-7 text-bark/80">
                  Choose a plant first. We will match the next step’s pot options to its size automatically.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {plants.map((plant) => (
                  <BundleOptionCard
                    key={plant.id}
                    title={plant.name}
                    subtitle={`${plant.plantSize} plant · ${plant.condition}`}
                    priceLabel={formatCurrency(getPriceForSize(plant, plant.sizes[0]))}
                    image={plant.images[0]}
                    badge={plant.tag}
                    selected={selectedPlant?.id === plant.id}
                    onClick={() => handlePlantSelect(plant)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage">
                  Step 2
                </p>
                <h2 className="font-[family:var(--font-heading)] text-4xl leading-tight">
                  Pair it with a matching pot.
                </h2>
                <p className="text-sm leading-7 text-bark/80">
                  Only compatible pots are shown for your selected {selectedPlant?.plantSize.toLowerCase()} plant.
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
                    badge={`Fits-${selectedPlant?.plantSize}`}
                    selected={selectedPot?.id === pot.id}
                    onClick={() => handlePotSelect(pot)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage">
                  Step 3
                </p>
                <h2 className="font-[family:var(--font-heading)] text-4xl leading-tight">
                  Finish with thoughtful extras.
                </h2>
                <p className="text-sm leading-7 text-bark/80">
                  Add soil, fertilizer, or a moisture meter. Any extra added to a plant-and-pot bundle triggers the 10% discount.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {extras.map((extra) => (
                  <BundleOptionCard
                    key={extra.id}
                    title={extra.name}
                    subtitle="Bundle add-on"
                    priceLabel={formatCurrency(extra.price)}
                    image={extra.images[0]}
                    selected={selectedExtras.some((item) => item.id === extra.id)}
                    onClick={() => toggleExtra(extra)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(3, current + 1))}
                disabled={(step === 1 && !canContinueFromStep1) || (step === 2 && !canContinueFromStep2)}
                className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSelectedPlant(null);
                  setSelectedPot(null);
                  setSelectedExtras([]);
                }}
                className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b]"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        <BundleSummary
          plant={selectedPlant}
          pot={selectedPot}
          extras={selectedExtras}
          pricing={pricing}
        />
      </div>
    </div>
  );
}
