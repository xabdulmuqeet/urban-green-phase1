import Image from "next/image";
import Link from "next/link";
import { InstagramGrid } from "@/components/instagram-grid";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProducts, instagramPosts } from "@/lib/data";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <section className="section-space overflow-hidden">
        <div className="page-shell grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="fade-up space-y-8">
            <p className="inline-flex rounded-full border border-sage/30 bg-sage/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-sage">
              Premium Plant Styling
            </p>
            <div className="space-y-6">
              <h1 className="max-w-2xl font-[family:var(--font-heading)] text-5xl leading-none sm:text-6xl lg:text-7xl">
                Nature, curated for the modern home.
              </h1>
              <p className="max-w-xl text-base leading-8 text-bark/80 sm:text-lg">
                The Urban Green blends sculptural plants, elevated planters, and calm interior styling into one refined shopping experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-terracotta px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#cd624b]"
              >
                Shop Collection
              </Link>
              <Link
                href="/shop/olive-tree"
                className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:border-sage hover:text-sage"
              >
                Explore Signature Plant
              </Link>
            </div>

            <div className="grid max-w-xl gap-4 rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-card sm:grid-cols-3">
              {[
                ["48h", "Dispatch window"],
                ["4.9/5", "Client rating"],
                ["12k+", "Styled spaces"]
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-[family:var(--font-heading)] text-3xl">{value}</p>
                  <p className="mt-1 text-sm text-bark/75">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 hidden h-32 w-32 rounded-full bg-terracotta/20 blur-3xl sm:block" />
            <div className="absolute -right-6 bottom-0 h-48 w-48 rounded-full bg-sage/25 blur-3xl" />
            <div className="card-surface soft-grid relative overflow-hidden rounded-[2.5rem] border border-white/60 p-4 shadow-card">
              <Image
                src="/products/hero-plant.svg"
                alt="Hero plant arrangement"
                width={1000}
                height={1200}
                className="w-full rounded-[2rem] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.75rem] bg-white/90 p-5 shadow-card sm:bottom-10 sm:left-10 sm:right-auto">
                <p className="text-xs uppercase tracking-[0.28em] text-bark/60">Featured Edit</p>
                <p className="mt-2 font-[family:var(--font-heading)] text-3xl">Olive Tree</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-bark/75">
                  A sun-loving centerpiece with Mediterranean character.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell space-y-10">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Plants chosen for calm, texture, and presence."
            description="Start with the pieces our stylists use most often to shape quiet, light-filled rooms."
          />
          <ProductGrid products={featuredProducts} showActions />
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell rounded-[2.5rem] bg-foreground px-6 py-14 text-white shadow-card sm:px-10 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="From Our Studio"
              title="Styled moments from our everyday green corners."
              description="A tactile, editorial-inspired feed with pottery pairings, layered foliage, and naturally lit spaces."
              tone="light"
            />
            <InstagramGrid posts={instagramPosts} />
          </div>
        </div>
      </section>
    </>
  );
}
