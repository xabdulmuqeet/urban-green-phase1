"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/cart-item-row";
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
          <CartItemRow
            key={item.cartKey}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
          Order Summary
        </p>
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`summary-${item.cartKey}`}
              className="flex items-start justify-between gap-4 border-b border-black/5 pb-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-bark/60">
                  {item.kind === "bundle"
                    ? `Bundle · ${item.bundle.plantSize}`
                    : `${item.size} pot`}
                </p>
                <p className="text-sm text-bark/70">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-[family:var(--font-heading)] text-3xl">Total</p>
          <p className="text-2xl font-semibold text-terracotta">{formatCurrency(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}
