"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { fetchOrdersFromApi, lookupGuestOrderFromApi } from "@/lib/api-client";
import { getExtrasByIds, getPlantById, getPotById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { OrderResponse } from "@/lib/api-types";

export function OrdersPageClient() {
  const { status } = useSession();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestLookupError, setGuestLookupError] = useState("");
  const [isLookingUpGuestOrder, setIsLookingUpGuestOrder] = useState(false);

  const renderOrderCards = () => (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 border-b border-black/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark/55">Order</p>
                <p className="font-[family:var(--font-heading)] text-3xl">{order.orderNumber}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-bark/70">
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                <span className="rounded-full bg-sage/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sage">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark/55">Total</p>
              <p className="mt-2 text-xl font-semibold text-terracotta">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] bg-cream/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/55">Shipping</p>
              <p className="mt-3 text-sm text-bark/70">
                {order.shippingType
                  ? `${order.shippingType.replace(/_/g, " ")} · ${formatCurrency(order.shippingCost ?? 0)}`
                  : "Shipping details unavailable"}
              </p>
              {order.deliveryAddress ? (
                <div className="mt-4 border-t border-black/5 pt-4 text-sm text-bark/70">
                  <p className="font-medium text-foreground">{order.deliveryAddress.recipientName}</p>
                  <p className="mt-1">{order.deliveryAddress.streetAddress}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.postalCode}
                  </p>
                  <p>{order.deliveryAddress.phoneNumber}</p>
                  {order.deliveryAddress.deliveryNotes ? (
                    <p className="mt-2">Notes: {order.deliveryAddress.deliveryNotes}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/55">Items</p>
            {order.items.map((item, index) => {
              const plant = item.type === "single" ? getPlantById(item.productId) : getPlantById(item.bundle.plant);
              const pot = item.type === "bundle" ? getPotById(item.bundle.pot) : null;
              const extras = item.type === "bundle" ? getExtrasByIds(item.bundle.extras) : [];
              const itemName =
                item.type === "single"
                  ? plant?.name ?? item.productId
                  : `${plant?.name ?? "Custom Plant"} Bundle`;
              const itemMeta =
                item.type === "single"
                  ? `${item.size} · Qty ${item.quantity}`
                  : `${item.bundle.size} · ${pot?.name ?? item.bundle.pot} + ${extras.map((extra) => extra.name).join(", ") || "No extras"} · Qty ${item.quantity}`;
              const lineTotal =
                item.type === "single" ? item.price * item.quantity : item.bundle.totalPrice * item.quantity;

              return (
                <div key={`${order.id}-${index}`} className="flex items-start justify-between gap-4 rounded-[1.35rem] border border-black/5 bg-white px-4 py-4">
                  <div>
                    <p className="font-medium text-foreground">{itemName}</p>
                    <p className="text-sm text-bark/70">{itemMeta}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(lineTotal)}</p>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadOrders = async () => {
      try {
        const response = await fetchOrdersFromApi();
        if (!isCancelled) {
          setOrders(response.orders);
        }
      } catch (caughtError) {
        if (!isCancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Failed to fetch orders.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">Loading your orders...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
            <p className="font-[family:var(--font-heading)] text-3xl">Sign in to view your orders.</p>
            <p className="mt-3 text-sm leading-6 text-bark/75">
              Your order history is attached to your account.
            </p>
            <button
              type="button"
              onClick={() => void signIn()}
              className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
            >
              Sign In
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsLookingUpGuestOrder(true);
              setGuestLookupError("");
              void lookupGuestOrderFromApi(guestEmail.trim(), guestOrderNumber.trim().toUpperCase())
                .then((response) => {
                  setOrders([response.order]);
                })
                .catch((caughtError) => {
                  setOrders([]);
                  setGuestLookupError(
                    caughtError instanceof Error ? caughtError.message : "Failed to look up order."
                  );
                })
                .finally(() => setIsLookingUpGuestOrder(false));
            }}
            className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card"
          >
            <p className="font-[family:var(--font-heading)] text-3xl">Guest order lookup</p>
            <p className="mt-3 text-sm leading-6 text-bark/75">
              Enter the email used at checkout and your order number to view a guest order.
            </p>
            <div className="mt-6 space-y-4">
              <input
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-full border border-black/10 bg-cream px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
              <input
                type="text"
                value={guestOrderNumber}
                onChange={(event) => setGuestOrderNumber(event.target.value)}
                placeholder="Order number"
                className="w-full rounded-full border border-black/10 bg-cream px-5 py-3 text-sm uppercase text-foreground outline-none transition focus:border-sage"
              />
            </div>
            {guestLookupError ? <p className="mt-4 text-sm text-terracotta">{guestLookupError}</p> : null}
            <button
              type="submit"
              disabled={isLookingUpGuestOrder}
              className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLookingUpGuestOrder ? "Finding Order..." : "View Guest Order"}
            </button>
          </form>
        </div>

        {orders.length > 0 ? renderOrderCards() : null}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">We could not load orders.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">No orders yet.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">
          Place your first order from the cart to test backend order creation.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          Browse Plants
        </Link>
      </div>
    );
  }

  return renderOrderCards();
}
