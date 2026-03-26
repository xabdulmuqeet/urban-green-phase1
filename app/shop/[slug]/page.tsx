import { notFound } from "next/navigation";
import { CareTabs } from "@/components/care-tabs";
import { ProductImageSlider } from "@/components/product-image-slider";
import { SizeSelector } from "@/components/size-selector";
import { products, getProductById } from "@/lib/data";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductById(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section-space">
      <div className="page-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductImageSlider images={product.images} name={product.name} />

        <div className="space-y-7 lg:space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">
              {product.category}
            </p>
            <h1 className="font-[family:var(--font-heading)] text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold leading-none text-terracotta">${product.price}</p>
            <p className="max-w-xl text-base leading-6 text-bark/80 sm:text-[17px]">
              {product.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-cream/60 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
              Why we love it
            </p>
            <p className="mt-3 text-sm leading-5 text-bark/80">
              Sculptural shape, premium foliage, and an elevated presentation that makes any room feel calmer and more intentional.
            </p>
          </div>

          <SizeSelector sizes={product.sizes} />
          <CareTabs care={product.care} />
        </div>
      </div>
    </section>
  );
}
