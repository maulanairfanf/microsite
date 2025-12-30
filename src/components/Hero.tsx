"use client";

import { useEffect, useState } from "react";
import { HeroComponent } from "@/types/components";
import Image from "next/image";

export function Hero({ data }: { data: HeroComponent }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareHref = `https://wa.me/?text=${encodeURIComponent(
    `${data.title} - ${currentUrl || ""}`
  )}`;

  return (
    <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={data.image}
        alt={data.title}
        fill
        className="object-cover absolute inset-0"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Share Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-md backdrop-blur hover:bg-white"
        >
          <span aria-hidden>📤</span>
          <span>Share</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8">
        {data.logo && (
          <div className="mb-6 flex items-center justify-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/80 bg-white/20 shadow-lg">
              <Image
                src={data.logo}
                alt={`${data.title} logo`}
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            </div>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">
          {data.title}
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl">
          {data.subtitle}
        </p>
      </div>

      {isShareOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Share</h2>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close share popup"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={shareHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-green-500 hover:bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="text-xl">🟢</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-500">Share this page</p>
                  </div>
                </div>
                <span aria-hidden className="text-gray-400">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
