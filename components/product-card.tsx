"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { WishlistButton } from "@/components/wishlist-button";
import { getStartingPrice } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  showActions?: boolean;
};

export function ProductCard({ product, showActions = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const defaultSize = product.sizes.includes('6"') ? '6"' : product.sizes[0];
  const defaultPrice = product.prices[defaultSize];

  const handleAddToCart = () => {
    addToCart({
      product,
      size: defaultSize,
      unitPrice: defaultPrice,
      quantity: 1
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-card transition duration-500 hover:-translate-y-2">
      <WishlistButton productId={product.id} className="absolute right-4 top-4 z-20" />

      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-sage">
            {product.tag}
          </div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={800}
            height={900}
            className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.28em] text-bark/60">
              {product.category}
            </p>
            <span className="rounded-full bg-cream px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bark">
              {product.condition}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-[family:var(--font-heading)] text-2xl leading-tight">
              {product.name}
            </h3>
            <p className="text-sm leading-6 text-bark/75">{product.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-semibold text-terracotta">
              {formatCurrency(getStartingPrice(product))}
            </p>
          </div>
        </div>
      </Link>

      {showActions ? (
        <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row">
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition hover:border-sage hover:text-sage"
          >
            Add To Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="rounded-full bg-terracotta px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b]"
          >
            Buy Now
          </button>
        </div>
      ) : null}
    </div>
  );
}
