import { Skeleton, SkeletonCard } from "@/components/skeleton";

export function OrderCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-44" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="ml-auto h-3 w-12" />
          <Skeleton className="ml-auto h-8 w-24" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] bg-cream/35 p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-4 w-40" />
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-12" />
          <div className="rounded-[1.35rem] border border-black/5 bg-white px-4 py-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
          <div className="rounded-[1.35rem] border border-black/5 bg-white px-4 py-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}
