"use client";

import Link from "next/link";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { WishlistItem } from "@/components/wishlist-item";
import { useWishlist } from "@/components/wishlist-provider";
import { getAllPlants } from "@/lib/data";

export function WishlistPageClient() {
  const { wishlistIds, isReady } = useWishlist();
  const wishlistProducts = getAllPlants().filter((product) =>
    wishlistIds.includes(product.id)
  );

  if (!isReady) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">Your wishlist is waiting.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">
          Save the plants you love and come back to them anytime.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          Browse Plants
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {wishlistProducts.map((product) => (
        <WishlistItem key={product.id} product={product} />
      ))}
    </div>
  );
}
