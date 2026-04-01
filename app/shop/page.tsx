import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import {
  getPlantsForShopQuery,
  getShopConditionFromSearchParam,
  getShopConditionOptions,
  getShopFilterFromSearchParam,
  getShopFilterOptions,
  getShopPriceFromSearchParam,
  getShopPriceOptions,
  getShopSizeFromSearchParam,
  getShopSizeOptions,
  getShopSortFromSearchParam,
  getShopSortOptions
} from "@/lib/data";

type ShopPageProps = {
  searchParams?: Promise<{
    filter?: string;
    search?: string;
    condition?: string;
    size?: string;
    price?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeFilter = getShopFilterFromSearchParam(resolvedSearchParams?.filter);
  const activeCondition = getShopConditionFromSearchParam(resolvedSearchParams?.condition);
  const activeSize = getShopSizeFromSearchParam(resolvedSearchParams?.size);
  const activePrice = getShopPriceFromSearchParam(resolvedSearchParams?.price);
  const activeSort = getShopSortFromSearchParam(resolvedSearchParams?.sort);
  const searchQuery = resolvedSearchParams?.search?.trim() ?? "";
  const plants = getPlantsForShopQuery({
    filter: activeFilter,
    search: searchQuery,
    condition: activeCondition,
    size: activeSize,
    price: activePrice,
    sort: activeSort
  });
  const filterOptions = getShopFilterOptions();
  const conditionOptions = getShopConditionOptions();
  const sizeOptions = getShopSizeOptions();
  const priceOptions = getShopPriceOptions();
  const sortOptions = getShopSortOptions();

  const buildFilterHref = (filterKey: string) => {
    const params = new URLSearchParams();

    if (filterKey !== "all") {
      params.set("filter", filterKey);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (activeCondition !== "all") {
      params.set("condition", activeCondition);
    }
    if (activeSize !== "all") {
      params.set("size", activeSize);
    }
    if (activePrice !== "all") {
      params.set("price", activePrice);
    }
    if (activeSort !== "featured") {
      params.set("sort", activeSort);
    }

    const queryString = params.toString();
    return queryString ? `/shop?${queryString}` : "/shop";
  };

  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Shop All"
          title="Design-led plants for elevated everyday living."
          description="Browse our curated plant collection, then narrow the view by mood, form, or light needs."
        />

        <div className="space-y-4">
          <form className="space-y-4 rounded-[1.75rem] border border-black/6 bg-white/88 p-4 shadow-[0_10px_30px_rgba(36,48,32,0.04)] backdrop-blur-sm sm:p-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-bark/55">
                Search The Collection
              </span>
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by plant name, look, or room feel"
                className="mt-3 w-full rounded-full border border-black/10 bg-white px-5 py-3.5 text-sm text-foreground shadow-[0_8px_24px_rgba(36,48,32,0.05)] outline-none transition focus:border-sage"
              />
            </label>

            <details className="rounded-[1.35rem] border border-black/6 bg-cream/25 px-4 py-3.5 lg:hidden">
              <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.18em] text-bark/70">
                Refine
              </summary>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Category</p>
                  <select
                    name="filter"
                    defaultValue={activeFilter}
                    className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">
                      Price
                    </span>
                    <select
                      name="price"
                      defaultValue={activePrice}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">
                      Condition
                    </span>
                    <select
                      name="condition"
                      defaultValue={activeCondition}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                    >
                      {conditionOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">
                      Plant Size
                    </span>
                    <select
                      name="size"
                      defaultValue={activeSize}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                    >
                      {sizeOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">
                      Sort
                    </span>
                    <select
                      name="sort"
                      defaultValue={activeSort}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </details>

            <div className="hidden gap-3 lg:grid lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] lg:items-end">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Category</p>
                <select
                  name="filter"
                  defaultValue={activeFilter}
                  className="w-full rounded-full border border-black/10 bg-cream/25 px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                >
                  {filterOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Price</p>
                <label className="block">
                  <span className="sr-only">Price</span>
                  <select
                    name="price"
                    defaultValue={activePrice}
                    className="w-full rounded-full border border-black/10 bg-cream/25 px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                  >
                    {priceOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Condition</p>
                <label className="block">
                  <span className="sr-only">Condition</span>
                  <select
                    name="condition"
                    defaultValue={activeCondition}
                    className="w-full rounded-full border border-black/10 bg-cream/25 px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                  >
                    {conditionOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Plant Size</p>
                <label className="block">
                  <span className="sr-only">Plant Size</span>
                  <select
                    name="size"
                    defaultValue={activeSize}
                    className="w-full rounded-full border border-black/10 bg-cream/25 px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bark/55">Sort</p>
                <label className="block">
                  <span className="sr-only">Sort</span>
                  <select
                    name="sort"
                    defaultValue={activeSort}
                    className="w-full rounded-full border border-black/10 bg-cream/25 px-4 py-3 text-sm text-foreground outline-none transition focus:border-sage"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
              <button
                type="submit"
                className="rounded-full bg-sage px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#6b866e]"
              >
                Apply Filters
              </button>
              <Link
                href="/shop"
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition hover:border-sage hover:text-sage"
              >
                Reset
              </Link>
              <p className="text-sm text-bark/70">
                {plants.length} {plants.length === 1 ? "plant" : "plants"} found
              </p>
            </div>
          </form>
        </div>

        <div className="space-y-5 border-t border-black/5 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark/55">Category</p>
          <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((filter) => (
            <Link
              key={filter.key}
              href={buildFilterHref(filter.key)}
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
        </div>

        {plants.length > 0 ? (
          <ProductGrid products={plants} />
        ) : (
          <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
            <p className="font-[family:var(--font-heading)] text-3xl">No plants matched that combination.</p>
            <p className="mt-3 text-sm leading-6 text-bark/75">
              Try widening the price range, changing the plant size, or clearing a few filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
