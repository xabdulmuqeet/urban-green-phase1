"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrderBySessionIdFromApi } from "@/lib/api-client";

const CART_STORAGE_KEY = "urban-green-cart";

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderNumber, setOrderNumber] = useState("");
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const loadOrder = async () => {
      try {
        const response = await fetchOrderBySessionIdFromApi(sessionId);

        if (!cancelled) {
          setOrderNumber(response.order.orderNumber);
          setLookupError("");
        }
      } catch (caughtError) {
        attempts += 1;

        if (attempts < 6 && !cancelled) {
          window.setTimeout(() => {
            void loadOrder();
          }, 1500);
          return;
        }

        if (!cancelled) {
          setLookupError(caughtError instanceof Error ? caughtError.message : "Order confirmation is still syncing.");
        }
      }
    };

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!orderNumber && !lookupError) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[1.5rem] border border-black/5 bg-cream/70 p-4 text-center">
      {orderNumber ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/60">
            Order Number
          </p>
          <p className="mt-2 font-[family:var(--font-heading)] text-3xl text-foreground">
            {orderNumber}
          </p>
          <p className="mt-2 text-sm text-bark/70">
            Use this with your email on the orders page if you checked out as a guest.
          </p>
        </>
      ) : (
        <p className="text-sm text-bark/70">{lookupError}</p>
      )}
    </div>
  );
}
