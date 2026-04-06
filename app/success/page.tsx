import Link from "next/link";
import { Suspense } from "react";
import { SuccessPageClient } from "@/components/success-page-client";

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-20 pt-24">
      <section className="mx-auto max-w-[78rem]">
        <header className="mb-12 text-center">
          <p className="mb-3 font-[family:var(--font-body)] text-xs uppercase tracking-[0.24em] text-[#486730]">
            Checkout Complete
          </p>
          <h1 className="font-[family:var(--font-heading)] text-[3.5rem] leading-[0.96] tracking-[-0.05em] text-[#486730] md:text-[5.5rem]">
            Payment Confirmed
          </h1>
          <p className="mx-auto mt-5 max-w-[58rem] font-[family:var(--font-body)] text-base leading-7 text-[#516448]/78">
            Your checkout completed successfully. We are syncing your order now, so it may take a
            moment to appear in your order history.
          </p>
        </header>

        <div className="border border-[#ecefea] bg-[#fdfdf9] p-8 md:p-10">
          <Suspense fallback={null}>
            <SuccessPageClient />
          </Suspense>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center bg-[#516448] px-8 py-4 font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#486730]"
            >
              View Orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-[#c6c6c6]/40 px-8 py-4 font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.24em] text-[#191c1a] transition-colors hover:border-[#486730] hover:text-[#486730]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
