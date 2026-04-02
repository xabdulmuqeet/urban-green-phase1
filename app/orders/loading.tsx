import { OrderCardSkeleton } from "@/components/order-card-skeleton";
import { SectionHeading } from "@/components/section-heading";

export default function OrdersLoading() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Orders"
          title="A record of every green delivery."
          description="Track paid orders, guest lookups, and account history in one calm place."
        />
        <div className="space-y-6">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    </section>
  );
}
