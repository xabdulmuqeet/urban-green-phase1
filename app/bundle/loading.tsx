import { BundleSummarySkeleton } from "@/components/bundle-summary-skeleton";
import { Skeleton } from "@/components/skeleton";

export default function BundleLoading() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-32">
      <header className="mb-16">
        <Skeleton className="mb-4 h-4 w-44 rounded-none" />
        <Skeleton className="mb-8 h-24 w-full max-w-[34rem] rounded-none" />
        <div className="h-px w-full bg-[#c6c6c6]/20" />
      </header>

      <div className="space-y-12">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[1.75rem] border border-black/5 bg-white px-5 py-4">
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="mt-3 h-8 w-40 rounded-none" />
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.66fr_0.34fr] lg:items-start">
            <div className="space-y-5">
              <div className="flex items-end justify-between gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-12 w-72 rounded-none" />
                  <Skeleton className="h-4 w-full max-w-md rounded-none" />
                  <Skeleton className="h-4 w-80 rounded-none" />
                </div>
                <Skeleton className="h-5 w-24 rounded-none" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-card">
                    <Skeleton className="h-64 w-full rounded-[1.5rem] bg-[#ecefea]" />
                    <div className="mt-4 space-y-3">
                      <Skeleton className="h-6 w-2/3 rounded-none" />
                      <Skeleton className="h-4 w-1/2 rounded-none" />
                      <Skeleton className="h-4 w-20 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BundleSummarySkeleton />
          </div>
        </div>

        <section className="mt-32 grid grid-cols-1 items-center gap-24 md:grid-cols-2">
          <div className="relative">
            <Skeleton className="aspect-square w-full rounded-none bg-[#f2f4ef]" />
            <div className="absolute -bottom-12 -right-12 hidden h-48 w-48 bg-[#ecefea] p-6 lg:block">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="mt-3 h-4 w-5/6 rounded-none" />
              <Skeleton className="mt-3 h-4 w-4/5 rounded-none" />
            </div>
          </div>

          <div>
            <Skeleton className="mb-6 h-4 w-36 rounded-none" />
            <Skeleton className="mb-4 h-14 w-full max-w-[32rem] rounded-none" />
            <Skeleton className="mb-8 h-14 w-full max-w-[28rem] rounded-none" />
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Skeleton className="mt-1 h-6 w-6 rounded-full" />
                  <div className="w-full space-y-3">
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-5/6 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
