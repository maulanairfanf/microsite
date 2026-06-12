"use client";

import { useState } from "react";
import { Card } from "@/components/landing/Components";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    title: "Mudah Digunakan",
    description:
      "Tidak perlu coding. Buat halaman professional dalam hitungan menit dengan antarmuka yang intuitif.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    title: "Branding Pribadi",
    description:
      "Pilih tema yang sesuai dengan kepribadianmu. Tampilkan identitasmu dengan warna dan font favorit.",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.19 8.688a4.5 4.5 0 011.562 8.29l4.12 4.121m-4.742-7.121l4.121-4.121a4.5 4.5 0 11-6.364-6.364l-1.121 1.121M5.55 5.55A17.92 17.92 0 0112 4c2.874 0 5.59.738 8.03 2.05"
        />
      </svg>
    ),
    title: "Link Unlimited",
    description:
      "Tambahkan sebanyak mungkin tautan. Dari media sosial hingga toko online, semua dalam satu tempat.",
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Analytics Sederhana",
    description:
      "Ketahui berapa banyak yang mengakses halamanmu. Data sederhana yang membantu kamu memahami audiens.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Bright background decorations */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200 via-purple-200 to-pink-200 rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/3 opacity-60" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-200 via-blue-200 to-violet-200 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-violet-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            ✨ Fitur Unggulan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Kenapa{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Halamanku
            </span>
            ?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Semua yang kamu butuhkan untuk membangun kehadiran digital yang menarik
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                hover
                className={`h-full relative overflow-hidden transition-all duration-500 ${
                  hoveredIndex === index ? "scale-[1.03] shadow-2xl" : ""
                }`}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 ${
                    hoveredIndex === index ? "opacity-10" : ""
                  }`}
                />

                {/* Animated icon */}
                <div
                  className={`feature-icon w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    hoveredIndex === index
                      ? `${feature.bgGradient} text-white shadow-lg scale-110`
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                  }`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900 relative z-10">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 relative z-10 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div
                  className={`mt-4 flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                    hoveredIndex === index ? "text-purple-600 gap-3" : "text-gray-400"
                  }`}
                >
                  <span>Selengkapnya</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      hoveredIndex === index ? "translate-x-1" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
