"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/landing/Components";
import type { Tenant } from "@/lib/db/tenants";

interface ShowcaseProps {
  tenants: Tenant[];
}

export function Showcase({ tenants }: ShowcaseProps) {
  const [hoveredTenant, setHoveredTenant] = useState<string | null>(null);

  if (tenants.length === 0) return null;

  return (
    <section
      id="contoh-halaman"
      data-nav-variant="light"
      className="py-24 bg-white relative overflow-hidden scroll-mt-20"
    >
      {/* Bright background decorations */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200 via-pink-200 to-rose-200 rounded-full blur-[150px] translate-x-1/3 opacity-50" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200 via-blue-200 to-violet-200 rounded-full blur-[150px] -translate-x-1/3 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 rounded-full text-sm font-bold mb-4">
            📱 See Examples
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Sample{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Pages
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See how Halamanku helps real businesses stand out
          </p>
        </div>

        {/* Interactive showcase with phone mockups */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="relative group"
              onMouseEnter={() => setHoveredTenant(tenant.id)}
              onMouseLeave={() => setHoveredTenant(null)}
            >
              <Link href={`/${tenant.tenantId}`} target="_blank">
                <Card
                  hover
                  className={`relative overflow-hidden transition-all duration-500 ${
                    hoveredTenant === tenant.id ? "scale-[1.02] shadow-2xl" : ""
                  }`}
                >
                  {/* Preview image background */}
                  <div className="relative h-[420px] -mx-6 -mt-6 mb-6 overflow-hidden">
                    {/* Phone mockup */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="phone-mockup w-[300px] mx-auto animate-float shadow-2xl">
                        <div className="phone-screen w-full h-[420px]">
                          <iframe
                            src={`/${tenant.tenantId}`}
                            className="w-full h-full border-0"
                            title={tenant.name}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info overlay on hover */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent transition-all duration-500 ${
                      hoveredTenant === tenant.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-3 text-sm text-white/90">
                      <span>Click to view</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
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
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Be next!</h3>
              <p className="mt-3 text-gray-600">
                Create your own page and start building your digital presence
              </p>
              <Link
                href="/sign-up"
                className="mt-6 inline-block px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-gradient-to-r from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30"
              >
                Sign Up Free
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
