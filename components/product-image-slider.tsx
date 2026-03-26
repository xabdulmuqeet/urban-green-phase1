"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImageSliderProps = {
  images: string[];
  name: string;
};

export function ProductImageSlider({ images, name }: ProductImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const previousImage = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const nextImage = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-3 shadow-card sm:col-span-2">
        <Image
          src={images[activeIndex]}
          alt={name}
          width={1200}
          height={1100}
          className="h-full w-full rounded-[1.5rem] object-cover"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous product image"
              className="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-bark shadow-sm"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next product image"
              className="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-bark shadow-sm"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
