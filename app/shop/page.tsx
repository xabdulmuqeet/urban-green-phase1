import Link from "next/link";
import type { ReactNode } from "react";
import { ShopEditorialCard } from "@/components/shop-editorial-card";
import {
  getPlantsForShopQuery,
  getShopConditionFromSearchParam,
  getShopConditionOptions,
  getShopFilterFromSearchParam,
  getShopPriceFromSearchParam,
  getShopPriceOptions,
  getShopSizeFromSearchParam,
  getShopSizeOptions,
  getShopSortFromSearchParam,
  getShopSortOptions
} from "@/lib/data";

const editorialCategories = [
  { label: "All Species", key: "all" },
  { label: "Statement", key: "statement" },
  { label: "Low Light", key: "low-light" },
  { label: "Tropicals", key: "tropicals" },
  { label: "Rare Finds", key: "rare-finds" }
] as const;

function FilterSelect({
  name,
  defaultValue,
  children
}: {
  name: string;
  defaultValue: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        defaultValue={defaultValue}
        className="appearance-none border border-[#516448]/20 bg-white px-4 py-2 pr-10 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-[#486730] outline-none"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#486730]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.25 4.5L6 8.25L9.75 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

type ShopPageProps = {
  searchParams?: {
    filter?: string;
    search?: string;
    condition?: string;
    size?: string;
    price?: string;
    sort?: string;
  };
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const activeFilter = getShopFilterFromSearchParam(searchParams?.filter);
  const activeCondition = getShopConditionFromSearchParam(searchParams?.condition);
  const activeSize = getShopSizeFromSearchParam(searchParams?.size);
  const activePrice = getShopPriceFromSearchParam(searchParams?.price);
  const activeSort = getShopSortFromSearchParam(searchParams?.sort);
  const searchQuery = searchParams?.search?.trim() ?? "";

  const plants = getPlantsForShopQuery({
    filter: activeFilter,
    search: searchQuery,
    condition: activeCondition,
    size: activeSize,
    price: activePrice,
    sort: activeSort
  });

  const priceOptions = getShopPriceOptions();
  const conditionOptions = getShopConditionOptions();
  const sizeOptions = getShopSizeOptions();
  const sortOptions = getShopSortOptions();

  const buildFilterHref = (filterKey: string) => {
    const params = new URLSearchParams();

    if (filterKey !== "all") params.set("filter", filterKey);
    if (searchQuery) params.set("search", searchQuery);
    if (activeCondition !== "all") params.set("condition", activeCondition);
    if (activeSize !== "all") params.set("size", activeSize);
    if (activePrice !== "all") params.set("price", activePrice);
    if (activeSort !== "featured") params.set("sort", activeSort);

    const queryString = params.toString();
    return queryString ? `/shop?${queryString}` : "/shop";
  };

  return (
    <>
      <main className="min-h-screen pt-32">
        <header className="mx-auto mb-10 max-w-screen-2xl px-[80px]">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
            <div>
              <h1 className="font-[family:var(--font-heading)] text-5xl leading-none tracking-[-0.05em] text-[#486730] md:text-7xl">
                Curated Specimens
              </h1>
              <p className="mt-6 max-w-md font-[family:var(--font-body)] leading-relaxed text-[#516448] opacity-80">
                A digital herbarium of rare and resilient flora, sourced for the contemporary
                collector. Each plant is hand-selected for its architectural silhouette.
              </p>
            </div>

            <form className="flex flex-col gap-4">
              <div className="group flex items-center border-b border-[#516448] py-4">
                <span className="material-symbols-outlined mr-4 text-[22px] text-[#516448]">
                  search
                </span>
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="FIND YOUR NEXT SPECIES"
                  className="w-full border-none bg-transparent font-[family:var(--font-body)] text-sm uppercase tracking-[0.2em] text-[#486730] placeholder-[#516448]/40 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </header>

        <section className="mb-6 bg-[#ecefea] py-3">
          <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-8 px-[80px]">
            <div className="no-scrollbar flex gap-10 overflow-x-auto py-2">
              {editorialCategories.map((filter) => (
                <Link
                  key={filter.key}
                  href={buildFilterHref(filter.key)}
                  className={`font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.2em] ${
                    activeFilter === filter.key
                      ? "border-b-2 border-[#486730] pb-1 text-[#486730]"
                      : "text-[#486730]/60 transition-colors hover:text-[#486730]"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>

            <form className="flex gap-4">
              <FilterSelect name="condition" defaultValue={activeCondition}>
                {conditionOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
              <FilterSelect name="sort" defaultValue={activeSort}>
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
              <FilterSelect name="price" defaultValue={activePrice}>
                {priceOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
              <FilterSelect name="size" defaultValue={activeSize}>
                {sizeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-[80px]">
          {plants.length > 0 ? (
            <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {plants.map((plant) => (
                <ShopEditorialCard
                  key={plant.id}
                  product={plant}
                  imageSrc={plant.images[0]}
                  badge={plant.tag}
                  metadata={[plant.condition, plant.plantSize]}
                />
              ))}
            </div>
          ) : (
            <div className="border border-black/8 bg-white p-10 text-center">
              <p className="font-[family:var(--font-heading)] text-3xl tracking-[-0.03em] text-[#243020]">
                No plants matched that combination.
              </p>
              <p className="mt-3 text-sm leading-7 text-bark/75">
                Try widening the filters or resetting the search to return to the full collection.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
