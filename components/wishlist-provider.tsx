"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type WishlistContextValue = {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { value: wishlistIds, setValue: setWishlistIds } = useLocalStorage<string[]>(
    "urban-green-wishlist",
    []
  );

  const contextValue = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      toggleWishlist: (productId) =>
        setWishlistIds((current) =>
          current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId]
        ),
      isWishlisted: (productId) => wishlistIds.includes(productId)
    }),
    [setWishlistIds, wishlistIds]
  );

  return (
    <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
