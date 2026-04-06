import { Skeleton } from "@/components/skeleton";

export function ProductPageSkeleton() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-0 pt-32">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="space-y-6">
            <Skeleton className="aspect-[4/4.6] w-full rounded-none bg-[#ecefea]" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-none bg-[#ecefea]" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="h-16 w-full max-w-[26rem] rounded-none" />
            <Skeleton className="h-6 w-full rounded-none" />
            <Skeleton className="h-6 w-5/6 rounded-none" />
          </div>

          <div className="border border-[#ecefea] bg-[#fdfdf9] p-8">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-8 w-28 rounded-none" />
                <Skeleton className="h-8 w-24 rounded-none" />
                <Skeleton className="h-8 w-20 rounded-none" />
              </div>
              <Skeleton className="h-5 w-32 rounded-none" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-11 w-24 rounded-none" />
                <Skeleton className="h-11 w-24 rounded-none" />
                <Skeleton className="h-11 w-24 rounded-none" />
              </div>
              <Skeleton className="h-px w-full rounded-none" />
              <Skeleton className="h-14 w-full rounded-none bg-[#e7e9e4]" />
              <Skeleton className="h-14 w-full rounded-none" />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-32 space-y-16">
        <div className="mx-auto max-w-5xl text-center">
          <Skeleton className="mx-auto h-12 w-96 rounded-none" />
          <Skeleton className="mx-auto mt-8 h-5 w-full max-w-[60rem] rounded-none" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-[56rem] rounded-none" />
          <Skeleton className="mx-auto mt-6 h-5 w-full max-w-[60rem] rounded-none" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-[52rem] rounded-none" />
        </div>

        <div className="grid grid-cols-1 gap-1 overflow-hidden md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`${index === 1 ? "bg-[#e7e9e4]" : "bg-[#eef1ea]"} p-12`}
            >
              <Skeleton className="h-8 w-16 rounded-none" />
              <Skeleton className="mt-4 h-4 w-32 rounded-none" />
              <Skeleton className="mt-4 h-4 w-full rounded-none" />
              <Skeleton className="mt-2 h-4 w-5/6 rounded-none" />
              <Skeleton className="mt-2 h-4 w-3/4 rounded-none" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="space-y-10">
          <div className="h-px w-full bg-[#ecefea]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded-none" />
                <Skeleton className="h-12 w-80 rounded-none" />
                <Skeleton className="h-5 w-64 rounded-none" />
              </div>
              <Skeleton className="hidden h-6 w-36 rounded-none md:block" />
            </div>
            <Skeleton className="h-20 w-full rounded-none bg-[#f2f4ef]" />
            <div className="mt-16 bg-[#f2f4ef] p-8">
              <Skeleton className="h-4 w-32 rounded-none" />
              <Skeleton className="mt-10 h-5 w-80 rounded-none" />
              <Skeleton className="mt-6 h-12 w-52 rounded-none bg-[#e7e9e4]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
