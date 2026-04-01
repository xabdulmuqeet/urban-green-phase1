import { notFound } from "next/navigation";
import { ProductImageSlider } from "@/components/product-image-slider";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { getAllPlants, getPlantById } from "@/lib/data";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { getProductReviewsSummary } from "@/lib/reviews";
import { getCurrentSessionEmail, requireCurrentUser } from "@/lib/session";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPlants().map((product) => ({
    slug: product.id
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getPlantById(slug);

  if (!product) {
    notFound();
  }

  const initialReviews = isDatabaseConfigured()
    ? await (async () => {
        try {
          await connectToDatabase();
          const email = await getCurrentSessionEmail();
          const user = email ? await requireCurrentUser() : null;
          return await getProductReviewsSummary(product.id, user ? String(user._id) : undefined);
        } catch {
          return { reviews: [], averageRating: 0, reviewCount: 0, userReview: null };
        }
      })()
    : { reviews: [], averageRating: 0, reviewCount: 0, userReview: null };

  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductImageSlider images={product.images} name={product.name} />
          <ProductPurchasePanel
            product={product}
            averageRating={initialReviews.averageRating}
            reviewCount={initialReviews.reviewCount}
          />
        </div>
        <ProductReviewsSection productId={product.id} initialReviews={initialReviews} />
      </div>
    </section>
  );
}
