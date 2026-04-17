import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImageSlider } from "@/components/product-image-slider";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { getAllCatalogItems, getCatalogItemById } from "@/lib/data";
import type { ProductReviewsResponse } from "@/lib/api-types";
import { formatCurrency } from "@/lib/format";
import type { CatalogExtra, CatalogPot, Product } from "@/lib/types";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllCatalogItems().map((item) => ({ slug: item.id }));
}

const emptyReviews: ProductReviewsResponse = {
  reviews: [],
  averageRating: 0,
  reviewCount: 0,
  userReview: null
};

function PlantDetailPage({ product }: { product: Product }) {
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

function AccessoryDetailPanel({ item }: { item: CatalogPot | CatalogExtra }) {
  const isPot = item.type === "pot";
  const label = isPot ? "Vessel Archive" : "Care Essential";
  const detailText = isPot
    ? `Designed for ${item.fits.join(", ").toLowerCase()} specimens, this vessel is selected to keep the silhouette clean while giving roots the room they need.`
    : "A quiet support piece for your botanical routine, selected to keep plant care simple, consistent, and archive-ready.";
  const chips = isPot ? item.fits : ["Bundle Ready", "Care Add-On"];

  return (
    <aside className="bg-[#f2f4ef] p-10 lg:p-12">
      <p className="font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.28em] text-[#486730]">
        {label}
      </p>
      <h1 className="mt-8 font-[family:var(--font-heading)] text-5xl leading-tight text-[#486730]">
        {item.name}
      </h1>
      <p className="mt-6 font-[family:var(--font-body)] text-2xl text-[#191c1a]">
        {formatCurrency(item.price)}
      </p>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#474747]">{detailText}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {chips.map((chip) => (
          <span
            key={chip}
            className="bg-[#e1e3de] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#486730]"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/bundle"
          className="bg-[#486730] px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#3a4c31]"
        >
          Build A Bundle
        </Link>
        <Link
          href="/shop"
          className="border border-[#516448]/20 px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.24em] text-[#486730] transition hover:border-[#486730]"
        >
          Back To Plants
        </Link>
      </div>
    </aside>
  );
}

function AccessoryDetailPage({ item }: { item: CatalogPot | CatalogExtra }) {
  const isPot = item.type === "pot";

  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-0 pt-32">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductImageSlider images={item.images} name={item.name} />
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <AccessoryDetailPanel item={item} />
        </div>
      </div>

      <section className="mt-32 space-y-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 font-[family:var(--font-heading)] text-4xl leading-tight text-[#486730]">
            Curated For The Bundle Builder
          </h2>
          <div className="space-y-6 font-[family:var(--font-body)] text-lg leading-relaxed text-[#474747]">
            <p className="mx-auto max-w-[64rem]">
              {item.name} is part of the supporting archive rather than a standalone plant. Pair it
              with a specimen inside the bundle flow so sizing, care additions, and shipping stay
              aligned.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 overflow-hidden md:grid-cols-3">
          {[
            {
              number: "01.",
              title: isPot ? "Sized Pairing" : "Care Pairing",
              body: isPot
                ? "Vessels are matched to plant scale so the final bundle feels intentional and balanced."
                : "Care additions are selected alongside the plant so the routine starts with the right support."
            },
            {
              number: "02.",
              title: "Clean Presentation",
              body: "Each supporting item follows the same minimal visual language as the rest of the catalog."
            },
            {
              number: "03.",
              title: "Bundle Ready",
              body: "Add this through the bundle builder to keep checkout and fulfillment consistent."
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
    </main>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const item = getCatalogItemById(slug);

  if (!item) {
    notFound();
  }

  if (item.type === "plant") {
    return <PlantDetailPage product={item} />;
  }

  return <AccessoryDetailPage item={item} />;
}
