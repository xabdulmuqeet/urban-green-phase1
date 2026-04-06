import { Skeleton } from "@/components/skeleton";

export function BundleSummarySkeleton() {
  return (
    <aside className="h-fit self-start bg-[#ecefea] p-8 lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
      <Skeleton className="h-10 w-44 rounded-none" />

      <div className="mb-12 mt-8 space-y-6">
        {[1, 2].map((section) => (
          <div key={section} className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#f8faf5]">
              <Skeleton className="h-full w-full rounded-none bg-[#e7e9e4]" />
            </div>
            <div className="mt-2 flex flex-1 items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded-none" />
                <Skeleton className="h-3 w-32 rounded-none" />
              </div>
              <Skeleton className="h-5 w-16 rounded-none" />
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-32 rounded-none" />
            <Skeleton className="h-4 w-14 rounded-none" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24 rounded-none" />
            <Skeleton className="h-4 w-14 rounded-none" />
          </div>
        </div>

        <div className="border-t border-[#777777]/30 pt-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 rounded-none" />
            <Skeleton className="h-5 w-16 rounded-none" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="h-5 w-16 rounded-none" />
          </div>
        </div>

        <div className="bg-[#e7e9e4] p-6">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="mt-4 h-14 w-40 rounded-none" />
        </div>

        <Skeleton className="h-14 w-full rounded-none bg-[#dfe5d9]" />
        <Skeleton className="mx-auto h-3 w-44 rounded-none" />
        <Skeleton className="h-12 w-full rounded-none" />
      </div>
    </aside>
  );
}
