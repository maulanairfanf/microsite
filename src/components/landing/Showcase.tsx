"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/landing/Components";

const showcaseTenants: Array<{
  tenant_id: string;
  name: string;
  description: string;
  theme: "dark" | "light";
  colors: string[];
  links: string[];
}> = [
  {
    tenant_id: "kerabat-jenggala",
    name: "Kerabat Jenggala",
    description: "Kedai kopi specialty dengan berbagai pilihan kopi dan pastry",
    theme: "dark",
    colors: ["#7c3aed", "#a855f7", "#ec4899"],
    links: ["Menu Kopi", "Reservasi", "Instagram", "Shopee"],
  },
  {
    tenant_id: "pempek-ibu-wati",
    name: "Pempek Ibu Wati",
    description: "Pempek rumahan autentik dengan resep turun-temurun",
    theme: "light",
    colors: ["#06b6d4", "#22d3ee", "#a855f7"],
    links: ["Produk", "Testimoni", "WhatsApp", "Tokopedia"],
  },
];

function PhoneMockup({
  name,
  username,
  colors,
  links,
  theme,
}: {
  name: string;
  username: string;
  colors: string[];
  links: string[];
  theme: "dark" | "light";
}) {
  const bgGradient = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  const linkBg = theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)";
  const textColor = "white";

  return (
    <div className="phone-mockup w-[260px] mx-auto animate-float shadow-2xl">
      <div className="phone-screen p-5" style={{ background: bgGradient }}>
        <div className="text-center text-white mb-5">
          <div className="w-14 h-14 mx-auto rounded-full mb-3 backdrop-blur" style={{ background: linkBg }} />
          <h3 className="font-bold text-lg drop-shadow">{name}</h3>
          <p className="text-sm text-white/80">@{username}</p>
        </div>
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link}
              className="rounded-xl p-3 text-center backdrop-blur text-sm font-semibold"
              style={{ background: linkBg, color: textColor }}
            >
              {link}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [hoveredTenant, setHoveredTenant] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Bright background decorations */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200 via-pink-200 to-rose-200 rounded-full blur-[150px] translate-x-1/3 opacity-50" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200 via-blue-200 to-violet-200 rounded-full blur-[150px] -translate-x-1/3 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 rounded-full text-sm font-bold mb-4">
            📱 Lihat Contoh
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contoh <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Halaman</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Lihat bagaimana Halamanku membantu mereka yang membutuhkan
          </p>
        </div>

        {/* Interactive showcase with phone mockups */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {showcaseTenants.map((tenant) => (
            <div
              key={tenant.tenant_id}
              className="relative group"
              onMouseEnter={() => setHoveredTenant(tenant.tenant_id)}
              onMouseLeave={() => setHoveredTenant(null)}
            >
              <Link href={`/${tenant.tenant_id}`} target="_blank">
                <Card
                  hover
                  className={`relative overflow-hidden transition-all duration-500 ${
                    hoveredTenant === tenant.tenant_id ? "scale-[1.02] shadow-2xl" : ""
                  }`}
                >
                  {/* Preview image background */}
                  <div className="relative h-[420px] -mx-6 -mt-6 mb-6 overflow-hidden">
                    {/* Blurred background preview */}
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-110 filter blur-lg opacity-40"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${tenant.colors[0]}, ${tenant.colors[1]}, ${tenant.colors[2]})`,
                      }}
                    />

                    {/* Phone mockup */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PhoneMockup
                        name={tenant.name}
                        username={tenant.tenant_id}
                        colors={tenant.colors}
                        links={tenant.links}
                        theme={tenant.theme}
                      />
                    </div>
                  </div>

                  {/* Info overlay on hover */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent transition-all duration-500 ${
                      hoveredTenant === tenant.tenant_id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white">{tenant.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{tenant.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-white/90">
                      <span>Klik untuk melihat</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}

          {/* CTA Card */}
          <div className="flex items-center justify-center">
            <Card className="text-center p-12 bg-gradient-to-br from-violet-50 via-pink-50 to-rose-50 border-2 border-dashed border-violet-300 hover:border-violet-500 transition-colors">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Jadilah yang berikutnya!</h3>
              <p className="mt-3 text-gray-600">Buat halamanmu sendiri dan mulai bangun kehadiran digital</p>
              <button
                className="mt-6 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-gradient-to-r from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30"
              >
                Daftar Gratis
              </button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
