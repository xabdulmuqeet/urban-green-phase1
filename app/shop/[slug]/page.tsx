import { notFound } from "next/navigation";
import { ProductImageSlider } from "@/components/product-image-slider";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
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
        <ProductPurchasePanel product={product} />
      </div>
    </section>
  );
}
