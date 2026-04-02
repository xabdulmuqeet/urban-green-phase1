import { Skeleton, SkeletonCard } from "@/components/skeleton";

export function ProductPageSkeleton() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <SkeletonCard className="p-3 sm:col-span-1">
            <Skeleton className="h-[540px] w-full rounded-[1.5rem]" />
          </SkeletonCard>

          <div className="space-y-7 lg:space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>

            <SkeletonCard className="bg-cream/60">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </SkeletonCard>

            <SkeletonCard>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-7 w-36 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
                <div className="border-t border-black/5 pt-5">
                  <Skeleton className="h-4 w-24" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Skeleton className="h-11 w-20 rounded-full" />
                    <Skeleton className="h-11 w-20 rounded-full" />
                    <Skeleton className="h-11 w-20 rounded-full" />
                  </div>
                </div>
                <div className="border-t border-black/5 pt-5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-4 h-12 w-40 rounded-full" />
                </div>
                <div className="border-t border-black/5 pt-5">
                  <Skeleton className="h-12 w-full rounded-full" />
                  <Skeleton className="mt-3 h-12 w-full rounded-full" />
                  <div className="mt-4 flex gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            </SkeletonCard>
          </div>
        </div>

        <SkeletonCard>
          <div className="space-y-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-56" />
            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-cream/50 p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
              <div className="rounded-[1.5rem] bg-cream/50 p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
              </div>
            </div>
          </div>
        </SkeletonCard>
      </div>
    </section>
  );
}
