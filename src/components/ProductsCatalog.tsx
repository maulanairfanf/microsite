"use client";

import { useState } from "react";
import { ProductsCatalogComponent } from "@/types/components";
import { ProductCard } from "./ProductCard";
import { HorizontalScroll } from "./HorizontalScroll";

export function ProductsCatalog({ data }: { data: ProductsCatalogComponent }) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0]?.id || "");
  
  const currentCategory = data.categories.find(cat => cat.id === activeCategory);
  const products = currentCategory?.products || [];

  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 text-center">
        {data.title}
      </h2>

      {/* Tabs with Horizontal Scroll */}
      <div className="mb-2">
        <HorizontalScroll scrollAmount={200} chevronSize={16}>
          <div className="flex gap-2 min-w-min">
            {data.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === category.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 "
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </HorizontalScroll>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No products available
        </div>
      )}
    </section>
  );
}
