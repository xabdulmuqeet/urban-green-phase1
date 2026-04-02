"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { fetchWishlistFromApi, saveWishlistToApi } from "@/lib/api-client";
import { useLocalStorage } from "@/hooks/use-local-storage";

type WishlistContextValue = {
  wishlistIds: string[];
  isReady: boolean;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const hasLoadedBackendWishlist = useRef(false);
  const skipNextSave = useRef(false);
  const hasMergedLocalWishlist = useRef(false);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const { value: wishlistIds, setValue: setWishlistIds, isHydrated } = useLocalStorage<string[]>(
    "urban-green-wishlist",
    []
  );

  useEffect(() => {
    if (!isHydrated || status !== "authenticated" || hasLoadedBackendWishlist.current) {
      return;
    }

    setIsBackendReady(false);
    let isCancelled = false;

    const loadWishlist = async () => {
      try {
        const response = await fetchWishlistFromApi();

        if (!isCancelled) {
          const localIds = wishlistIds;
          const mergedWishlistIds = [...new Set([...response.wishlistIds, ...localIds])];

          skipNextSave.current = true;
          hasMergedLocalWishlist.current = true;
          setWishlistIds(mergedWishlistIds);

          if (mergedWishlistIds.length !== response.wishlistIds.length) {
            void saveWishlistToApi(mergedWishlistIds).catch(() => {
              // Keep local wishlist if backend sync fails.
            });
          }
        }
      } catch {
        // Keep local wishlist when backend sync is unavailable.
      } finally {
        hasLoadedBackendWishlist.current = true;
        if (!isCancelled) {
          setIsBackendReady(true);
        }
      }
    };

    void loadWishlist();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated, setWishlistIds, status, wishlistIds]);

  useEffect(() => {
    if (status !== "authenticated") {
      hasLoadedBackendWishlist.current = false;
      hasMergedLocalWishlist.current = false;
      setIsBackendReady(true);
      return;
    }

    if (!isHydrated || !session || !hasLoadedBackendWishlist.current) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (!hasMergedLocalWishlist.current) {
      return;
    }

    void saveWishlistToApi(wishlistIds).catch(() => {
      // Local wishlist remains the fallback if API sync fails.
    });
  }, [isHydrated, session, status, wishlistIds]);

  const contextValue = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      isReady: isHydrated && (status !== "authenticated" || isBackendReady),
      toggleWishlist: (productId) =>
        setWishlistIds((current) =>
          current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId]
        ),
      isWishlisted: (productId) => wishlistIds.includes(productId)
    }),
    [isBackendReady, isHydrated, setWishlistIds, status, wishlistIds]
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
