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
    <div className="border border-[#ecefea] bg-[#f2f4ef] px-6 py-8 text-center md:px-10 md:py-9">
      {orderNumber ? (
        <>
          <p className="font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.24em] text-[#777777]">
            Order Number
          </p>
          <p className="mt-3 font-[family:var(--font-heading)] text-[2.8rem] leading-none text-[#191c1a] md:text-[4rem]">
            {orderNumber}
          </p>
          <p className="mx-auto mt-3 max-w-2xl font-[family:var(--font-body)] text-sm leading-6 text-[#516448]/75">
            Use this with your email on the orders page if you checked out as a guest.
          </p>
        </>
      ) : (
        <p className="font-[family:var(--font-body)] text-sm leading-7 text-[#516448]/75">
          {lookupError}
        </p>
      )}
    </div>
  );
}
