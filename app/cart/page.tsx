import { SectionHeading } from "@/components/section-heading";
import { CartPageClient } from "@/components/cart-page-client";

export default function CartPage() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Your Cart"
          title="A calm collection, ready to come home."
          description="Review your selected plants, adjust quantities, and keep your styling choices organized."
        />
        <CartPageClient />
      </div>
    </section>
  );
}
