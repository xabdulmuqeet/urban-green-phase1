"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartPageClient() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">Your cart is calm for now.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">
          Add a few plants to start building your collection.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-card sm:grid-cols-[120px_1fr]"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={240}
              height={240}
              className="h-28 w-full rounded-[1.5rem] object-cover"
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="font-[family:var(--font-heading)] text-2xl">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-bark/60">
                  {item.size} pot · {item.type}
                </p>
                <p className="text-sm text-bark/75">{formatCurrency(item.unitPrice)} each</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.size, Math.max(0, item.quantity - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-cream text-bark"
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-cream text-bark"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between sm:col-span-2">
              <button
                type="button"
                onClick={() => removeFromCart(item.productId, item.size)}
                className="text-sm font-medium text-bark/70 transition hover:text-terracotta"
              >
                Remove
              </button>
              <p className="text-lg font-semibold text-terracotta">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
          Order Summary
        </p>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-[family:var(--font-heading)] text-3xl">Total</p>
          <p className="text-2xl font-semibold text-terracotta">{formatCurrency(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}
