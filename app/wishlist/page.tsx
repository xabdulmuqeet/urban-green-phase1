import { SectionHeading } from "@/components/section-heading";
import { WishlistPageClient } from "@/components/wishlist-page-client";

export default function WishlistPage() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Wishlist"
          title="Saved plants for your next styling moment."
          description="Keep track of the plants that caught your eye and revisit them whenever you are ready."
        />
        <WishlistPageClient />
      </div>
    </section>
  );
}
