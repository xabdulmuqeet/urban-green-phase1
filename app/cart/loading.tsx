import { Skeleton } from "@/components/skeleton";

function CheckoutSectionSkeleton({
  step,
  title,
  rows
}: {
  step: string;
  title: string;
  rows: Array<"full" | "half">;
}) {
  return (
    <section>
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-8 w-10 rounded-none" />
        <Skeleton className="h-10 w-56 rounded-none" />
      </div>

      <div className="bg-[#f2f4ef] p-8">
        <div className="grid grid-cols-2 gap-6">
          {rows.map((row, index) => (
            <div key={`${step}-${title}-${index}`} className={row === "full" ? "col-span-2" : "col-span-1"}>
              <Skeleton className="mb-2 h-3 w-24 rounded-none" />
              <Skeleton className="h-12 w-full rounded-none bg-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CartLoading() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-32">
      <header className="mb-16">
        <Skeleton className="mb-4 h-4 w-44 rounded-none" />
        <Skeleton className="h-20 w-72 rounded-none" />
      </header>

      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <CheckoutSectionSkeleton step="01" title="Contact Information" rows={["full"]} />
          <CheckoutSectionSkeleton
            step="02"
            title="Shipping Address"
            rows={["half", "half", "full", "half", "half", "half", "half"]}
          />

          <section>
            <div className="mb-8 flex items-center gap-4">
              <Skeleton className="h-8 w-10 rounded-none" />
              <Skeleton className="h-10 w-44 rounded-none" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-44 rounded-none" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="border border-[#c6c6c6]/20 bg-white p-6">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40 rounded-none" />
                          <Skeleton className="h-3 w-32 rounded-none" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-[#ecefea] p-8 lg:p-12">
            <Skeleton className="mb-10 h-12 w-44 rounded-none" />

            <div className="mb-12 space-y-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center gap-6">
                  <Skeleton className="h-24 w-20 rounded-none bg-[#e1e3de]" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48 rounded-none" />
                    <Skeleton className="h-3 w-32 rounded-none" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded-none" />
                      <Skeleton className="h-4 w-10 rounded-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-[#486730]/10 pt-8">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-none" />
                <Skeleton className="h-4 w-20 rounded-none" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-none" />
                <Skeleton className="h-4 w-16 rounded-none" />
              </div>
              <div className="flex items-center justify-between border-t border-[#486730]/20 pt-4">
                <Skeleton className="h-8 w-28 rounded-none" />
                <Skeleton className="h-8 w-24 rounded-none" />
              </div>
            </div>

            <Skeleton className="mt-10 h-16 w-full rounded-none bg-[#dfe5d9]" />
            <div className="mt-6 flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-48 rounded-none" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
