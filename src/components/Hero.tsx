"use client";

import { useEffect, useState } from "react";
import { HeroComponent } from "@/types/components";
import Image from "next/image";
import { IoShareOutline } from "react-icons/io5";

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
    <section className="relative w-full min-h-[10vh] flex items-center justify-center overflow-hidden ">
      {/* Background Image */}
      {data.image && (
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover absolute inset-0 opacity-10"
          priority
        />
      )}

      {/* Share Button */}
      <button
        type="button"
        onClick={() => setIsShareOpen(true)}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md transition-all cursor-pointer"
        aria-label="Share"
      >
        <IoShareOutline className="w-5 h-5 text-black"  />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-18 pb-16">
        {data.logo && (
          <div className="mb-5">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ">
              <Image
                src={data.logo}
                alt={`${data.title} logo`}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--headerTextColor)", fontFamily: "var(--headerFontFamily)" }}>
          {data.title}
        </h1>
        <p className="text-sm max-w-xs font-semibold" style={{ color: "var(--bodyText)", opacity: 0.85 }}>
          {data.subtitle}
        </p>
      </div>

      {isShareOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6" onClick={() => setIsShareOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "var(--headerTextColor)" }}>Share</h2>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="text-2xl leading-none"
                style={{ color: "var(--bodyText)", opacity: 0.6 }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <a
              href={shareHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-colors card-bg card-hover-bg"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
                <span className="text-white text-xl">💬</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--cardText)" }}>WhatsApp</p>
                <p className="text-xs" style={{ color: "var(--cardText)", opacity: 0.6 }}>Share via WhatsApp</p>
              </div>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
