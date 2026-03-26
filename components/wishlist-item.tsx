import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/wishlist-button";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function WishlistItem({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-card">
      <WishlistButton productId={product.id} className="absolute right-4 top-4 z-20" />
      <Link href={`/shop/${product.id}`} className="block">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={800}
          height={900}
          className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.28em] text-bark/60">{product.category}</p>
            <span className="rounded-full bg-cream px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bark">
              {product.type}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-[family:var(--font-heading)] text-2xl">{product.name}</h3>
              <p className="mt-2 text-sm leading-6 text-bark/75">{product.description}</p>
            </div>
            <p className="text-lg font-semibold text-terracotta">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
