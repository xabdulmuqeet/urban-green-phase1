"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { getDefaultSize, getPriceForSize, getStartingPrice } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Product, ProductSizeLabel } from "@/lib/types";

type ArchiveProductTileProps = {
  product: Product;
  quickAction?: boolean;
  compact?: boolean;
};

export function ArchiveProductTile({
  product,
  quickAction = false,
  compact = false
}: ArchiveProductTileProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const defaultSize = getDefaultSize(product);
  const [selectedSize, setSelectedSize] = useState<ProductSizeLabel>(defaultSize);
  const selectedPrice = getPriceForSize(product, selectedSize);

  const handleQuickAction = () => {
    addToCart({
      product,
      size: selectedSize,
      unitPrice: selectedPrice,
      quantity: 1
    });
    router.push("/cart");
  };

  return (
    <article className="space-y-3">
      <div className="group relative overflow-hidden rounded-[0.15rem] bg-[#eef1ea]">
        <Link href={`/shop/${product.id}`} className="block">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={720}
            height={820}
            className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
              compact ? "h-[260px]" : "h-[340px]"
            }`}
          />
        </Link>
        {quickAction ? (
          <button
            type="button"
            onClick={handleQuickAction}
            className="absolute inset-x-0 bottom-0 bg-[#8ca27f]/92 px-4 py-2.5 text-center text-[11px] font-medium text-white transition hover:bg-[#748f68]"
          >
            Quick View
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/shop/${product.id}`}
              className="font-[family:var(--font-heading)] text-[1.3rem] leading-none tracking-[-0.03em] text-foreground transition hover:text-[#486730]"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-bark/55">
              {product.category}
            </p>
          </div>
          <p className="pt-1 text-sm text-foreground">
            {formatCurrency(quickAction ? selectedPrice : getStartingPrice(product))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {product.variants
            .filter((variant) => variant.inStock)
            .map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedSize(variant.size)}
                className={`h-4 w-4 rounded-full transition ${
                  selectedSize === variant.size ? "bg-[#486730]" : "bg-[#b8c2b1]"
                }`}
                aria-label={`Choose ${variant.size}`}
                title={variant.size}
              />
            ))}
        </div>

      </div>
    </article>
  );
}
