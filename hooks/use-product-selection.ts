"use client";

import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Product, ProductSelection } from "@/lib/types";

export function useProductSelection(product: Product) {
  const defaultSelection: ProductSelection = {
    size: product.sizes[0]?.label ?? "",
    quantity: 1
  };

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
    selectedSize: value.size || defaultSelection.size,
    quantity: value.quantity || 1,
    setSelectedSize: (size: string) => setValue((current) => ({ ...current, size })),
    setQuantity: (quantity: number) =>
      setValue((current) => ({ ...current, quantity: Math.max(1, quantity) }))
  };
}
