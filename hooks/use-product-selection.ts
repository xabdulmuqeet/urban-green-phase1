"use client";

import { useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Product, ProductSelection, ProductSizeLabel } from "@/lib/types";

export function useProductSelection(product: Product) {
  const defaultSelection = useMemo<ProductSelection>(
    () => ({
      size: product.sizes[0] ?? "",
      quantity: 1
    }),
    [product.sizes]
  );

  const { value, setValue, isHydrated } = useLocalStorage<ProductSelection>(
    `urban-green-selection-${product.id}`,
    defaultSelection
  );

  useEffect(() => {
    if (!isHydrated || value.size) {
      return;
    }

    setValue(defaultSelection);
  }, [defaultSelection, isHydrated, setValue, value.size]);

  return {
    selectedSize: (value.size || defaultSelection.size) as ProductSizeLabel,
    quantity: value.quantity || 1,
    setSelectedSize: (size: ProductSizeLabel) => setValue((current) => ({ ...current, size })),
    setQuantity: (quantity: number) =>
      setValue((current) => ({ ...current, quantity: Math.max(1, quantity) }))
  };
}
