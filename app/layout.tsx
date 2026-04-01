import { AuthSessionProvider } from "@/components/auth-session-provider";
import { AuthControls } from "@/components/auth-controls";
import type { Metadata } from "next";
import { CartNavButton } from "@/components/cart-nav-button";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Urban Green",
  description: "Premium indoor plants for design-led homes."
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(248,247,241,0.88)] backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-sage/30 bg-sage/10">
            <Image
              src="/brand-mark.svg"
              alt="The Urban Green logo"
              width={44}
              height={44}
              className="h-10 w-10"
              priority
            />
          </div>
          <div>
            <p className="font-[family:var(--font-heading)] text-xl leading-none tracking-wide">
              The Urban Green
            </p>
            <p className="text-xs uppercase tracking-[0.32em] text-bark/70">
              Curated Plant Living
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] sm:gap-7 sm:text-sm sm:normal-case sm:tracking-normal md:flex">
          <Link href="/" className="transition hover:text-sage">
            Home
          </Link>
          <Link href="/shop" className="transition hover:text-sage">
            Shop
          </Link>
          <Link href="/bundle" className="transition hover:text-sage">
            Bundle
          </Link>
          <Link href="/orders" className="transition hover:text-sage">
            Orders
          </Link>
          <AuthControls />
          <CartNavButton />
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/70">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="font-[family:var(--font-heading)] text-3xl">Bring calm home.</p>
          <p className="max-w-xl text-sm leading-7 text-bark/80">
            Premium plants, thoughtful styling, and care guidance designed for modern interiors.
          </p>
        </div>

        <div className="grid gap-8 text-sm text-bark/80 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-[0.22em] text-foreground">Visit</p>
            <p>Studio 08, Clifton Quarter</p>
            <p>Karachi, Pakistan</p>
          </div>
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-[0.22em] text-foreground">Contact</p>
            <p>hello@theurbangreen.store</p>
            <p>Instagram / Pinterest</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="min-h-screen font-[family:var(--font-body)] text-foreground antialiased"
      >
        <AuthSessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
