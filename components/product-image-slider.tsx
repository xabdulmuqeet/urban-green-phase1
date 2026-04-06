"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ProductImageSliderProps = {
  images: string[];
  name: string;
};

export function ProductImageSlider({ images, name }: ProductImageSliderProps) {
  const visibleImages = images.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(visibleImages.length - 1, 0)));
  }, [visibleImages.length]);

  const previousImage = () => {
    setActiveIndex((current) => (current === 0 ? visibleImages.length - 1 : current - 1));
  };

  const nextImage = () => {
    setActiveIndex((current) => (current === visibleImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
      <div className="relative overflow-hidden sm:col-span-2">
        <Image
          src={visibleImages[activeIndex]}
          alt={name}
          width={1200}
          height={1100}
          className="h-full w-full object-cover"
        />

        {visibleImages.length > 1 ? (
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

      {visibleImages.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:col-span-2">
          {visibleImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View product image ${index + 1}`}
              className={`overflow-hidden transition ${
                activeIndex === index
                  ? "ring-1 ring-[#516448] shadow-[0_10px_24px_rgba(62,79,55,0.12)]"
                  : "hover:ring-1 hover:ring-[#516448]/40"
              }`}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                width={240}
                height={240}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
