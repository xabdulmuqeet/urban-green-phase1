"use client";

import { useState } from "react";

type CareTabsProps = {
  care: {
    light: string;
    watering: string;
    commonIssues: string;
  };
};

const tabLabels = ["Watering", "Light", "Common Issues"] as const;

export function CareTabs({ care }: CareTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabLabels)[number]>("Watering");

  const tabContent = {
    Watering: care.watering,
    Light: care.light,
    "Common Issues": care.commonIssues
  };

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
      <div className="grid grid-cols-3 gap-3">
        {tabLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(label)}
            className={`min-w-0 rounded-full px-3 py-3 text-center text-sm font-medium transition sm:px-4 ${
              activeTab === label
                ? "bg-terracotta text-white"
                : "border border-black/5 bg-cream text-bark hover:bg-sage/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] bg-cream/50 p-5 text-sm leading-6 text-bark/80">
        <p className="mb-3 font-semibold leading-none text-foreground">{activeTab}</p>
        <p>{tabContent[activeTab]}</p>
      </div>
    </div>
  );
}
