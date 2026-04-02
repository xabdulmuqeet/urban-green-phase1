import { Skeleton, SkeletonCard } from "@/components/skeleton";

export function ProductCardSkeleton({ showActions = false }: { showActions?: boolean }) {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <div className="relative">
        <Skeleton className="h-[320px] w-full rounded-none" />
        <Skeleton className="absolute left-4 top-4 h-7 w-24 rounded-full" />
        <Skeleton className="absolute right-4 top-4 h-10 w-10 rounded-full" />
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            {!showActions ? <Skeleton className="h-3 w-20" /> : null}
          </div>
          {showActions ? (
            <div className="flex flex-wrap justify-end gap-1.5">
              <Skeleton className="h-8 w-12 rounded-full" />
              <Skeleton className="h-8 w-12 rounded-full" />
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
          ) : null}
        </div>
      </div>
      {showActions ? (
        <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      ) : null}
    </SkeletonCard>
  );
}
