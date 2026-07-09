"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

export function FeatureCarousel({ children, className }: FeatureCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  function scrollByDirection(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>(":scope > *");
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 16;
    const distance = direction === "left" ? -(cardWidth + gap) : cardWidth + gap;

    track.scrollBy({ left: distance, behavior: "smooth" });
  }

  return (
    <div className={cn("relative mt-12 md:px-6", className)}>
      <button
        type="button"
        aria-label="Scroll capabilities left"
        onClick={() => scrollByDirection("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal shadow-md transition hover:bg-lavender disabled:pointer-events-none disabled:opacity-0 md:flex",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className="flex shrink-0 gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-2 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll capabilities right"
        onClick={() => scrollByDirection("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal shadow-md transition hover:bg-lavender disabled:pointer-events-none disabled:opacity-0 md:flex",
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
