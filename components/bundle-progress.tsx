type BundleProgressProps = {
  currentStep: number;
  canAccessStep: (step: number) => boolean;
  onStepClick: (step: number) => void;
};

const steps = [
  { id: 1, eyebrow: "Step 01", label: "Select Specimen" },
  { id: 2, eyebrow: "Step 02", label: "Choose Vessel" },
  { id: 3, eyebrow: "Step 03", label: "Final Review" }
];

export function BundleProgress({ currentStep, canAccessStep, onStepClick }: BundleProgressProps) {
  return (
    <section className="mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-4 md:gap-0">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isClickable = canAccessStep(step.id);

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                disabled={!isClickable}
                className={`text-left transition ${
                  isClickable ? "hover:opacity-100" : "cursor-not-allowed"
                } ${isActive ? "opacity-100" : "opacity-40"}`}
              >
                <span className="block font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#516448]/60">
                  {step.eyebrow}
                </span>
                <span className="mt-1 block font-[family:var(--font-heading)] text-xl tracking-[-0.03em] text-[#486730]">
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <div className="mx-4 h-px w-12 bg-[#486730]/30 md:mx-6" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-[#ecefea] md:w-64">
        <div
          className="h-full bg-[#486730] transition-all duration-700 ease-in-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
