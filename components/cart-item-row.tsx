"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
  onRemove: (cartKey: string) => void;
};

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemRowProps) {
  const isBundle = item.kind === "bundle";

  return (
    <div className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-card sm:grid-cols-[120px_1fr]">
      <Image
        src={item.image}
        alt={item.name}
        width={240}
        height={240}
        className="h-28 w-full rounded-[1.5rem] object-cover"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-[family:var(--font-heading)] text-2xl">{item.name}</p>
          {isBundle ? (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-bark/60">
                Bundle · {item.bundle.plantSize}
              </p>
              <p className="text-sm text-bark/75">
                {item.bundle.plantName} + {item.bundle.potName}
              </p>
              <p className="text-sm text-bark/75">
                {item.bundle.extras.length > 0
                  ? item.bundle.extras.map((extra) => extra.name).join(", ")
                  : "No extras"}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-bark/60">
                {item.size} pot · {item.condition}
              </p>
              <p className="text-sm text-bark/75">{formatCurrency(item.unitPrice)} each</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.cartKey, Math.max(0, item.quantity - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-cream text-bark"
          >
            -
          </button>
          <span className="w-6 text-center font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-cream text-bark"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between sm:col-span-2">
        <button
          type="button"
          onClick={() => onRemove(item.cartKey)}
          className="text-sm font-medium text-bark/70 transition hover:text-terracotta"
        >
          Remove
        </button>
        <div className="text-right">
          {isBundle ? (
            <p className="text-xs uppercase tracking-[0.2em] text-sage">
              Discount saved {formatCurrency(item.bundle.discount)}
            </p>
          ) : null}
          <p className="text-lg font-semibold text-terracotta">
            {formatCurrency(item.unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
