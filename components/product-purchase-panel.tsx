"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCart } from "@/components/cart-provider";
import { WishlistButton } from "@/components/wishlist-button";
import { useTransientFlag } from "@/hooks/use-transient-flag";
import { getDefaultSize, getPriceForSize, getVariantBySize } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useProductSelection } from "@/hooks/use-product-selection";
import type { Product, ProductSizeLabel } from "@/lib/types";

function CareIcon({ type }: { type: "light" | "water" | "humidity" | "soil" }) {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "text-[#516448]"
  };

  switch (type) {
    case "light":
      return (
        <svg {...commonProps} aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2.5V5.2M12 18.8V21.5M21.5 12H18.8M5.2 12H2.5M18.72 5.28L16.81 7.19M7.19 16.81L5.28 18.72M18.72 18.72L16.81 16.81M7.19 7.19L5.28 5.28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "water":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 3.5C9.7 6.65 7.5 9.15 7.5 12.15C7.5 14.95 9.57 17 12 17C14.43 17 16.5 14.95 16.5 12.15C16.5 9.15 14.3 6.65 12 3.5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "humidity":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 3V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 17.5C14.49 17.5 16.5 15.49 16.5 13C16.5 11.06 15.23 9.42 13.5 8.81V3H10.5V8.81C8.77 9.42 7.5 11.06 7.5 13C7.5 15.49 9.51 17.5 12 17.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 20.5V21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "soil":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M9.2 7.5C9.2 6.06 10.35 4.9 11.8 4.9C11.8 6.34 10.65 7.5 9.2 7.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7.5V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 10.5H18L16.8 18H7.2L6 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 14.2H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function ProductPurchasePanel({
  product,
  averageRating,
  reviewCount
}: {
  product: Product;
  averageRating: number;
  reviewCount: number;
}) {
  const router = useRouter();
  const { selectedSize, quantity, setSelectedSize, setQuantity } = useProductSelection(product);
  const { addToCart } = useCart();
  const { isActive: showAddedState, trigger: triggerAddedState } = useTransientFlag();
  const defaultSize = getDefaultSize(product);

  const resolvedSize = useMemo(
    () =>
      (product.sizes.find((size) => size === selectedSize) ?? defaultSize) as ProductSizeLabel,
    [defaultSize, product.sizes, selectedSize]
  );
  const selectedVariant = useMemo(
    () => getVariantBySize(product, resolvedSize),
    [product, resolvedSize]
  );

  const addCurrentSelectionToCart = () => {
    addToCart({
      product,
      size: resolvedSize,
      unitPrice: getPriceForSize(product, resolvedSize),
      quantity
    });
    triggerAddedState();
  };

  const sizeCopy: Record<ProductSizeLabel, string> = {
    '4"': '4" Small',
    '6"': '6" Medium',
    '10"': '10" Large'
  };

  const careItems = [
    {
      icon: "light" as const,
      label: "Lighting",
      value: product.care.light
    },
    {
      icon: "water" as const,
      label: "Watering",
      value: product.care.watering
    },
    {
      icon: "humidity" as const,
      label: "Humidity",
      value: product.condition === "fragile" ? "Higher humidity preferred" : "Average indoor levels"
    },
    {
      icon: "soil" as const,
      label: "Soil",
      value: "Well-draining mix"
    }
  ];

  return (
    <div className="space-y-10 lg:space-y-12">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#e1e3de] px-3 py-1 font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#474747]">
                {product.tag}
              </span>
              <span className="bg-[#e1e3de] px-3 py-1 font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#474747]">
                {selectedVariant?.inStock === false ? "Out of Stock" : "In Stock"}
              </span>
            </div>
            <h1 className="font-[family:var(--font-heading)] text-5xl leading-[0.94] tracking-[-0.05em] text-[#486730] sm:text-6xl">
              {product.name}
            </h1>
          </div>
          <WishlistButton productId={product.id} />
        </div>

        <p className="max-w-md font-[family:var(--font-body)] text-[15px] leading-7 text-[#474747]">
          {product.description}
        </p>
      </div>

      <div className="bg-[#f2f4ef] p-8 sm:p-10">
        <div className="space-y-5">
          <div className="flex items-baseline justify-between border-b border-[#777777]/20 pb-4">
            <p className="font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#474747]/60">
              Price
            </p>
            <p className="font-[family:var(--font-heading)] text-3xl leading-none text-[#486730]">
              {formatCurrency(getPriceForSize(product, resolvedSize))}
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <label className="block font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#474747]/60">
              Select Vessel Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.sizes.map((size) => {
                const isSelected = size === resolvedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-4 text-center font-[family:var(--font-body)] text-sm transition ${
                      isSelected
                        ? "border border-[#516448] text-[#516448]"
                        : "border border-[#c6c6c6]/40 text-[#474747] hover:border-[#516448]"
                    }`}
                  >
                    {sizeCopy[size]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#474747]/60">
                Quantity
              </p>
              <span className="font-[family:var(--font-body)] text-[11px] uppercase tracking-[0.18em] text-[#474747]/45">
                {reviewCount > 0
                  ? `${averageRating.toFixed(1)} / 5 · ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
                  : "No reviews yet"}
              </span>
            </div>
            <div className="inline-flex items-center gap-3 border border-[#c6c6c6]/40 bg-white px-3 py-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center border border-[#c6c6c6]/40 bg-white text-[#474747]"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center border border-[#c6c6c6]/40 bg-white text-[#474747]"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={addCurrentSelectionToCart}
              disabled={selectedVariant?.inStock === false}
              className="w-full bg-[#516448] px-7 py-5 text-center font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.18em] text-[#d4e9c5] transition hover:bg-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {selectedVariant?.inStock === false ? (
                "Out Of Stock"
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  {showAddedState ? (
                    <>
                      <span className="material-symbols-outlined text-base leading-none">check</span>
                      <span>Added To Botanical Collection</span>
                    </>
                  ) : (
                    <span>Add To Botanical Collection</span>
                  )}
                </span>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[#474747]/70">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <span className="font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.16em]">
                Carbon Neutral Shipping Included
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#777777]/12 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#474747]/55">
              <button
                type="button"
                onClick={() => {
                  addCurrentSelectionToCart();
                  router.push("/cart");
                }}
                disabled={selectedVariant?.inStock === false}
                className="transition hover:text-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
              >
                View Cart
              </button>
              <span className="h-1 w-1 rounded-full bg-[#474747]/20" />
              <Link href="/wishlist" className="transition hover:text-[#486730]">
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="space-y-2 border-b border-[#777777]/20 pb-6">
          <h3 className="font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.18em] text-[#486730]">
            Care Requirements
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
            {careItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <CareIcon type={item.icon} />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#191c1a]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#474747]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
