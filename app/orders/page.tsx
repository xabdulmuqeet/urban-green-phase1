import { OrdersPageClient } from "@/components/orders-page-client";
import { SectionHeading } from "@/components/section-heading";

export default function OrdersPage() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Orders"
          title="Your purchase history, kept in one calm place."
          description="Use this page to verify that orders are being created and stored by the backend."
        />
        <OrdersPageClient />
      </div>
    </section>
  );
}
