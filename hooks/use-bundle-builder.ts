"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type {
  BundleCartItem,
  BundleSelection,
  CatalogExtra,
  CatalogPot
} from "@/lib/types";
import type { Product } from "@/lib/types";

export const BUNDLE_SELECTION_STORAGE_KEY = "urban-green-bundle-builder";

const defaultSelection: BundleSelection = {
  step: 1,
  plantId: null,
  potId: null,
  extraIds: [],
  quantity: 1,
  editingCartKey: null
};

export function createBundleSelectionFromCartItem(item: BundleCartItem): BundleSelection {
  return {
    step: 3,
    plantId: item.bundle.plantId,
    potId: item.bundle.potId,
    extraIds: item.bundle.extraIds,
    quantity: item.quantity,
    editingCartKey: item.cartKey
  };
}

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
    BUNDLE_SELECTION_STORAGE_KEY,
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
    quantity: value.quantity || 1,
    editingCartKey: value.editingCartKey,
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
    clearEditingState: () =>
      setValue((current) => ({
        ...current,
        editingCartKey: null,
        quantity: 1
      })),
    reset: () => setValue(defaultSelection)
  };
}
