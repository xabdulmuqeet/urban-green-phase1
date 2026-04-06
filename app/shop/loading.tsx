import { Skeleton } from "@/components/skeleton";

function ShopEditorialCardSkeleton({ offset = false }: { offset?: boolean }) {
  return (
    <article className={`group ${offset ? "md:mt-24" : ""}`}>
      <Skeleton className="mb-6 aspect-[4/5] w-full rounded-none bg-[#ecefea]" />
      <Skeleton className="h-8 w-2/3 rounded-none" />
      <Skeleton className="mt-3 h-4 w-36 rounded-none" />
      <Skeleton className="mt-4 h-6 w-24 rounded-none" />
    </article>
  );
}

export default function ShopLoading() {
  return (
    <main className="min-h-screen pt-32">
      <header className="mx-auto mb-10 max-w-screen-2xl px-[80px]">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
          <div>
            <Skeleton className="h-20 w-full max-w-[36rem] rounded-none" />
            <Skeleton className="mt-6 h-5 w-full max-w-md rounded-none" />
            <Skeleton className="mt-3 h-5 w-full max-w-sm rounded-none" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center border-b border-[#516448] py-4">
              <Skeleton className="mr-4 h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-full rounded-none" />
            </div>
          </div>
        </div>
      </header>

      <section className="mb-6 bg-[#ecefea] py-3">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-8 px-[80px]">
          <div className="flex gap-10 overflow-x-auto py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-24 rounded-none" />
            ))}
          </div>

          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-36 rounded-none bg-white" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-[80px]">
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <ShopEditorialCardSkeleton />
          <ShopEditorialCardSkeleton offset />
          <ShopEditorialCardSkeleton />
          <ShopEditorialCardSkeleton />
          <ShopEditorialCardSkeleton offset />
          <ShopEditorialCardSkeleton />
        </div>
      </section>
    </main>
  );
}
