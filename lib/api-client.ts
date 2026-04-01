import type {
  ApiCartItem,
  CartResponse,
  CheckoutAddress,
  CheckoutResponse,
  GuestOrderLookupResponse,
  OrderResponse,
  ShippingMethodType,
  ShippingQuoteResponse,
  WishlistResponse
} from "@/lib/api-types";
import type { CartItem, Product } from "@/lib/types";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Request failed.");
  }

  return response.json() as Promise<T>;
}

export async function fetchProductsFromApi() {
  return readJson<{ products: Product[] }>(await fetch("/api/products", { cache: "no-store" }));
}

export function mapFrontendCartToApi(items: CartItem[]): ApiCartItem[] {
  return items.map((item) => {
    if (item.kind === "product") {
      return {
        type: "single",
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.unitPrice
      };
    }

    return {
      type: "bundle",
      quantity: item.quantity,
      bundle: {
        plant: item.bundle.plantId,
        size: item.bundle.plantVariantSize,
        pot: item.bundle.potId,
        extras: item.bundle.extraIds,
        discount: item.bundle.discount,
        totalPrice: item.unitPrice
      }
    };
  });
}

export async function fetchCartFromApi() {
  return readJson<CartResponse>(await fetch("/api/cart", { cache: "no-store" }));
}

export async function saveCartToApi(items: CartItem[]) {
  return readJson<CartResponse>(
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: mapFrontendCartToApi(items)
      })
    })
  );
}

export async function fetchWishlistFromApi() {
  return readJson<WishlistResponse>(await fetch("/api/wishlist", { cache: "no-store" }));
}

export async function saveWishlistToApi(wishlistIds: string[]) {
  return readJson<WishlistResponse>(
    await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wishlistIds })
    })
  );
}

export async function fetchOrdersFromApi() {
  return readJson<{ orders: OrderResponse[] }>(await fetch("/api/orders", { cache: "no-store" }));
}

export async function lookupGuestOrderFromApi(email: string, orderNumber: string) {
  return readJson<GuestOrderLookupResponse>(
    await fetch("/api/orders/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        orderNumber
      })
    })
  );
}

export async function fetchOrderBySessionIdFromApi(sessionId: string) {
  return readJson<GuestOrderLookupResponse>(
    await fetch(`/api/orders/lookup?session_id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store"
    })
  );
}

export async function createOrderFromApi(items?: CartItem[]) {
  return readJson<{ order: OrderResponse }>(
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        items
          ? {
              items: mapFrontendCartToApi(items)
            }
          : {}
      )
    })
  );
}

export async function fetchShippingQuoteFromApi(items: CartItem[], postalCode: string) {
  return readJson<ShippingQuoteResponse>(
    await fetch("/api/checkout/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: mapFrontendCartToApi(items),
        postalCode
      })
    })
  );
}

export async function createCheckoutSessionFromApiWithShipping(
  items: CartItem[],
  address: CheckoutAddress,
  shippingType: ShippingMethodType,
  customerEmail?: string
) {
  return readJson<CheckoutResponse>(
    await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: mapFrontendCartToApi(items),
        address,
        shippingType,
        customerEmail
      })
    })
  );
}
