"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type {
  BundleSelection,
  CatalogExtra,
  CatalogPot
} from "@/lib/types";
import type { Product } from "@/lib/types";

const defaultSelection: BundleSelection = {
  step: 1,
  plantId: null,
  potId: null,
  extraIds: []
};

export function useBundleBuilder({
  plants,
  pots,
  extras
}: {
  plants: Product[];
  pots: CatalogPot[];
  extras: CatalogExtra[];
}) {
  const { value, setValue } = useLocalStorage<BundleSelection>(
    "urban-green-bundle-builder",
    defaultSelection
  );

  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.id === value.plantId) ?? null,
    [plants, value.plantId]
  );
  const selectedPot = useMemo(
    () => pots.find((pot) => pot.id === value.potId) ?? null,
    [pots, value.potId]
  );
  const selectedExtras = useMemo(
    () => extras.filter((extra) => value.extraIds.includes(extra.id)),
    [extras, value.extraIds]
  );

  return {
    step: value.step || 1,
    selectedPlant,
    selectedPot,
    selectedExtras,
    setStep: (step: number) => setValue((current) => ({ ...current, step })),
    selectPlant: (plant: Product) =>
      setValue((current) => ({
        ...current,
        plantId: plant.id,
        potId:
          current.potId && pots.find((pot) => pot.id === current.potId)?.fits.includes(plant.plantSize)
            ? current.potId
            : null,
        step: 2
      })),
    selectPot: (pot: CatalogPot) =>
      setValue((current) => ({
        ...current,
        potId: pot.id,
        step: 3
      })),
    toggleExtra: (extra: CatalogExtra) =>
      setValue((current) => ({
        ...current,
        extraIds: current.extraIds.includes(extra.id)
          ? current.extraIds.filter((id) => id !== extra.id)
          : [...current.extraIds, extra.id]
      })),
    reset: () => setValue(defaultSelection)
  };
}
