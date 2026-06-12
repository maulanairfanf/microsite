"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Bright gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
        }}
      />

      {/* Bright floating shapes */}
      <div className="absolute top-10 left-[10%] w-64 h-64 bg-yellow-300 rounded-full blur-[120px] opacity-60 animate-float" />
      <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-pink-300 rounded-full blur-[150px] opacity-60 animate-float-delayed" />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-yellow-300 rounded-full opacity-70 animate-bounce delay-300" />
      <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-cyan-300 rounded-full opacity-60 animate-float delay-200" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/25 backdrop-blur-md mb-6">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <span className="text-white text-sm font-semibold">Gratis untuk memulai</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Siap Membuat <span className="text-yellow-300">Halamanmu</span>?
        </h2>
        <p className="mt-4 text-xl text-white/90">
          Mulai sekarang, gratis. Tidak perlu kartu kredit.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/sign-up"
            className="px-10 py-4 bg-yellow-400 text-purple-700 rounded-xl font-bold text-lg hover:bg-yellow-300 shadow-xl transition-all hover:scale-105"
          >
            Daftar Gratis
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">No credit card required</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Setup in 2 minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <svg
                className="w-5 h-5 text-pink-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-gray-200 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-violet-100 via-pink-100 to-rose-100 rounded-full blur-[100px] opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                Halamanku
              </span>
            </div>
            <p className="mt-4 text-gray-600 max-w-sm leading-relaxed">
              Buat Halamanmu, Ceritakan Dirimu. Platform link-in-bio sederhana untuk membangun
              kehadiran digitalmu.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              {[
                { icon: "𝕏", label: "Twitter", gradient: "from-gray-500 to-gray-600" },
                { icon: "📷", label: "Instagram", gradient: "from-pink-500 to-rose-500" },
                { icon: "💼", label: "LinkedIn", gradient: "from-blue-500 to-blue-600" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center text-lg text-white shadow-md hover:shadow-lg hover:scale-110 transition-all`}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Produk</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Harga
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Contoh
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Perusahaan</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600 transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-violet-600 transition-colors">
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {currentYear} Halamanku. Semua hak dilindungi.</p>
          <p className="text-sm text-gray-500">Dibuat dengan 💜 untuk kreator Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
