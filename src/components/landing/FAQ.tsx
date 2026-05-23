"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Apa itu Halamanku?",
    answer: "Halamanku adalah platform untuk membuat link-in-bio seperti Linktree. Kamu bisa membuat halaman personal yang menampilkan semua tautan pentingmu dalam satu tempat.",
    icon: "🌐",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    question: "Bagaimana cara memulai?",
    answer: "Cukup daftar dengan email, pilih tema yang kamu suka, dan tambahkan tautanmu. Dalam hitungan menit, halamanmu sudah siap untuk dibagikan.",
    icon: "🚀",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    question: "Apakah gratis?",
    answer: "Ya! Paket gratis kami sudah cukup untuk memulai. Kamu bisa membuat 1 halaman dengan 5 link dan 3 pilihan tema. Jika butuh lebih, upgrade ke paket Premium.",
    icon: "💚",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    question: "Bisakah saya menggunakan domain sendiri?",
    answer: "Paket Premium memungkinkan kamu menggunakan domain kustom seperti namamu.com untuk halamanmu.",
    icon: "🔗",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    question: "Bagaimana dengan analytics?",
    answer: "Kami menyediakan analytics sederhana untuk semua paket. Kamu bisa melihat berapa banyak visitor halamanmu dan tautan mana yang paling banyak diklik.",
    icon: "📊",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    question: "Bisakah saya mengubah tampilan halaman?",
    answer: "Tentu! Kamu bisa mengubah warna, font, dan mengatur tata letak sesuai seleramu. Paket Premium memberikan akses ke lebih banyak tema premium.",
    icon: "🎨",
    gradient: "from-pink-500 to-violet-600",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Bright background decoration */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200 via-pink-200 to-rose-200 rounded-full blur-[150px] -translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-200 via-blue-200 to-violet-200 rounded-full blur-[150px] translate-x-1/2 opacity-50" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-violet-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            ❓ Tanya Jawab
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Pertanyaan yang Sering <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Diajukan</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Jawaban untuk hal-hal yang mungkin ingin kamu tanyakan
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "shadow-lg ring-2 ring-violet-200"
                  : "shadow-md hover:shadow-lg"
              }`}
              style={{
                backgroundColor: openIndex === index ? "#faf5ff" : "white",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gradient-to-r hover:from-violet-50 hover:to-pink-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${faq.gradient} text-white shadow-md`}
                  >
                    {faq.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </div>
                <svg
                  className={`w-6 h-6 text-violet-600 transition-all duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Animated content */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-violet-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after FAQ */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 shadow-lg">
          <p className="text-gray-600 mb-4 font-medium">Still have questions?</p>
          <a
            href="mailto:support@halamanku.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 shadow-lg shadow-violet-500/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}
