type SizeSelectorProps = {
  sizes: string[];
};

export function SizeSelector({ sizes }: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">Choose size</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sizes.map((size, index) => (
          <button
            key={size}
            type="button"
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              index === 1
                ? "border-sage bg-sage/10 text-foreground"
                : "border-black/10 bg-white hover:border-sage/50"
            }`}
          >
            <span className="block font-semibold">{size}</span>
            <span className="mt-1 block text-sm text-bark/70">Tailored for styled interiors</span>
          </button>
        ))}
      </div>
    </div>
  );
}
