import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import {
  getPlantsForShopFilter,
  getShopFilterFromSearchParam,
  getShopFilterOptions
} from "@/lib/data";

type ShopPageProps = {
  searchParams?: Promise<{
    filter?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeFilter = getShopFilterFromSearchParam(resolvedSearchParams?.filter);
  const plants = getPlantsForShopFilter(activeFilter);
  const filterOptions = getShopFilterOptions();

  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Shop All"
          title="Design-led plants for elevated everyday living."
          description="Browse our curated plant collection, then narrow the view by mood, form, or light needs."
        />

        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((filter) => (
            <Link
              key={filter.key}
              href={filter.key === "all" ? "/shop" : `/shop?filter=${filter.key}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter.key
                  ? "bg-sage text-white"
                  : "bg-white text-bark hover:bg-cream"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <ProductGrid products={plants} />
      </div>
    </section>
  );
}
