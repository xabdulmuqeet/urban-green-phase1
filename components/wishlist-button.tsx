"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "urban-green-wishlist";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const wishlist = stored ? (JSON.parse(stored) as string[]) : [];
    setIsWishlisted(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = () => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const wishlist = stored ? (JSON.parse(stored) as string[]) : [];
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWishlist));
    setIsWishlisted(nextWishlist.includes(productId));
  };

  return (
    <button
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isWishlisted}
      onClick={toggleWishlist}
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/90 text-lg transition hover:border-sage/40 ${className}`}
    >
      <span className={isWishlisted ? "text-terracotta" : "text-bark"}>♥</span>
    </button>
  );
}
