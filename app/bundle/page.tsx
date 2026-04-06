import Image from "next/image";
import { BundleWizard } from "@/components/bundle-wizard";
import { getAllPlants } from "@/lib/data";

const excludedBundlePlantIds = new Set([
  "monstera-deliciosa",
  "olive-tree",
  "snake-plant-laurentii"
]);

type BundlePageProps = {
  searchParams?: {
    edit?: string;
  };
};

export default async function BundlePage({ searchParams }: BundlePageProps) {
  const plants = getAllPlants().filter((plant) => !excludedBundlePlantIds.has(plant.id));
  const editKey = searchParams?.edit ?? null;

  return (
    <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-32">
      <header className="mb-16">
        <p className="mb-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.24em] text-[#516448]/55">
          Curate Your Collection
        </p>
        <h1 className="mb-8 font-[family:var(--font-heading)] text-6xl leading-none tracking-[-0.06em] text-[#486730] md:text-8xl">
          Bundle Builder
        </h1>
        <div className="h-px w-full bg-[#c6c6c6]/20" />
      </header>

      <div className="space-y-12">
        <BundleWizard plants={plants} editKey={editKey} />

        <section className="mt-32 grid grid-cols-1 items-center gap-24 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-[#f2f4ef]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB589DzISjpyyAMbqq673cda8hSvlLsXYs2Dh8l31PHUJxiXPmcRVGyqVWl2efMWVcQyjyfJBH_GB-foW5EbaJB-Xa4wzSgGC6uAJNrXB8VQBCY6hAXXssDyXCDrulFeOOlnM4NniEr7szD6HsgMGyeEt6ylHOTn8xcOFOiy6kJN-Fwex-fI6HmcWhC2HKOAfWpv3QkDS3OP5BSqqMVHKhZprX_-V3lWkDx62s1e14iIGRoOe03RajyWtEI4T-F8-IGWKQKwaA5_rj9"
                alt="Craftsmanship"
                width={1200}
                height={1200}
                className="h-full w-full object-cover grayscale opacity-80"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 hidden h-48 w-48 bg-[#ecefea] p-6 lg:block">
              <p className="font-[family:var(--font-heading)] text-sm italic leading-relaxed text-[#486730]">
                "We believe in a slow approach to botany. Every plant in our archive has a lineage
                we can trace."
              </p>
            </div>
          </div>

          <div>
            <span className="mb-6 block font-[family:var(--font-body)] text-xs uppercase tracking-[0.22em] text-[#516448]/55">
              The Archival Standard
            </span>
            <h2 className="mb-8 font-[family:var(--font-heading)] text-5xl leading-tight text-[#486730]">
              Nurtured with obsessive attention to detail.
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-[#486730]">eco</span>
                <p className="leading-relaxed text-[#474747]">
                  Our potting medium is custom blended for each genus, ensuring optimal drainage
                  and nutrient uptake from day one.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-[#486730]">inventory_2</span>
                <p className="leading-relaxed text-[#474747]">
                  Each bundle arrives in our signature archival packaging, designed to maintain
                  micro-climates during transit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
