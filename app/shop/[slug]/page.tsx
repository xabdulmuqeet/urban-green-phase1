import { notFound } from "next/navigation";
import { ProductImageSlider } from "@/components/product-image-slider";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { getAllPlants, getPlantById } from "@/lib/data";
import type { ProductReviewsResponse } from "@/lib/api-types";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPlants().map((product) => ({ slug: product.id }));
}

const emptyReviews: ProductReviewsResponse = {
  reviews: [],
  averageRating: 0,
  reviewCount: 0,
  userReview: null
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getPlantById(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-0 pt-32">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductImageSlider images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <ProductPurchasePanel
            product={product}
            averageRating={emptyReviews.averageRating}
            reviewCount={emptyReviews.reviewCount}
          />
        </div>
      </div>

      <section className="mt-32 space-y-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 font-[family:var(--font-heading)] text-4xl leading-tight text-[#486730]">
            The Archivist&apos;s Perspective
          </h2>
          <div className="space-y-6 font-[family:var(--font-body)] text-lg leading-relaxed text-[#474747]">
            <p className="mx-auto max-w-[64rem]">
              {product.name} is more than a plant, it is a living sculpture that evolves with the
              environment around it. Each new leaf arrives as a tightly held gesture before opening
              into a broader silhouette that reshapes the room.
            </p>
            <p className="mx-auto max-w-[64rem]">
              {product.description} Styled well, it becomes a focal point of natural
              sophistication, bringing texture, scale, and a sense of calm architecture into the
              home.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 overflow-hidden md:grid-cols-3">
          {[
            {
              number: "01.",
              title: "Heritage Specimen",
              body: "Each plant is hand-selected from our archival nursery for superior leaf structure and health."
            },
            {
              number: "02.",
              title: "Artisan Vessel",
              body: "Paired with a signature matte stoneware pot designed to complement the organic green tones."
            },
            {
              number: "03.",
              title: "Lifetime Support",
              body: "Direct access to our botanical specialists for ongoing care consultations and growth tips."
            }
          ].map((item, index) => (
            <article
              key={item.number}
              className={`${index === 1 ? "bg-[#e7e9e4]" : "bg-[#eef1ea]"} p-12`}
            >
              <span className="font-[family:var(--font-heading)] text-2xl italic text-[#486730]">
                {item.number}
              </span>
              <h4 className="mt-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.18em] text-[#191c1a]">
                {item.title}
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-[#474747]/80">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <ProductReviewsSection productId={product.id} initialReviews={emptyReviews} />
      </section>
    </main>
  );
}
