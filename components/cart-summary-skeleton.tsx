import { Skeleton, SkeletonCard } from "@/components/skeleton";

export function CartSummarySkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard>
        <Skeleton className="h-4 w-32" />
        <div className="mt-6 space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-start justify-between gap-4 border-b border-black/5 pb-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {[1, 2].map((section) => (
        <SkeletonCard key={section}>
          <Skeleton className="h-4 w-28" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </SkeletonCard>
      ))}

      <SkeletonCard>
        <Skeleton className="h-4 w-24" />
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-5">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-full" />
      </SkeletonCard>
    </div>
  );
}

export function ShippingQuoteSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-black/10 bg-cream/20 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
