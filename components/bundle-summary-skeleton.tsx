import { Skeleton, SkeletonCard } from "@/components/skeleton";

export function BundleSummarySkeleton() {
  return (
    <SkeletonCard className="lg:sticky lg:top-28">
      <Skeleton className="h-4 w-28" />
      <div className="mt-6 space-y-5">
        {[1, 2, 3].map((section) => (
          <div key={section} className={section === 1 ? "" : "border-t border-black/5 pt-5"}>
            <div className="rounded-[1.5rem] bg-cream/25 p-4">
              <Skeleton className="h-3 w-16" />
              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-[1.75rem] bg-cream/60 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-black/5 pt-5">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </SkeletonCard>
  );
}
