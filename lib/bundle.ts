import { getPriceForSize } from "@/lib/data";
import type { CatalogExtra, CatalogPot, Product, ProductSizeLabel } from "@/lib/types";

export const BUNDLE_DISCOUNT_RATE = 0.1;

export type BundlePricing = {
  plantPrice: number;
  potPrice: number;
  extrasPrice: number;
  subtotal: number;
  discount: number;
  total: number;
};

export function calculateBundlePricing({
  plant,
  plantVariantSize,
  pot,
  extras
}: {
  plant: Product | null;
  plantVariantSize: ProductSizeLabel | null;
  pot: CatalogPot | null;
  extras: CatalogExtra[];
}): BundlePricing {
  const resolvedSize = plant && plantVariantSize ? plantVariantSize : plant?.sizes[0];
  const plantPrice = plant && resolvedSize ? getPriceForSize(plant, resolvedSize) : 0;
  const potPrice = pot?.price ?? 0;
  const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
  const subtotal = plantPrice + potPrice + extrasPrice;
  const discount = plant && pot && extras.length > 0 ? subtotal * BUNDLE_DISCOUNT_RATE : 0;

  return {
    plantPrice,
    potPrice,
    extrasPrice,
    subtotal,
    discount,
    total: subtotal - discount
  };
}
