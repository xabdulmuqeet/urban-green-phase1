"use client";

import { AuthControls } from "@/components/auth-controls";
import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/care-guide", label: "Care Guides" },
  { href: "/bundle", label: "Bundle" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" }
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/80 text-foreground transition"
      >
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform duration-300 ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`absolute left-0 right-0 top-full overflow-hidden bg-[rgba(248,250,245,0.98)] shadow-[0_18px_45px_rgba(62,79,55,0.08)] backdrop-blur-xl transition-all duration-300 ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="page-shell flex flex-col gap-4 py-6 text-sm text-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="transition hover:text-[#486730]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <AuthControls mobile onNavigate={() => setIsOpen(false)} />
          </div>
        </nav>
      </div>
    </div>
  );
}
