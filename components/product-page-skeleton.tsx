import { Skeleton } from "@/components/skeleton";

export function ProductPageSkeleton() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-0 pt-32">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
            <Skeleton className="aspect-[4/4.6] w-full rounded-none bg-[#ecefea] sm:col-span-2" />
            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-none bg-[#ecefea]" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24 rounded-none bg-[#e1e3de]" />
                  <Skeleton className="h-8 w-24 rounded-none bg-[#e1e3de]" />
                </div>
                <Skeleton className="h-16 w-full max-w-[26rem] rounded-none" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <Skeleton className="h-5 w-full max-w-md rounded-none" />
            <Skeleton className="h-5 w-5/6 rounded-none" />
          </div>

          <div className="bg-[#f2f4ef] p-8 sm:p-10">
            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-[#777777]/20 pb-4">
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="h-10 w-28 rounded-none" />
              </div>

              <div className="space-y-4 pt-1">
                <Skeleton className="h-3 w-28 rounded-none" />
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-14 w-full rounded-none bg-white" />
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16 rounded-none" />
                  <Skeleton className="h-3 w-28 rounded-none" />
                </div>
                <div className="inline-flex items-center gap-3 border border-[#c6c6c6]/40 bg-white px-3 py-2">
                  <Skeleton className="h-9 w-9 rounded-none" />
                  <Skeleton className="h-5 w-6 rounded-none" />
                  <Skeleton className="h-9 w-9 rounded-none" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Skeleton className="h-14 w-full rounded-none bg-[#dfe5d9]" />
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-44 rounded-none" />
                </div>
                <div className="flex items-center justify-center gap-4 border-t border-[#777777]/12 pt-4">
                  <Skeleton className="h-3 w-16 rounded-none" />
                  <Skeleton className="h-1 w-1 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-2 border-b border-[#777777]/20 pb-6">
              <Skeleton className="h-4 w-36 rounded-none" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-3 w-20 rounded-none" />
                      <Skeleton className="h-4 w-full rounded-none" />
                      <Skeleton className="h-4 w-5/6 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-32 space-y-16">
        <div className="mx-auto max-w-5xl text-center">
          <Skeleton className="mx-auto h-12 w-[28rem] rounded-none" />
          <Skeleton className="mx-auto mt-8 h-5 w-full max-w-[64rem] rounded-none" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-[60rem] rounded-none" />
          <Skeleton className="mx-auto mt-6 h-5 w-full max-w-[64rem] rounded-none" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-[56rem] rounded-none" />
        </div>

        <div className="grid grid-cols-1 gap-1 overflow-hidden md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`${index === 1 ? "bg-[#e7e9e4]" : "bg-[#eef1ea]"} p-12`}
            >
              <Skeleton className="h-8 w-12 rounded-none" />
              <Skeleton className="mt-4 h-4 w-36 rounded-none" />
              <Skeleton className="mt-4 h-4 w-full rounded-none" />
              <Skeleton className="mt-2 h-4 w-5/6 rounded-none" />
              <Skeleton className="mt-2 h-4 w-3/4 rounded-none" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-[#777777]/20 pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton className="h-3 w-20 rounded-none" />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Skeleton className="h-12 w-72 rounded-none" />
              <Skeleton className="h-6 w-28 rounded-none" />
            </div>
            <Skeleton className="mt-3 h-4 w-56 rounded-none" />
          </div>
          <Skeleton className="h-6 w-32 rounded-none" />
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="border border-[#777777]/10 bg-[#f2f4ef] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28 rounded-none" />
                  <Skeleton className="h-3 w-24 rounded-none" />
                </div>
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
              <Skeleton className="mt-4 h-4 w-full rounded-none" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-none" />
            </div>
          ))}
        </div>

        <div className="mt-24 border border-[#777777]/10 bg-[#eef1ea] p-6 sm:mt-28">
          <Skeleton className="h-4 w-28 rounded-none" />
          <div className="mt-4 space-y-4">
            <div>
              <Skeleton className="h-4 w-16 rounded-none" />
              <Skeleton className="mt-2 h-12 w-full rounded-none bg-white" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 rounded-none" />
              <Skeleton className="mt-2 h-32 w-full rounded-none bg-white" />
            </div>
            <Skeleton className="h-12 w-52 rounded-none bg-[#dfe5d9]" />
          </div>
        </div>

        <div className="h-10 sm:h-14" aria-hidden="true" />
      </section>
    </main>
  );
}
