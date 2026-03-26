import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-card transition duration-500 hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-sage">
          {product.tag}
        </div>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={800}
          height={900}
          className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-bark/60">{product.category}</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-[family:var(--font-heading)] text-2xl">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-bark/75">{product.description}</p>
          </div>
          <p className="text-lg font-semibold text-terracotta">${product.price}</p>
        </div>
      </div>
    </Link>
  );
}
