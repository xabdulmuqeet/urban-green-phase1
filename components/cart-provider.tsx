"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode
} from "react";
import type { CartItem, Product } from "@/lib/types";

type AddToCartPayload = {
  product: Product;
  size: string;
  unitPrice: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: AddToCartPayload }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; size: string; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string } };

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartItem[], action: CartAction) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, unitPrice } = action.payload;
      const existingItem = state.find(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingItem) {
        return state.map((item) =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...state,
        {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          size,
          type: product.type,
          unitPrice,
          quantity: 1
        }
      ];
    }
    case "UPDATE_QUANTITY":
      return state
        .map((item) =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
    case "REMOVE_ITEM":
      return state.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          )
      );
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    return {
      cartItems,
      totalItems,
      totalPrice,
      addToCart: (payload) => dispatch({ type: "ADD_ITEM", payload }),
      updateQuantity: (productId, size, quantity) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, size, quantity }
        }),
      removeFromCart: (productId, size) =>
        dispatch({ type: "REMOVE_ITEM", payload: { productId, size } })
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
