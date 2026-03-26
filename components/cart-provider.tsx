"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { CartItem, Product } from "@/lib/types";

type AddToCartPayload = {
  product: Product;
  size: string;
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

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
          const existingItem = currentItems.find(
            (item) => item.productId === product.id && item.size === size
          );

          if (existingItem) {
            return currentItems.map((item) =>
              item.productId === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [
            ...currentItems,
            {
              productId: product.id,
              name: product.name,
              image: product.images[0],
              size,
              type: product.type,
              unitPrice,
              quantity
            }
          ];
        }),
      updateQuantity: (productId, size, quantity) =>
        setCartItems((currentItems) =>
          currentItems
            .map((item) =>
              item.productId === productId && item.size === size
                ? { ...item, quantity }
                : item
            )
            .filter((item) => item.quantity > 0)
        ),
      removeFromCart: (productId, size) =>
        setCartItems((currentItems) =>
          currentItems.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
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
