import type { ProductSizeLabel } from "@/lib/types";

export type ApiSingleCartItem = {
  type: "single";
  productId: string;
  size: ProductSizeLabel;
  quantity: number;
  price: number;
};

export type ApiBundleCartItem = {
  type: "bundle";
  quantity: number;
  bundle: {
    plant: string;
    pot: string;
    extras: string[];
    discount: number;
    totalPrice: number;
  };
};

export type ApiCartItem = ApiSingleCartItem | ApiBundleCartItem;

export type CartResponse = {
  items: ApiCartItem[];
  totalAmount: number;
};

export type OrderResponse = {
  id: string;
  items: ApiCartItem[];
  totalAmount: number;
  createdAt: string;
};
