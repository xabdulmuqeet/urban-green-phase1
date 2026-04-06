"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { WishlistButton } from "@/components/wishlist-button";
import { useTransientFlag } from "@/hooks/use-transient-flag";
import { getDefaultSize, getPriceForSize, getStartingPrice } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Product, ProductSizeLabel } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  showActions?: boolean;
};

export function ProductCard({ product, showActions = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isActive: showAddedState, trigger: triggerAddedState } = useTransientFlag();

  const defaultSize = getDefaultSize(product);
  const [selectedSize, setSelectedSize] = useState<ProductSizeLabel>(defaultSize);
  const selectedPrice = getPriceForSize(product, selectedSize);

  const handleAddToCart = () => {
    addToCart({
      product,
      size: selectedSize,
      unitPrice: selectedPrice,
      quantity: 1
    });
    triggerAddedState();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="group relative rounded-[1.75rem] bg-transparent transition duration-300 hover:-translate-y-1">
      <WishlistButton productId={product.id} className="absolute right-4 top-4 z-20" />

      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-[1.65rem] bg-[#eef1ea]">
          <div className="absolute left-4 top-4 z-10 rounded-full bg-[#f8faf5]/92 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#486730]">
            {product.tag}
          </div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={800}
            height={900}
            className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>

        <div className="space-y-4 px-1 pb-1 pt-5">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-bark/58">
              {product.category}
            </p>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/82">
              {product.condition}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3 className="max-w-[72%] font-[family:var(--font-heading)] text-[1.8rem] leading-[1.05] tracking-[-0.03em] text-foreground">
              {product.name}
            </h3>
            <div className="pt-1 text-right">
              <p className="text-base font-semibold text-terracotta">
                {showActions ? formatCurrency(selectedPrice) : formatCurrency(getStartingPrice(product))}
              </p>
              {!showActions ? (
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-bark/52">
                  From
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.variants
              .filter((variant) => variant.inStock)
              .map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setSelectedSize(variant.size);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                    selectedSize === variant.size
                      ? "bg-[#516448] text-white"
                      : "bg-cream/90 text-bark/72 hover:bg-[#e4e8df]"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
          </div>
        </div>
      </Link>

      {showActions ? (
        <div className="mt-4 grid grid-cols-2 gap-2 px-1 pb-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-white px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground shadow-[0_10px_22px_rgba(62,79,55,0.06)] transition hover:bg-cream/90"
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {showAddedState ? (
                <>
                  <span className="material-symbols-outlined text-sm leading-none">check</span>
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="rounded-full bg-terracotta px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#486730]"
          >
            Buy Now
          </button>
        </div>
      ) : null}
    </div>
  );
}
