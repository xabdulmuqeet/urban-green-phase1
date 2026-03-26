import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getAllPlants } from "@/lib/data";

export default function ShopPage() {
  const plants = getAllPlants();

  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Shop All"
          title="Design-led plants for elevated everyday living."
          description="Browse our full static collection of premium indoor plants, each paired with a considered care profile and sculptural presence."
        />

        <div className="flex flex-wrap items-center gap-3">
          {["All Plants", "Statement", "Trees", "Low Light"].map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                index === 0 ? "bg-sage text-white" : "bg-white text-bark hover:bg-cream"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <ProductGrid products={plants} />
      </div>
    </section>
  );
}
