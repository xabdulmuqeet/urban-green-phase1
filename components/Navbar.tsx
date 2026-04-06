"use client";

import { usePathname } from "next/navigation";
import { AuthControls } from "@/components/auth-controls";
import { CartNavButton } from "@/components/cart-nav-button";
import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bundle", label: "Bundle" },
  { href: "/care-guide", label: "Care Guides" },
  { href: "/orders", label: "Orders" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full bg-[#f8faf5]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-[80px] py-6">
        <Link
          href="/"
          className="font-[family:var(--font-heading)] text-2xl font-bold tracking-[-0.04em] text-[#486730]"
        >
          The Urban Green
        </Link>

        <nav className="hidden items-center gap-6 font-[family:var(--font-heading)] text-sm tracking-tight text-[#516448]/70 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/shop" && pathname?.startsWith("/shop/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b pb-1 transition-colors duration-300 ${
                  isActive
                    ? "border-[#486730] text-[#486730]"
                    : "border-transparent hover:text-[#486730]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-4 text-[#516448]">
            <CartNavButton />
            <AuthControls />
          </div>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
