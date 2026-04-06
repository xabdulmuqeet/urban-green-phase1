import Image from "next/image";
import Link from "next/link";
import { getPlantById } from "@/lib/data";

const essentials = [
  {
    icon: "light_mode",
    title: "Luminescence",
    description:
      "Understanding the dance of shadows. From bright indirect galleries to low-light sanctuaries."
  },
  {
    icon: "opacity",
    title: "Hydration",
    description:
      "Consistency is the key to longevity. We advocate for the finger-dip method before any saturation."
  },
  {
    icon: "potted_plant",
    title: "Substrate",
    description:
      "The foundation of health. Well-draining, nutrient-rich blends tailored for each species' roots."
  },
  {
    icon: "air",
    title: "Atmosphere",
    description:
      "Mimicking the tropical breath. Strategic humidity habits protect delicate fronds and new growth."
  }
];

const troubleshootingItems = [
  {
    title: "Yellowing Foliage",
    description:
      "Typically indicative of over-saturation. Ensure the root system is not resting in stagnant water and check for proper drainage."
  },
  {
    title: "Crispy Brown Edges",
    description:
      "A plea for humidity. Your specimen is likely suffering from dry air or inconsistent watering cycles."
  },
  {
    title: "Drooping Stems",
    description:
      "Often a sign of thirst or environmental shock. Check soil moisture and keep the placement free from cold drafts."
  },
  {
    title: "Small New Leaves",
    description:
      "Evidence of light deficiency. Relocate closer to a natural light source to encourage stronger growth."
  }
];

export default function CareGuidePage() {
  const monstera = getPlantById("monstera-deliciosa");
  const snakePlant = getPlantById("snake-plant-laurentii");
  const shellClassName = "mx-auto max-w-screen-2xl px-[80px]";

  const heroImage = monstera?.images[2] ?? monstera?.images[0] ?? "/products/generated/monstera-deliciosa-main.png";
  const featuredPrimaryImage =
    monstera?.images[0] ?? "/products/generated/monstera-deliciosa-main.png";
  const featuredSecondaryImage =
    snakePlant?.images[0] ?? "/products/generated/snake-plant-laurentii-main.png";

    return (
    <div className="pt-32">
      <section className={shellClassName}>
        <header className="mb-24">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-4 block font-[family:var(--font-body)] text-xs uppercase tracking-[0.3em] text-[#516448]">
                Archive No. 04
              </span>
              <h1 className="mb-8 font-[family:var(--font-heading)] text-5xl leading-[0.95] tracking-[-0.05em] text-[#486730] md:text-7xl">
                Botanical <br />
                <span className="font-normal italic">Care Guides</span>
              </h1>
              <p className="max-w-2xl font-[family:var(--font-body)] text-lg leading-8 text-[#516448]/78">
                A curated collection of wisdom for the modern plant archivist. We treat every
                specimen as a living masterpiece, requiring specific environmental conditions to
                flourish in your urban gallery.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="h-48 w-48 overflow-hidden rounded-full bg-[#eef1ea] p-1">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={heroImage}
                    alt="Top down detail of lush green foliage"
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className="mb-24 bg-[#ecefea] py-24">
        <div className={shellClassName}>
          <div className="mb-16">
            <h2 className="mb-2 font-[family:var(--font-heading)] text-3xl text-[#486730]">
              The Essentials
            </h2>
            <p className="font-[family:var(--font-body)] text-xs uppercase tracking-[0.24em] text-[#516448]/60">
              The Pillars of Sustenance
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {essentials.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[19rem] flex-col justify-between bg-white p-8"
              >
                <div>
                  <span className="material-symbols-outlined mb-6 block text-3xl text-[#486730]">
                    {item.icon}
                  </span>
                  <h3 className="mb-4 font-[family:var(--font-heading)] text-2xl text-[#486730]">
                    {item.title}
                  </h3>
                </div>
                <p className="font-[family:var(--font-body)] text-sm leading-7 text-[#516448]/80">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shellClassName} mb-32`}>
        <h2 className="mb-16 text-center font-[family:var(--font-heading)] text-4xl italic text-[#486730]">
          Featured Specimens
        </h2>

        <div className="space-y-28">
          <article className="flex flex-col items-center gap-12 md:flex-row md:gap-10">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef1ea]">
                <Image
                  src={featuredPrimaryImage}
                  alt="Monstera Deliciosa in a ceramic pot"
                  fill
                  className="object-cover grayscale-[0.15] transition duration-700 hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <span className="mb-4 block font-[family:var(--font-body)] text-xs uppercase tracking-[0.22em] text-[#516448]">
                Category: Araceae
              </span>
              <h3 className="mb-6 font-[family:var(--font-heading)] text-4xl leading-tight text-[#486730] md:text-5xl">
                Monstera <br />
                Deliciosa
              </h3>
              <p className="mb-8 font-[family:var(--font-body)] text-lg leading-8 text-[#516448]/82">
                The architectural centerpiece. Its dramatic fenestrations are a visual record of
                maturity, strong light discipline, and patient care over time.
              </p>
              <div className="mb-10 flex flex-wrap gap-4">
                <span className="bg-[#e1e3de] px-4 py-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#486730]">
                  Bright Indirect
                </span>
                <span className="bg-[#e1e3de] px-4 py-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#486730]">
                  Weekly Water
                </span>
              </div>
              <Link
                href="/shop/monstera-deliciosa"
                className="group inline-flex items-center gap-4 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.22em] text-[#486730]"
              >
                Explore Detailed Guide
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                  arrow_forward
                </span>
              </Link>
            </div>
          </article>

          <article className="flex flex-col items-center gap-12 md:flex-row-reverse md:gap-10">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef1ea]">
                <Image
                  src={featuredSecondaryImage}
                  alt="Snake Plant Laurentii in a minimal planter"
                  fill
                  className="object-cover grayscale-[0.15] transition duration-700 hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <span className="mb-4 block font-[family:var(--font-body)] text-xs uppercase tracking-[0.22em] text-[#516448]">
                Category: Asparagaceae
              </span>
              <h3 className="mb-6 font-[family:var(--font-heading)] text-4xl leading-tight text-[#486730] md:text-5xl">
                Sansevieria <br />
                Laurentii
              </h3>
              <p className="mb-8 font-[family:var(--font-body)] text-lg leading-8 text-[#516448]/82">
                The resilient sentinel. Structured, air-purifying, and almost architectural in its
                posture, it is the ideal companion for calmer, lower-light rooms.
              </p>
              <div className="mb-10 flex flex-wrap gap-4">
                <span className="bg-[#e1e3de] px-4 py-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#486730]">
                  Low To High Light
                </span>
                <span className="bg-[#e1e3de] px-4 py-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#486730]">
                  Dry Substrate
                </span>
              </div>
              <Link
                href="/shop/snake-plant-laurentii"
                className="group inline-flex items-center gap-4 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.22em] text-[#486730]"
              >
                Explore Detailed Guide
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                  arrow_forward
                </span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className={`${shellClassName} mb-32`}>
        <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[family:var(--font-heading)] text-4xl text-[#486730]">
            Troubleshooting
          </h2>
          <p className="mx-auto max-w-xl font-[family:var(--font-body)] text-base leading-7 text-[#516448]/75">
            Understanding the language of leaves and diagnosing common distress signals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[#c6c6c6]/20 md:grid-cols-2">
          {troubleshootingItems.map((item) => (
            <article
              key={item.title}
              className="bg-[#f8faf5] p-10 transition-colors hover:bg-white md:p-12"
            >
              <h3 className="mb-4 font-[family:var(--font-heading)] text-2xl italic text-[#486730]">
                {item.title}
              </h3>
              <p className="font-[family:var(--font-body)] text-sm leading-7 text-[#516448]/80">
                {item.description}
              </p>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section className={`${shellClassName} mb-24`}>
        <div className="relative overflow-hidden bg-[#2f4027] px-8 py-12 text-white md:px-14 md:py-20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="mb-8 font-[family:var(--font-heading)] text-4xl leading-tight md:text-5xl">
              Elevate your <br />
              Botanical Practice.
            </h2>
            <p className="mb-12 font-[family:var(--font-body)] text-lg leading-8 text-white/80">
              Access our specialized care kits or explore more design-led plants for your living
              archive.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                href="/shop"
                className="bg-[#f8faf5] px-8 py-4 font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.24em] text-[#486730] transition hover:bg-white"
              >
                Shop Care Kits
              </Link>
              <Link
                href="/bundle"
                className="border border-white/25 px-8 py-4 font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
              >
                Ask A Botanist
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#486730] opacity-40 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
