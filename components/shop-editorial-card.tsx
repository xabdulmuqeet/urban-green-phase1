"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { getDefaultSize, getPriceForSize } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Product, ProductSizeLabel } from "@/lib/types";

type ShopEditorialCardProps = {
  product: Product;
  imageSrc: string;
  badge: string;
  metadata?: string[];
  offset?: boolean;
};

export function ShopEditorialCard({
  product,
  imageSrc,
  badge,
  metadata = [],
  offset = false
}: ShopEditorialCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const defaultSize = getDefaultSize(product);
  const [selectedSize, setSelectedSize] = useState<ProductSizeLabel>(defaultSize);

  const handleQuickAdd = () => {
    addToCart({
      product,
      size: selectedSize,
      unitPrice: getPriceForSize(product, selectedSize),
      quantity: 1
    });
    router.push("/cart");
  };

  return (
    <article className={`group relative ${offset ? "mt-12 md:mt-24" : ""}`}>
      <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-[#f2f4ef]">
        <Link href={`/shop/${product.id}`} className="block h-full w-full">
          <Image
            alt={product.name}
            src={imageSrc}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-16 right-0 translate-y-4 bg-[#516448] px-6 py-3 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.24em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick Add
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="mb-2 block font-[family:var(--font-body)] text-[9px] uppercase tracking-[0.22em] text-[#516448] opacity-60">
            {badge}
          </span>
          <Link
            href={`/shop/${product.id}`}
            className="font-[family:var(--font-heading)] text-[2rem] leading-none text-[#486730] transition hover:opacity-75"
          >
            {product.name}
          </Link>
        </div>
        <span className="font-[family:var(--font-body)] text-lg text-[#516448]">
          {formatCurrency(getPriceForSize(product, selectedSize))}
        </span>
      </div>

      {metadata.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="bg-[#e1e3de] px-3 py-1 font-[family:var(--font-body)] text-[9px] uppercase tracking-[0.18em] text-[#486730]"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
