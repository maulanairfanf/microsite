"use client";

import { ProductsShowcaseComponent } from "@/types/components";
import { ProductCard } from "./ProductCard";

export function ProductsShowcase({ data }: { data: ProductsShowcaseComponent }) {
  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 text-center">
        {data.title}
      </h2>
      
      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-3 -mx-6 px-6 scrollbar-hide">
        <div className="flex gap-3 min-w-min">
          {data.items.map((product) => (
            <div
              key={product.id}
              className="w-36 shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
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
