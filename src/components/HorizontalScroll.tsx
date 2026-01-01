"use client";

import { useRef, ReactNode } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface HorizontalScrollProps {
  children: ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;
      const start = container.scrollLeft;
      const target = direction === "left" ? start - scrollAmount : start + scrollAmount;
      const duration = 500; // 500ms for smooth scroll
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollLeft = start + (target - start) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  };

  return (
    <div className="relative group">
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-3 -mx-6 px-6 scrollbar-hide"
      >
        {children}
      </div>

      {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-gray-50"
        aria-label="Scroll left"
      >
        <MdChevronLeft size={20} className="text-gray-700" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-gray-50"
        aria-label="Scroll right"
      >
        <MdChevronRight size={20} className="text-gray-700" />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
