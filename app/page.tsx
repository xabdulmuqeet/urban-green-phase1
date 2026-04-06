import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { getAllPlants, getStartingPrice } from "@/lib/data";

const referenceImages = {
  hero:
    "https://images.pexels.com/photos/12285892/pexels-photo-12285892.jpeg?auto=compress&cs=tinysrgb&w=1600",
  living:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkglmg7pgC63_dSZUV8xtKxNIMzNXuMkfc8LkNkwr43hK1FMcBEe23sAuuzP-t-Ann03bEQOpLZdTnEWmk8yzYHBeVpHBACm3-obPU_Krf50WQWlArUZrTrp37fjKcYs17kWqtYovzXWWxQyn6HV-FuNlmjY-XJWonKq5vjjlzAndRYhwiXbqpCtOFZy2F5T1ED7ykK6gkHYhzkmnMFq0uT60b0fhZ9jjbbQbSY3wXapPszB3p12j5TN_uhUu8-DkDJufKe2QyNj0t",
  minimalist:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvrib1NUECH9bFqega-HxESY8t_DXvOtcCrJg8fVdD3DUYGwp-wmw1pKl_S5HcvM3BTsaq6PZmuJynLQnmXQGqvK4T-Jufym0OjjQvknVylwHDRI4IigLlqBTjr72y8nkUPn9cvjC8WfTruJBZh4pYPwwZYgxMuGw15seC6DSecyvLmf3T4lTiTM8LvxGOG2WKfzaE4tp2H9g2O_h293xM-LMv42Gwo-yV9YQNZlWSYK0Fu1X0Hcg-bz4Vq6PM-fCD8_V6ZuRHPakJ",
  bohemian:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCzVSWdUJfcF9uJgrP7S3Z6QKXStyKLvULjYL23bFMUbVfvuRYE4QQYhuvLNzqWmKhPdsN67W38vODFn7tgcXh5xb575bSl1ONLMhA4DW_SI4ZzeHx-VCvuqm3PgWrXh6L9I1abzHtKXdDDZN0PDyLdSbccoYEHVetveh6sDQTEFX6KzC6-msCVBxkRoXpvPraOdle2d-X_LWJsD1nimiLi-_lDGjdDvFNLiDEazQoAzJK9-fJi9AU-PTI1FG1FNuY02MzC-zInbDwq",
  leafCare:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAPYY_bt28AbXN0TsWCJH4F9ookW2FRjCoPBeDLx_xl-p-TWC6SDsfrwYCSfjK_oYt_ZLuSzvd_YxLuufD_RnX3wNH0SKe8WeJvoPXAfu1cLXFtePHYpWE-47MkajFEIVdFhdblwflvr0K5ezvYVUH1zpVnw_Z13I4m6h01yXhl7j69n_T1QVTCovlIeUvewassfFWHW9_2D1fYjCaGh3S56MVVCY7ViRJqU3T4kCygf84Ncw8xXuP-jxZipmq2euRvmMvc7tjc122N",
  interior:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDnH4O3KX5Wm6DGMlniww33rAH9uDwTGdZSMcpyDSyAkT1DH7uTg6M7kZWpiGeVEgm8qTlg9IQAjMKVy0Mb6_v60nLBWierJa4dmTcUvAr0RakArM71P_kad4-1FmNRSMkVCxx8tgXuGFNymRdBzEvAkWPEFMl84Jc5awdvkaNBT9AlgZsO2qdaZoAGv-nAOzPC_q1CMaTomMQvDNK-7yTerYdz5spZstkm7Etw60T9arSUzL6E1cq2TV6CG6KKnTLBe0ttcZbdk5vA"
};

const bundleSteps = [
  {
    number: "01",
    title: "Choose Your Base",
    description: "Select from our signature hand-potted foundation plants that anchor your space."
  },
  {
    number: "02",
    title: "Layer Texture",
    description: "Add secondary foliage or hanging species to create depth and visual interest."
  },
  {
    number: "03",
    title: "Botanical Care",
    description: "Receive custom care archival cards and nutrients tailored to your specific bundle."
  }
];

function pickRandomPlants<T>(items: T[], count: number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

export default function HomePage() {
  const plants = getAllPlants();
  const arrivals = pickRandomPlants(plants, 3);

  return (
    <>
      <section className="relative mt-24 flex h-[46rem] items-center overflow-hidden px-[80px]">
        <div className="absolute inset-0 z-0">
          <Image
            src={referenceImages.hero}
            alt="Minimal living room with a white sofa, warm wood, and an indoor plant"
            fill
            className="object-cover [transform:scaleX(-1)]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8faf5]/84 via-[#f8faf5]/42 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
          <div className="max-w-2xl">
            <p className="mb-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.3em] text-[#486730]">
              The Botanical Archivist
            </p>
            <h1 className="font-[family:var(--font-heading)] text-[3.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-[#191c1a] md:text-[5.5rem]">
              Curation for the <br />
              <i className="font-normal italic">Urban Soul</i>.
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/bundle"
                className="bg-[#516448] px-8 py-4 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#486730]"
              >
                Build Your Bundle
              </Link>
              <Link
                href="/shop"
                className="border border-[#516448]/20 bg-white/55 px-8 py-4 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.25em] text-[#516448] backdrop-blur-sm transition hover:bg-white"
              >
                Shop Plants
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 px-[80px]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-16 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-[family:var(--font-heading)] text-4xl text-[#486730]">New Arrivals</h2>
              <p className="mt-2 font-[family:var(--font-body)] text-sm text-[#516448]/60">
                Selected specimens for your collection.
              </p>
            </div>
            <Link
              href="/shop"
              className="border-b border-[#516448]/20 pb-1 font-[family:var(--font-body)] text-xs uppercase tracking-[0.24em] transition-colors hover:border-[#486730]"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {arrivals.map((plant, index) => (
              <article key={plant.id} className={`group ${index === 1 ? "md:mt-24" : ""}`}>
                <Link href={`/shop/${plant.id}`} className="relative mb-6 block aspect-[4/5] overflow-hidden bg-[#ecefea]">
                  <Image
                    src={plant.images[0]}
                    alt={plant.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {plant.tag ? (
                    <div className="absolute right-4 top-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#486730]">
                      {plant.tag}
                    </div>
                  ) : null}
                </Link>
                <h3 className="font-[family:var(--font-heading)] text-lg text-[#191c1a]">{plant.name}</h3>
                <p className="mb-2 mt-1 font-[family:var(--font-body)] text-xs uppercase tracking-[0.22em] text-[#516448]/60">
                  Category: {plant.category}
                </p>
                <p className="font-[family:var(--font-body)] font-bold text-[#486730]">
                  {formatCurrency(getStartingPrice(plant))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-40 bg-[#ecefea] px-[80px] py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative h-[37.5rem] overflow-hidden">
              <Image
                src={referenceImages.living}
                alt="Modern workspace with indoor plants and wooden shelves"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#486730]/20 transition-colors duration-500 group-hover:bg-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="mb-4 font-[family:var(--font-heading)] text-4xl text-white">Shop by Room</h3>
                <Link
                  href="/shop"
                  className="bg-white px-6 py-2 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.24em] text-[#486730]"
                >
                  Explore Living
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="group relative h-[17.75rem] overflow-hidden">
                <Image
                  src={referenceImages.minimalist}
                  alt="Collection of small succulents in pale ceramic pots"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#486730]/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-[family:var(--font-heading)] text-3xl text-white drop-shadow-md">
                    Minimalist Style
                  </h3>
                </div>
              </div>

              <div className="group relative h-[17.75rem] overflow-hidden">
                <Image
                  src={referenceImages.bohemian}
                  alt="Lush interior with layered tropical foliage"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#486730]/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-[family:var(--font-heading)] text-3xl text-white drop-shadow-md">
                    Bohemian Archive
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-32 px-[80px]">
        <div className="mx-auto max-w-screen-2xl text-center">
          <h2 className="mb-16 font-[family:var(--font-heading)] text-5xl text-[#486730]">
            The Archive Bundle
          </h2>
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-16 md:grid-cols-3">
            {bundleSteps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e1e3de]">
                  <span className="font-[family:var(--font-heading)] text-xl font-bold text-[#486730]">
                    {step.number}
                  </span>
                </div>
                <h4 className="mb-4 font-[family:var(--font-body)] text-sm font-bold uppercase tracking-[0.22em] text-[#486730]">
                  {step.title}
                </h4>
                <p className="font-[family:var(--font-body)] text-sm leading-relaxed text-[#516448]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-40 px-[80px]">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-[31.25rem] lg:col-span-4">
            <Image
              src={referenceImages.leafCare}
              alt="Hands misting a plant leaf in a bright studio"
              width={900}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center bg-[#486730] p-12 text-center text-white lg:col-span-4">
            <span className="material-symbols-outlined mb-6 text-4xl">eco</span>
            <h2 className="mb-8 font-[family:var(--font-heading)] text-4xl">Bring Nature Home</h2>
            <div className="flex flex-col gap-4">
              <Link
                href="/bundle"
                className="bg-white py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.24em] text-[#486730] transition-colors hover:bg-[#f8faf5]"
              >
                Build Your Bundle
              </Link>
              <Link
                href="/shop"
                className="border border-white/30 py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/10"
              >
                Shop Plants
              </Link>
              <Link
                href="/cart"
                className="py-2 font-[family:var(--font-body)] text-[10px] font-bold uppercase tracking-[0.24em] text-white/60 underline underline-offset-8 transition-colors hover:text-white"
              >
                Delivery Options
              </Link>
            </div>
          </div>

          <div className="h-[31.25rem] lg:col-span-4">
            <Image
              src={referenceImages.interior}
              alt="Airy living room with many potted plants"
              width={900}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
