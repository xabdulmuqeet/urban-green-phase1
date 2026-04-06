import { Skeleton } from "@/components/skeleton";

function FeaturedGuideSkeleton({ reverse = false }: { reverse?: boolean }) {
  return (
    <article className={`flex flex-col items-center gap-12 md:gap-10 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
      <div className="w-full md:w-1/2">
        <Skeleton className="aspect-[4/5] w-full rounded-none bg-[#eef1ea]" />
      </div>

      <div className="w-full md:w-1/2">
        <Skeleton className="mb-4 h-4 w-44 rounded-none" />
        <Skeleton className="mb-4 h-14 w-full max-w-[20rem] rounded-none" />
        <Skeleton className="mb-6 h-14 w-full max-w-[18rem] rounded-none" />
        <Skeleton className="h-5 w-full rounded-none" />
        <Skeleton className="mt-3 h-5 w-5/6 rounded-none" />
        <Skeleton className="mt-3 h-5 w-4/5 rounded-none" />
        <div className="mb-10 mt-8 flex flex-wrap gap-4">
          <Skeleton className="h-8 w-36 rounded-none bg-[#e1e3de]" />
          <Skeleton className="h-8 w-32 rounded-none bg-[#e1e3de]" />
        </div>
        <div className="inline-flex items-center gap-4">
          <Skeleton className="h-4 w-44 rounded-none" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default function CareGuideLoading() {
  const shellClassName = "mx-auto max-w-screen-2xl px-[80px]";

  return (
    <div className="pt-32">
      <section className={shellClassName}>
        <header className="mb-24">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Skeleton className="mb-4 h-4 w-36 rounded-none" />
              <Skeleton className="h-20 w-full max-w-[28rem] rounded-none" />
              <Skeleton className="mt-4 h-20 w-full max-w-[20rem] rounded-none" />
              <Skeleton className="mt-8 h-5 w-full max-w-[42rem] rounded-none" />
              <Skeleton className="mt-3 h-5 w-full max-w-[38rem] rounded-none" />
              <Skeleton className="mt-3 h-5 w-full max-w-[36rem] rounded-none" />
            </div>

            <div className="hidden md:block">
              <div className="h-48 w-48 rounded-full bg-[#eef1ea] p-1">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className="mb-24 bg-[#ecefea] py-24">
        <div className={shellClassName}>
          <div className="mb-16">
            <Skeleton className="mb-2 h-10 w-56 rounded-none" />
            <Skeleton className="h-4 w-48 rounded-none" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="flex min-h-[19rem] flex-col justify-between bg-white p-8">
                <div>
                  <Skeleton className="mb-6 h-8 w-8 rounded-full" />
                  <Skeleton className="mb-4 h-8 w-36 rounded-none" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded-none" />
                  <Skeleton className="h-4 w-5/6 rounded-none" />
                  <Skeleton className="h-4 w-4/5 rounded-none" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shellClassName} mb-32`}>
        <Skeleton className="mx-auto mb-16 h-12 w-72 rounded-none" />

        <div className="space-y-28">
          <FeaturedGuideSkeleton />
          <FeaturedGuideSkeleton reverse />
        </div>
      </section>

      <section className={`${shellClassName} mb-32`}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-64 rounded-none" />
            <Skeleton className="mx-auto h-5 w-full max-w-xl rounded-none" />
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#c6c6c6]/20 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="bg-[#f8faf5] p-10 md:p-12">
                <Skeleton className="mb-4 h-8 w-48 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="mt-3 h-4 w-5/6 rounded-none" />
                <Skeleton className="mt-3 h-4 w-4/5 rounded-none" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shellClassName} mb-24`}>
        <div className="relative overflow-hidden bg-[#2f4027] px-8 py-12 md:px-14 md:py-20">
          <div className="relative z-10 max-w-2xl">
            <Skeleton className="mb-4 h-14 w-full max-w-[26rem] rounded-none bg-white/20" />
            <Skeleton className="mb-8 h-14 w-full max-w-[20rem] rounded-none bg-white/20" />
            <Skeleton className="h-5 w-full max-w-[32rem] rounded-none bg-white/15" />
            <Skeleton className="mt-3 h-5 w-full max-w-[28rem] rounded-none bg-white/15" />
            <div className="mt-12 flex flex-wrap gap-5">
              <Skeleton className="h-14 w-44 rounded-none bg-white/30" />
              <Skeleton className="h-14 w-40 rounded-none bg-white/15" />
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#486730] opacity-40 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
