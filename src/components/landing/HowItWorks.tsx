"use client";

import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Daftar Gratis",
    description: "Buat akun hanya dengan email. Tidak perlu kartu kredit.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-6-6a4 4 0 100 8 4 4 0 000-8zm0 10v6m0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Pilih Tema",
    description: "Pilih dari berbagai tema yang sudah dirancang. Ubah warna sesuai seleramu.",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "bg-gradient-to-br from-pink-500 to-rose-600",
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
  },
  {
    number: "03",
    title: "Tambah Link",
    description: "Tambahkan tautan media sosial, toko online, atau apapun yang ingin kamu bagikan.",
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
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
  },
  {
    number: "04",
    title: "Selesai!",
    description: "Dapatkan link halamanmu dan bagikan ke mana saja.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#faf5ff" }}>
      {/* Bright animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-300 to-pink-300 rounded-full blur-[120px] opacity-50 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-300 to-blue-300 rounded-full blur-[120px] opacity-50 animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-violet-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            🚀 Langkah Mudah
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Cara{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Kerja
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Mulai dari nol sampai online dalam 4 langkah mudah
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step card */}
              <div
                className={`relative z-10 text-center p-8 rounded-3xl transition-all duration-500 ${
                  activeStep === index
                    ? "bg-white shadow-xl scale-105"
                    : "bg-white/70 hover:bg-white"
                }`}
              >
                {/* Animated number badge */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 ${
                    activeStep === index
                      ? `${step.bgGradient} text-white shadow-lg scale-110`
                      : "bg-gradient-to-br from-violet-100 to-pink-100 text-purple-600"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step number */}
                <span
                  className={`inline-block mt-4 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeStep === index
                      ? `${step.bgGradient} text-white`
                      : "bg-violet-100 text-purple-600"
                  }`}
                >
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{step.description}</p>

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-500 -z-10 ${
                    activeStep === index ? "opacity-10" : ""
                  }`}
                />
              </div>

              {/* Animated connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-[60%] right-[calc(-50%+8px)] z-0">
                  <svg
                    className={`w-[calc(100%+32px)] h-8 transition-all duration-500 ${
                      activeStep === index ? "opacity-100" : "opacity-40"
                    }`}
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,10 Q50,0 100,10"
                      fill="none"
                      stroke={activeStep === index ? "#7c3aed" : "#a855f7"}
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <circle
                      cx="50"
                      cy="5"
                      r="5"
                      fill={activeStep === index ? "#7c3aed" : "#a855f7"}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
