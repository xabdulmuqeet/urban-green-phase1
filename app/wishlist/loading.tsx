import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { SectionHeading } from "@/components/section-heading";

export default function WishlistLoading() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Wishlist"
          title="Saved plants for your next styling moment."
          description="Keep track of the plants that caught your eye and revisit them whenever you are ready."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
