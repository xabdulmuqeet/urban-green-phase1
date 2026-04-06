"use client";

import { useCallback, useMemo } from "react";
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
  plantVariantSize: null,
  potId: null,
  extraIds: [],
  quantity: 1,
  editingCartKey: null
};

export function createBundleSelectionFromCartItem(item: BundleCartItem): BundleSelection {
  return {
    step: 3,
    plantId: item.bundle.plantId,
    plantVariantSize: item.bundle.plantVariantSize,
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
  const { value, setValue, isHydrated } = useLocalStorage<BundleSelection>(
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

  const setStep = useCallback(
    (step: number) => setValue((current) => ({ ...current, step })),
    [setValue]
  );

  const toFitSize = useCallback((size: Product["sizes"][number]) => {
    if (size === '4"') {
      return "Small" as const;
    }

    if (size === '6"') {
      return "Medium" as const;
    }

    return "Large" as const;
  }, []);

  const selectPlant = useCallback(
    (plant: Product) =>
      setValue((current) => {
        const nextVariantSize =
          current.plantId === plant.id ? current.plantVariantSize ?? plant.sizes[0] : plant.sizes[0];
        const nextFitSize = toFitSize(nextVariantSize);

        return {
          ...current,
          plantId: plant.id,
          plantVariantSize: nextVariantSize,
          potId:
            current.potId && pots.find((pot) => pot.id === current.potId)?.fits.includes(nextFitSize)
              ? current.potId
              : null,
          step: 1
        };
      }),
    [pots, setValue, toFitSize]
  );

  const selectPlantVariantSize = useCallback(
    (size: Product["sizes"][number]) =>
      setValue((current) => ({
        ...current,
        plantVariantSize: size,
        potId:
          current.potId && pots.find((pot) => pot.id === current.potId)?.fits.includes(toFitSize(size))
            ? current.potId
            : null,
        step: current.step
      })),
    [pots, setValue, toFitSize]
  );

  const selectPot = useCallback(
    (pot: CatalogPot) =>
      setValue((current) => ({
        ...current,
        potId: pot.id,
        step: current.step
      })),
    [setValue]
  );

  const toggleExtra = useCallback(
    (extra: CatalogExtra) =>
      setValue((current) => ({
        ...current,
        extraIds: current.extraIds.includes(extra.id)
          ? current.extraIds.filter((id) => id !== extra.id)
          : [...current.extraIds, extra.id]
      })),
    [setValue]
  );

  const clearEditingState = useCallback(
    () =>
      setValue((current) => ({
        ...current,
        editingCartKey: null,
        quantity: 1
      })),
    [setValue]
  );

  const reset = useCallback(() => setValue(defaultSelection), [setValue]);

  return {
    isHydrated,
    step: value.step || 1,
    quantity: value.quantity || 1,
    editingCartKey: value.editingCartKey,
    selectedPlant,
    selectedPlantVariantSize: value.plantVariantSize,
    selectedPot,
    selectedExtras,
    setStep,
    selectPlant,
    selectPlantVariantSize,
    selectPot,
    toggleExtra,
    clearEditingState,
    reset
  };
}
