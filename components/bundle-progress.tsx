type BundleProgressProps = {
  currentStep: number;
};

const steps = [
  { id: 1, label: "Select Plant" },
  { id: 2, label: "Select Pot" },
  { id: 3, label: "Extras" }
];

export function BundleProgress({ currentStep }: BundleProgressProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <div
            key={step.id}
            className={`rounded-[1.75rem] border px-5 py-4 transition ${
              isActive
                ? "border-sage bg-sage/10"
                : isComplete
                  ? "border-terracotta/30 bg-terracotta/10"
                  : "border-black/5 bg-white"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bark/60">
              Step {step.id}
            </p>
            <p className="mt-2 font-[family:var(--font-heading)] text-2xl">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
