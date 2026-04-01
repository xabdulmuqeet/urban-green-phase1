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
    size: ProductSizeLabel;
    pot: string;
    extras: string[];
    discount: number;
    totalPrice: number;
  };
};

export type ApiCartItem = ApiSingleCartItem | ApiBundleCartItem;

export type ShippingMethodType = "white_glove" | "local_pickup" | "hardy_shipping";

export type CheckoutAddress = {
  recipientName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  deliveryNotes?: string;
};

export type ReviewResponse = {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ProductReviewsResponse = {
  reviews: ReviewResponse[];
  averageRating: number;
  reviewCount: number;
  userReview: ReviewResponse | null;
};

export type ShippingMethodOption = {
  type: ShippingMethodType;
  label: string;
  cost: number;
};

export type ShippingQuoteResponse = {
  postalCode: string;
  isLocalDeliveryZone: boolean;
  distanceMiles: number | null;
  availableMethods: ShippingMethodOption[];
  restrictionMessage: string | null;
  weatherWarning: string | null;
  suggestedExtra: {
    id: string;
    name: string;
  } | null;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  selectedMethod: ShippingMethodType | null;
};

export type CartResponse = {
  items: ApiCartItem[];
  totalAmount: number;
};

export type WishlistResponse = {
  wishlistIds: string[];
};

export type OrderResponse = {
  id: string;
  orderNumber: string;
  items: ApiCartItem[];
  totalAmount: number;
  paymentStatus: "paid";
  deliveryAddress?: CheckoutAddress;
  destinationPostalCode?: string;
  shippingType?: ShippingMethodType;
  shippingCost?: number;
  createdAt: string;
};

export type CheckoutResponse = {
  url: string;
};

export type GuestOrderLookupResponse = {
  order: OrderResponse;
};
