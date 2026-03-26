"use client";

import { useWishlist } from "@/components/wishlist-provider";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/90 text-lg transition hover:border-sage/40 ${className}`}
    >
      <span className={active ? "text-terracotta" : "text-bark"}>♥</span>
    </button>
  );
}
