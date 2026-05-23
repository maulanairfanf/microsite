"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Bright gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
        }}
      />

      {/* Bright floating orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-300 rounded-full blur-[120px] opacity-70 animate-float" />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-pink-300 rounded-full blur-[150px] opacity-70 animate-float-delayed" />
      <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-cyan-300 rounded-full blur-[100px] opacity-70 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-300 rounded-full blur-[80px] opacity-60 animate-float delay-300" />

      {/* Decorative floating elements */}
      <div className="absolute top-[15%] left-[5%] w-16 h-16 border-4 border-white/40 rounded-2xl rotate-12 animate-float" />
      <div className="absolute top-[25%] right-[8%] w-12 h-12 bg-yellow-300 rounded-full opacity-80 animate-bounce-in delay-200" />
      <div className="absolute bottom-[30%] left-[8%] w-8 h-8 bg-cyan-300 rounded-full opacity-70 animate-float-delayed delay-300" />
      <div className="absolute bottom-[20%] right-[12%] w-14 h-14 border-4 border-pink-300/50 rounded-full animate-float delay-500" />
      <div className="absolute top-[50%] left-[3%] w-6 h-6 bg-white rounded-full opacity-60 animate-wiggle" />
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-orange-300 rounded-full opacity-50 animate-bounce delay-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/25 backdrop-blur-md mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <span className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
            <span className="text-white text-sm font-semibold">Gratis untuk memulai</span>
          </div>

          {/* Main headline */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Halamanku
          </h1>

          <p
            className={`text-2xl md:text-3xl text-white/90 mt-4 font-medium drop-shadow-sm transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Buat Halamanmu, Ceritakan Dirimu
          </p>

          <p
            className={`text-white/80 mt-6 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-sm transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Solusi sederhana untuk membuat link-in-bio yang menarik.
            Tampilkan semua tautan pentingmu dalam satu halaman yang elegan dan mudah diingat.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mt-10 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <button className="cta-button px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-purple-800 shadow-xl transition-all hover:scale-105">
              Mulai Gratis
            </button>
            <button className="cta-button px-8 py-4 border-2 border-white/50 text-white rounded-xl font-bold text-lg hover:bg-white/20 backdrop-blur transition-all hover:scale-105">
              Lihat Contoh
            </button>
          </div>

          {/* Animated stats */}
          <div
            className={`mt-20 flex items-center justify-center gap-4 md:gap-12 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {[
              { value: "3+", label: "Tenant Aktif", bg: "bg-yellow-400/30" },
              { value: "100%", label: "Gratis", bg: "bg-cyan-400/30" },
              { value: "No Code", label: "Mudah", bg: "bg-pink-400/30" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${index > 0 ? "hidden md:flex" : ""}`}
              >
                <div className={`px-6 py-2 rounded-2xl ${stat.bg} backdrop-blur-sm`}>
                  <p className="text-2xl font-bold text-white drop-shadow">{stat.value}</p>
                </div>
                <p className="text-sm text-white/80 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Phone mockup preview */}
          <div
            className={`mt-16 flex justify-center transition-all duration-700 delay-600 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
          >
            <div className="phone-mockup w-70 md:w-[320px] animate-float shadow-2xl">
              <div className="phone-screen p-6">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto bg-white/30 rounded-full mb-4 backdrop-blur" />
                  <h3 className="font-bold text-lg drop-shadow">John Doe</h3>
                  <p className="text-sm text-white/80">@johndoe</p>
                </div>
                <div className="mt-6 space-y-3">
                  {["Instagram", "Twitter", "YouTube", "Shopee"].map((item, i) => (
                    <div
                      key={item}
                      className="bg-white/25 backdrop-blur rounded-xl p-3 text-white text-sm font-semibold text-center hover:bg-white/40 transition-all"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
