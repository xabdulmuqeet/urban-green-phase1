"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { fetchCartFromApi, saveCartToApi } from "@/lib/api-client";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getPlantById, getVariantBySize } from "@/lib/data";
import type {
  BundleCartItem,
  CartItem,
  CatalogExtra,
  CatalogPot,
  Product,
  ProductCartItem
} from "@/lib/types";

type AddToCartPayload = {
  product: Product;
  size: Product["sizes"][number];
  unitPrice: number;
  quantity: number;
};

type AddBundleToCartPayload = {
  plant: Product;
  plantVariantSize: Product["sizes"][number];
  pot: CatalogPot;
  extras: CatalogExtra[];
  unitPrice: number;
  discount: number;
  quantity?: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  isReady: boolean;
  addToCart: (payload: AddToCartPayload) => void;
  addBundleToCart: (payload: AddBundleToCartPayload) => void;
  replaceBundleInCart: (cartKeyToReplace: string, payload: AddBundleToCartPayload) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createProductCartKey(productId: string, size: string) {
  return `product:${productId}:${size}`;
}

function createBundleCartKey(
  plantId: string,
  plantVariantSize: string,
  potId: string,
  extraIds: string[]
) {
  return `bundle:${plantId}:${plantVariantSize}:${potId}:${[...extraIds].sort().join(",")}`;
}

function buildBundleCartItem({
  plant,
  plantVariantSize,
  pot,
  extras,
  unitPrice,
  discount,
  quantity = 1
}: AddBundleToCartPayload): BundleCartItem {
  const extraIds = extras.map((extra) => extra.id);

  return {
    kind: "bundle",
    cartKey: createBundleCartKey(plant.id, plantVariantSize, pot.id, extraIds),
    image: plant.images[0],
    quantity,
    unitPrice,
    bundle: {
      plantId: plant.id,
      plantSize: plant.plantSize,
      plantVariantSize,
      potId: pot.id,
      extraIds,
      discount
    }
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const hasLoadedBackendCart = useRef(false);
  const skipNextSave = useRef(false);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const { value: cartItems, setValue: setCartItems, isHydrated } = useLocalStorage<CartItem[]>(
    "urban-green-cart",
    []
  );

  useEffect(() => {
    if (!isHydrated || status !== "authenticated" || hasLoadedBackendCart.current) {
      return;
    }

    setIsBackendReady(false);
    let isCancelled = false;

    const loadCart = async () => {
      try {
        const response = await fetchCartFromApi();

        if (!isCancelled) {
          skipNextSave.current = true;
          setCartItems(response.items.map((item) =>
            item.type === "single"
              ? (() => {
                  const product = getPlantById(item.productId);
                  const variant = product ? getVariantBySize(product, item.size) : null;

                  return {
                    kind: "product" as const,
                    cartKey: createProductCartKey(item.productId, item.size),
                    productId: item.productId,
                    variantId: variant?.id ?? `${item.productId}-${item.size}`,
                    name: product?.name ?? item.productId,
                    image: product?.images[0] ?? "/products/hero-plant.svg",
                    size: item.size,
                    condition: product?.condition ?? "hardy",
                    unitPrice: item.price,
                    quantity: item.quantity
                  };
                })()
              : (() => {
                  const plant = getPlantById(item.bundle.plant);

                  return {
                    kind: "bundle" as const,
                    cartKey: createBundleCartKey(
                      item.bundle.plant,
                      item.bundle.size,
                      item.bundle.pot,
                      item.bundle.extras
                    ),
                    image: plant?.images[0] ?? "/products/hero-plant.svg",
                    quantity: item.quantity,
                    unitPrice: item.bundle.totalPrice,
                    bundle: {
                      plantId: item.bundle.plant,
                      plantSize: plant?.plantSize ?? "Medium",
                      plantVariantSize: item.bundle.size,
                      potId: item.bundle.pot,
                      extraIds: item.bundle.extras,
                      discount: item.bundle.discount
                    }
                  };
                })()
          ));
        }
      } catch {
        // Keep local fallback cart when backend sync is unavailable.
      } finally {
        hasLoadedBackendCart.current = true;
        if (!isCancelled) {
          setIsBackendReady(true);
        }
      }
    };

    void loadCart();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated, setCartItems, status]);

  useEffect(() => {
    if (!isHydrated || status !== "authenticated" || !hasLoadedBackendCart.current || !session) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    void saveCartToApi(cartItems).catch(() => {
      // Local cart remains the fallback source if API sync fails.
    });
  }, [cartItems, isHydrated, session, status]);

  const contextValue = useMemo<CartContextValue>(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    return {
      cartItems,
      totalItems,
      totalPrice,
      isReady: isHydrated && (status !== "authenticated" || isBackendReady),
      addToCart: ({ product, size, unitPrice, quantity }) =>
        setCartItems((currentItems) => {
          const cartKey = createProductCartKey(product.id, size);
          const existingItem = currentItems.find((item) => item.cartKey === cartKey);

          if (existingItem) {
            return currentItems.map((item) =>
              item.cartKey === cartKey
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          const variant = getVariantBySize(product, size);
          const nextItem: ProductCartItem = {
            kind: "product",
            cartKey,
            productId: product.id,
            variantId: variant?.id ?? `${product.id}-${size}`,
            name: product.name,
            image: product.images[0],
            size,
            condition: product.condition,
            unitPrice,
            quantity
          };

          return [...currentItems, nextItem];
        }),
      addBundleToCart: (payload) =>
        setCartItems((currentItems) => {
          const nextItem = buildBundleCartItem(payload);
          const cartKey = nextItem.cartKey;
          const existingItem = currentItems.find((item) => item.cartKey === cartKey);

          if (existingItem) {
            return currentItems.map((item) =>
              item.cartKey === cartKey
                ? { ...item, quantity: item.quantity + nextItem.quantity }
                : item
            );
          }

          return [...currentItems, nextItem];
        }),
      replaceBundleInCart: (cartKeyToReplace, payload) =>
        setCartItems((currentItems) => {
          const nextItem = buildBundleCartItem(payload);
          const remainingItems = currentItems.filter((item) => item.cartKey !== cartKeyToReplace);
          const existingItem = remainingItems.find((item) => item.cartKey === nextItem.cartKey);

          if (existingItem) {
            return remainingItems.map((item) =>
              item.cartKey === nextItem.cartKey
                ? { ...item, quantity: item.quantity + nextItem.quantity }
                : item
            );
          }

          return [...remainingItems, nextItem];
        }),
      updateQuantity: (cartKey, quantity) =>
        setCartItems((currentItems) =>
          currentItems
            .map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        ),
      removeFromCart: (cartKey) =>
        setCartItems((currentItems) =>
          currentItems.filter((item) => item.cartKey !== cartKey)
        ),
      clearCart: () => setCartItems([])
    };
  }, [cartItems, isBackendReady, isHydrated, setCartItems, status]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
