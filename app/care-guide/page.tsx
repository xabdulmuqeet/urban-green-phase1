import Link from "next/link";

const careHighlights = [
  "Water only when the top layer of soil is ready, not on a rigid daily schedule.",
  "Bright indirect light works for most indoor plants, while fragile varieties need a stable environment.",
  "Rotate your planter every week so growth stays balanced and full."
];

export default function CareGuidePage() {
  return (
    <section className="section-space">
      <div className="page-shell space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">
            Care Guide
          </p>
          <h1 className="font-[family:var(--font-heading)] text-5xl text-foreground">
            Keep your new plants happy from day one.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-bark/75">
            A few simple habits make all the difference. Start here, then adjust for your plant&apos;s light and watering preferences.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
          <div className="space-y-4">
            {careHighlights.map((highlight) => (
              <p key={highlight} className="text-base leading-7 text-bark/80">
                {highlight}
              </p>
            ))}
          </div>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
          >
            Back To Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
