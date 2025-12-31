"use client";

import { ProductsShowcaseComponent } from "@/types/components";
import { ProductCard } from "./ProductCard";

export function ProductsShowcase({ data }: { data: ProductsShowcaseComponent }) {
  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
          {data.title}
        </h2>
        
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4 min-w-min">
            {data.items.map((product) => (
              <div
                key={product.id}
                className="w-40 sm:w-45 md:w-50 shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
