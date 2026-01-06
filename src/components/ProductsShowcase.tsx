"use client";

import { ProductsShowcaseComponent } from "@/types/components";
import { ProductCard } from "./ProductCard";
import { HorizontalScroll } from "./HorizontalScroll";

export function ProductsShowcase({ data }: { data: ProductsShowcaseComponent }) {
  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 text-center">
        {data.title}
      </h2>
      
      <HorizontalScroll>
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
      </HorizontalScroll>
    </section>
  );
}
