import { Skeleton } from "@/components/skeleton";

function OrderEntrySkeleton({ showDivider = true }: { showDivider?: boolean }) {
  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-7 w-52 rounded-none" />
        <Skeleton className="h-6 w-36 rounded-none" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-16 w-full max-w-[34rem] rounded-none" />
        <Skeleton className="h-16 w-full max-w-[28rem] rounded-none" />
        <Skeleton className="h-6 w-80 rounded-none" />
      </div>

      <div className="grid gap-8 border border-[#ecefea] bg-[#fdfdf9] p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-full max-w-[28rem] rounded-none" />
            <Skeleton className="h-6 w-full max-w-[24rem] rounded-none" />
            <Skeleton className="h-6 w-full max-w-[30rem] rounded-none" />
          </div>

          <Skeleton className="h-14 w-64 rounded-none" />
        </div>

        <div className="flex shrink-0 justify-start -space-x-6 md:justify-end">
          <Skeleton className="h-44 w-32 rounded-none ring-8 ring-[#fdfdf9]" />
          <Skeleton className="h-44 w-32 rounded-none ring-8 ring-[#fdfdf9]" />
        </div>
      </div>

      {showDivider ? <div className="mt-10 h-px w-full bg-[#ecefea]" /> : null}
    </article>
  );
}

export default function OrdersLoading() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-40">
      <header className="mb-20">
        <Skeleton className="h-16 w-96 rounded-none" />
        <Skeleton className="mt-4 h-5 w-72 rounded-none" />
      </header>

      <section className="space-y-10">
        <OrderEntrySkeleton />
        <OrderEntrySkeleton />
        <OrderEntrySkeleton showDivider={false} />
      </section>
    </main>
  );
}
