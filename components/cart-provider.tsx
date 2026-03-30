"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type {
  BundleCartItem,
  CartItem,
  CatalogExtra,
  CatalogPot,
  Product,
  ProductCartItem
} from "@/lib/types";
import { getVariantBySize } from "@/lib/data";

type AddToCartPayload = {
  product: Product;
  size: Product["sizes"][number];
  unitPrice: number;
  quantity: number;
};

type AddBundleToCartPayload = {
  plant: Product;
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
  addToCart: (payload: AddToCartPayload) => void;
  addBundleToCart: (payload: AddBundleToCartPayload) => void;
  replaceBundleInCart: (cartKeyToReplace: string, payload: AddBundleToCartPayload) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  removeFromCart: (cartKey: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createProductCartKey(productId: string, size: string) {
  return `product:${productId}:${size}`;
}

function createBundleCartKey(
  plantId: string,
  potId: string,
  extraIds: string[]
) {
  return `bundle:${plantId}:${potId}:${[...extraIds].sort().join(",")}`;
}

function buildBundleCartItem({
  plant,
  pot,
  extras,
  unitPrice,
  discount,
  quantity = 1
}: AddBundleToCartPayload): BundleCartItem {
  const extraIds = extras.map((extra) => extra.id);

  return {
    kind: "bundle",
    cartKey: createBundleCartKey(plant.id, pot.id, extraIds),
    image: plant.images[0],
    quantity,
    unitPrice,
    bundle: {
      plantId: plant.id,
      plantSize: plant.plantSize,
      potId: pot.id,
      extraIds,
      discount
    }
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { value: cartItems, setValue: setCartItems } = useLocalStorage<CartItem[]>(
    "urban-green-cart",
    []
  );

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
        )
    };
  }, [cartItems, setCartItems]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
