import { CartPageClient } from "@/components/cart-page-client";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-32">
      <header className="mb-16">
        <p className="mb-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.24em] text-[#486730]">
          The Final Selection
        </p>
        <h1 className="font-[family:var(--font-heading)] text-5xl font-bold leading-none tracking-[-0.06em] text-[#486730] md:text-7xl">
          Checkout.
        </h1>
      </header>
      <CartPageClient />
    </main>
  );
}
