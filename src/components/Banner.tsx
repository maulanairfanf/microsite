"use client";

import { BannerComponent } from "@/types/components";
import Image from "next/image";
import { HorizontalScroll } from "./HorizontalScroll";

export function Banner({ data }: { data: BannerComponent }) {
  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 text-center">
        Banner
      </h2>
      <HorizontalScroll>
        <div className="flex gap-3 min-w-min">
          {data.data.map((banner) => (
            <div
              key={banner.id}
              className="w-96 shrink-0 rounded-lg overflow-hidden"
            >
              <div className="relative w-full h-40">
                <Image
                  src={banner.image_url}
                  alt={banner.section_id}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </section>
  );
}