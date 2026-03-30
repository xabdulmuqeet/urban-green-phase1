"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { fetchOrdersFromApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import type { OrderResponse } from "@/lib/api-types";

export function OrdersPageClient() {
  const { status } = useSession();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-[family:var(--font-heading)] text-3xl">Order {order.id.slice(-6)}</p>
              <p className="mt-2 text-sm text-bark/70">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-xl font-semibold text-terracotta">{formatCurrency(order.totalAmount)}</p>
          </div>

          <div className="mt-6 space-y-4">
            {order.items.map((item, index) => (
              <div key={`${order.id}-${index}`} className="flex items-start justify-between gap-4 border-t border-black/5 pt-4">
                <div>
                  <p className="font-medium text-foreground">
                    {item.type === "single" ? item.productId : `${item.bundle.plant} bundle`}
                  </p>
                  <p className="text-sm text-bark/70">
                    {item.type === "single"
                      ? `${item.size} · Qty ${item.quantity}`
                      : `${item.bundle.pot} + ${item.bundle.extras.join(", ") || "No extras"} · Qty ${item.quantity}`}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatCurrency(item.type === "single" ? item.price * item.quantity : item.bundle.totalPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
