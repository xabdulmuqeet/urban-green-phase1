"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartNavButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart with ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="relative flex h-10 w-10 items-center justify-center text-[#516448] transition-transform duration-200 hover:scale-95"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2.2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7.1" />
      </svg>
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#516448] px-1 text-[10px] font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
