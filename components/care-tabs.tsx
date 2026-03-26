type CareTabsProps = {
  care: {
    light: string;
    water: string;
    details: string;
  };
};

const tabLabels = ["Light", "Water", "Details"];

export function CareTabs({ care }: CareTabsProps) {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
      <div className="grid grid-cols-3 gap-3">
        {tabLabels.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`min-w-0 rounded-full px-3 py-3 text-center text-sm font-medium transition sm:px-4 ${
              index === 0
                ? "bg-terracotta text-white"
                : "border border-black/5 bg-cream text-bark hover:bg-sage/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 text-sm leading-6 text-bark/80 sm:grid-cols-3">
        <div>
          <p className="mb-3 font-semibold leading-none text-foreground">Light</p>
          <p>{care.light}</p>
        </div>
        <div>
          <p className="mb-3 font-semibold leading-none text-foreground">Water</p>
          <p>{care.water}</p>
        </div>
        <div>
          <p className="mb-3 font-semibold leading-none text-foreground">Details</p>
          <p>{care.details}</p>
        </div>
      </div>
    </div>
  );
}
