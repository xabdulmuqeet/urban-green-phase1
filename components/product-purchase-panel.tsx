"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CareTabs } from "@/components/care-tabs";
import { useCart } from "@/components/cart-provider";
import { SizeSelector } from "@/components/size-selector";
import { WishlistButton } from "@/components/wishlist-button";
import { getDefaultSize, getPriceForSize, getVariantBySize } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useProductSelection } from "@/hooks/use-product-selection";
import type { Product, ProductSizeLabel } from "@/lib/types";

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
  };

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

      <div className="rounded-[2.2rem] border border-black/5 bg-white p-6 shadow-card sm:p-7">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-semibold leading-none text-terracotta">
              {formatCurrency(getPriceForSize(product, resolvedSize))}
            </p>
            <span className="rounded-full border border-black/10 bg-cream/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-bark">
              {reviewCount > 0
                ? `${averageRating.toFixed(1)} / 5 · ${reviewCount} Review${reviewCount === 1 ? "" : "s"}`
                : "No Reviews Yet"}
            </span>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-bark">
              {product.condition}
            </span>
            {selectedVariant && !selectedVariant.inStock ? (
              <span className="rounded-full border border-terracotta/20 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                Out of stock
              </span>
            ) : null}
          </div>

          <div className="space-y-4 border-t border-black/5 pt-5">
            <SizeSelector
              sizes={product.sizes}
              prices={product.prices}
              selectedSize={resolvedSize}
              onSelect={setSelectedSize}
            />
          </div>

          <div className="space-y-4 border-t border-black/5 pt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">Quantity</p>
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-cream/35 px-3 py-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-bark shadow-sm"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-bark shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3 border-t border-black/5 pt-5">
            <button
              type="button"
              onClick={addCurrentSelectionToCart}
              disabled={selectedVariant?.inStock === false}
              className="w-full rounded-full bg-terracotta px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {selectedVariant?.inStock === false ? "Out Of Stock" : "Add To Cart"}
            </button>
            <button
              type="button"
              onClick={() => {
                addCurrentSelectionToCart();
                router.push("/cart");
              }}
              disabled={selectedVariant?.inStock === false}
              className="w-full rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:border-sage hover:text-sage disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
            <div className="flex flex-wrap items-center gap-4 border-t border-black/5 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-bark/62">
              <Link href="/cart" className="transition hover:text-sage">
                View Cart
              </Link>
              <span className="h-1 w-1 rounded-full bg-bark/25" />
              <Link href="/wishlist" className="transition hover:text-sage">
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CareTabs care={product.care} />
    </div>
  );
}
