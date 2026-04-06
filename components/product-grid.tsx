import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

type ProductGridProps = {
  products: Product[];
  showActions?: boolean;
};

export function ProductGrid({ products, showActions = false }: ProductGridProps) {
  return (
    <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showActions={showActions} />
      ))}
    </div>
  );
}
