import Link from "next/link";

export default function CancelPage() {
  return (
    <section className="section-space">
      <div className="page-shell">
        <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
          <p className="font-[family:var(--font-heading)] text-4xl">Checkout Canceled</p>
          <p className="mt-4 text-sm leading-6 text-bark/75">
            Nothing was charged. Your cart is still waiting for you if you want to review it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/cart"
              className="inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
            >
              Return To Cart
            </Link>
            <Link
              href="/shop"
              className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-foreground"
            >
              Keep Browsing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
