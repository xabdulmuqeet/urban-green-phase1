import { BundleWizard } from "@/components/bundle-wizard";
import { SectionHeading } from "@/components/section-heading";
import { getAllPlants } from "@/lib/data";

type BundlePageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function BundlePage({ searchParams }: BundlePageProps) {
  const plants = getAllPlants();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const editKey = resolvedSearchParams?.edit ?? null;

  return (
    <section className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Build A Bundle"
          title="Layer a plant, pot, and finishing extras into one calm composition."
          description="Move through the wizard step by step. Pot choices adapt to the plant size you pick, and the 10% bundle discount appears automatically when your set is complete."
        />
        <BundleWizard plants={plants} editKey={editKey} />
      </div>
    </section>
  );
}
