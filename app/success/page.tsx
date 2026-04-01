import Link from "next/link";
import { Suspense } from "react";
import { SuccessPageClient } from "@/components/success-page-client";

export default function SuccessPage() {
  return (
    <section className="section-space">
      <div className="page-shell">
        <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
          <p className="font-[family:var(--font-heading)] text-4xl">Payment Confirmed</p>
          <p className="mt-4 text-sm leading-6 text-bark/75">
            Your checkout completed successfully. We are syncing your order now, so it may take a moment to appear in your order history.
          </p>
          <Suspense fallback={null}>
            <SuccessPageClient />
          </Suspense>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
            >
              View Orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-foreground"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
