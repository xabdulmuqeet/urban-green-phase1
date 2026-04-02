import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { SectionHeading } from "@/components/section-heading";
import { Skeleton } from "@/components/skeleton";

export default function ShopLoading() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Shop All"
          title="Design-led plants for elevated everyday living."
          description="Browse our curated plant collection, then narrow the view by mood, form, or light needs."
        />

        <div className="space-y-4 rounded-[1.75rem] border border-black/6 bg-white/88 p-4 shadow-[0_10px_30px_rgba(36,48,32,0.04)] backdrop-blur-sm sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bark/55">
              Search The Collection
            </p>
            <Skeleton className="mt-3 h-12 w-full rounded-full" />
          </div>
          <div className="hidden gap-3 lg:grid lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] lg:items-end">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-full" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="space-y-5 border-t border-black/5 pt-8">
          <Skeleton className="h-3 w-20" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
