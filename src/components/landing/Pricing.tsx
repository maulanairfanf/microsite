"use client";

import { useState } from "react";
import { Card } from "@/components/landing/Components";

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    description: "Untuk kamu yang baru memulai",
    icon: "🌱",
    features: [
      { text: "1 Halaman", included: true },
      { text: "5 Link", included: true },
      { text: "3 Tema", included: true },
      { text: "Basic Analytics", included: true },
      { text: "Custom Domain", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Mulai Gratis",
    highlighted: false,
    gradient: "from-gray-400 to-gray-500",
  },
  {
    name: "Premium",
    price: "Rp 30.000",
    period: "per bulan",
    description: "Untuk kamu yang serius membangun brand",
    icon: "⭐",
    features: [
      { text: "Unlimited Halaman", included: true },
      { text: "Unlimited Link", included: true },
      { text: "Unlimited Tema Premium", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Custom Domain", included: true },
      { text: "Priority Support", included: true },
    ],
    cta: "Berlangganan",
    highlighted: true,
    gradient: "from-violet-500 via-pink-500 to-orange-500",
  },
];

export function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#faf5ff" }}>
      {/* Bright animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-300 via-pink-300 to-orange-300 rounded-full blur-[150px] opacity-50 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-300 via-blue-300 to-violet-300 rounded-full blur-[150px] opacity-50 animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-violet-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            💰 Harga Transparan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Pilih <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Paket</span>Mu
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Paket yang sesuai dengan kebutuhanmu
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div
                className={`pricing-card relative rounded-3xl overflow-hidden transition-all duration-500 ${
                  hoveredPlan === index ? "scale-[1.03]" : ""
                }`}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20">
                    <div
                      className="px-6 py-2 rounded-b-2xl text-white font-bold text-sm shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
                        boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.5)",
                      }}
                    >
                      ⭐ Paling Populer
                    </div>
                  </div>
                )}

                <Card
                  className={`relative overflow-hidden h-full ${
                    plan.highlighted
                      ? "border-2 shadow-xl"
                      : "border border-gray-200"
                  }`}
                  style={
                    plan.highlighted
                      ? {
                          borderColor: "#a855f7",
                          boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
                        }
                      : {}
                  }
                >
                  {/* Gradient header */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-br ${plan.gradient} opacity-15`}
                  />

                  {/* Card content */}
                  <div className="relative z-10">
                    {/* Icon and name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                          plan.highlighted
                            ? "bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500 text-white"
                            : "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                        }`}
                      >
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              feature.included
                                ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {feature.included ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              feature.included ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        plan.highlighted
                          ? "text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={
                        plan.highlighted
                          ? {
                              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
                              boxShadow: "0 15px 30px -5px rgba(124, 58, 237, 0.4)",
                            }
                          : {}
                      }
                    >
                      {plan.cta}
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center mt-10 text-gray-500 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Semua paket sudah termasuk fitur dasar. Upgrade kapan saja.
        </p>
      </div>
    </section>
  );
}
