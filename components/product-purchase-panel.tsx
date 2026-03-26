"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CareTabs } from "@/components/care-tabs";
import { useCart } from "@/components/cart-provider";
import { SizeSelector } from "@/components/size-selector";
import { WishlistButton } from "@/components/wishlist-button";
import { getPriceForSize } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useProductSelection } from "@/hooks/use-product-selection";
import type { Product, ProductSizeLabel } from "@/lib/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { selectedSize, quantity, setSelectedSize, setQuantity } = useProductSelection(product);
  const { addToCart } = useCart();

  const resolvedSize = useMemo(
    () =>
      (product.sizes.find((size) => size === selectedSize) ?? product.sizes[0]) as ProductSizeLabel,
    [product.sizes, selectedSize]
  );

  return (
    <div className="space-y-7 lg:space-y-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">
              {product.category}
            </p>
            <h1 className="font-[family:var(--font-heading)] text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>
          </div>
          <WishlistButton productId={product.id} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold leading-none text-terracotta">
            {formatCurrency(getPriceForSize(product, resolvedSize))}
          </p>
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-bark">
            {product.condition}
          </span>
        </div>

        <p className="max-w-xl text-base leading-6 text-bark/80 sm:text-[17px]">
          {product.description}
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-cream/60 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
          Why we love it
        </p>
        <p className="mt-3 text-sm leading-5 text-bark/80">
          Sculptural shape, premium foliage, and an elevated presentation that makes any room feel calmer and more intentional.
        </p>
      </div>

      <SizeSelector
        sizes={product.sizes}
        prices={product.prices}
        selectedSize={resolvedSize}
        onSelect={setSelectedSize}
      />

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">Quantity</p>
        <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-3 py-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-bark"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-bark"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            addToCart({
              product,
              size: resolvedSize,
              unitPrice: getPriceForSize(product, resolvedSize),
              quantity
            })
          }
          className="rounded-full bg-terracotta px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#cd624b]"
        >
          Add To Cart
        </button>
        <Link
          href="/cart"
          className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:border-sage hover:text-sage"
        >
          View Cart
        </Link>
        <Link
          href="/wishlist"
          className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:border-sage hover:text-sage"
        >
          View Wishlist
        </Link>
      </div>

      <CareTabs care={product.care} />
    </div>
  );
}
