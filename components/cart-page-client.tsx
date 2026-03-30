"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartItemRow } from "@/components/cart-item-row";
import { useCart } from "@/components/cart-provider";
import { createOrderFromApi } from "@/lib/api-client";
import { getPlantById } from "@/lib/data";
import {
  BUNDLE_SELECTION_STORAGE_KEY,
  createBundleSelectionFromCartItem
} from "@/hooks/use-bundle-builder";
import { formatCurrency } from "@/lib/format";

export function CartPageClient() {
  const router = useRouter();
  const { status } = useSession();
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleEditBundle = (cartKey: string) => {
    const bundleItem = cartItems.find(
      (item) => item.kind === "bundle" && item.cartKey === cartKey
    );

    if (!bundleItem || bundleItem.kind !== "bundle") {
      return;
    }

    window.localStorage.setItem(
      BUNDLE_SELECTION_STORAGE_KEY,
      JSON.stringify(createBundleSelectionFromCartItem(bundleItem))
    );
    router.push(`/bundle?edit=${encodeURIComponent(bundleItem.cartKey)}`);
  };

  const handlePlaceOrder = async () => {
    if (status !== "authenticated") {
      await signIn();
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError("");

    try {
      await createOrderFromApi(cartItems);
      clearCart();
      router.push("/orders");
    } catch (caughtError) {
      setOrderError(caughtError instanceof Error ? caughtError.message : "Failed to place order.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

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
            onEditBundle={handleEditBundle}
          />
        ))}
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
          Order Summary
        </p>
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            (() => {
              const bundlePlant =
                item.kind === "bundle" ? getPlantById(item.bundle.plantId) : null;
              const summaryName =
                item.kind === "bundle"
                  ? `${bundlePlant?.name ?? "Bundle"} Bundle`
                  : item.name;

              return (
                <div
                  key={`summary-${item.cartKey}`}
                  className="flex items-start justify-between gap-4 border-b border-black/5 pb-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{summaryName}</p>
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
              );
            })()
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-[family:var(--font-heading)] text-3xl">Total</p>
          <p className="text-2xl font-semibold text-terracotta">{formatCurrency(totalPrice)}</p>
        </div>
        {orderError ? <p className="mt-4 text-sm text-terracotta">{orderError}</p> : null}
        <button
          type="button"
          onClick={() => void handlePlaceOrder()}
          disabled={isSubmittingOrder}
          className="mt-6 w-full rounded-full bg-terracotta px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "authenticated"
            ? isSubmittingOrder
              ? "Placing Order..."
              : "Place Order"
            : "Sign In To Place Order"}
        </button>
      </div>
    </div>
  );
}
