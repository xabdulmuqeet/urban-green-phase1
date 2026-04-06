import { Skeleton } from "@/components/skeleton";

export function ProductCardSkeleton({ showActions = false }: { showActions?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[1.65rem] bg-[#eef1ea]">
        <Skeleton className="h-[320px] w-full rounded-none" />
        <Skeleton className="absolute left-4 top-4 h-7 w-24 rounded-full" />
        <Skeleton className="absolute right-4 top-4 h-10 w-10 rounded-full" />
      </div>
      <div className="space-y-4 px-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-10 w-3/5" />
          <div className="space-y-2">
            <Skeleton className="ml-auto h-5 w-20" />
            {!showActions ? <Skeleton className="ml-auto h-3 w-10" /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-12 rounded-full" />
          <Skeleton className="h-8 w-12 rounded-full" />
          <Skeleton className="h-8 w-14 rounded-full" />
        </div>
      </div>
      {showActions ? (
        <div className="grid grid-cols-2 gap-2 px-1">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      ) : null}
    </div>
  );
}
