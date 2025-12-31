"use client";

import { useState, useEffect } from "react";
import { ProductsCatalogComponent, ProductItem } from "@/types/components";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

// Mock data for different categories (simulating API responses)
const mockCatalogData: Record<string, ProductItem[]> = {
  coffee: [
    {
      id: "c1",
      title: "Americano",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop",
      price: 28000,
      url: "#",
    },
    {
      id: "c2",
      title: "Espresso",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&h=500&fit=crop",
      price: 35000,
      originalPrice: 45000,
      discount: "22%",
      url: "#",
    },
    {
      id: "c3",
      title: "Cappuccino",
      image: "https://images.unsplash.com/photo-1594261956806-3ad03785c9b4?w=500&h=500&fit=crop",
      price: 45000,
      url: "#",
    },
    {
      id: "c4",
      title: "Latte",
      image: "https://images.unsplash.com/photo-1596151163116-98a5033814c2?w=500&h=500&fit=crop",
      price: 50000,
      url: "#",
    },
  ],
  "non-coffee": [
    {
      id: "nc1",
      title: "Matcha Latte",
      image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&h=500&fit=crop",
      price: 42000,
      url: "#",
    },
    {
      id: "nc2",
      title: "Chocolate",
      image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=500&h=500&fit=crop",
      price: 38000,
      originalPrice: 45000,
      discount: "16%",
      url: "#",
    },
    {
      id: "nc3",
      title: "Strawberry Smoothie",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&h=500&fit=crop",
      price: 45000,
      url: "#",
    },
  ],
  pastry: [
    {
      id: "p1",
      title: "Croissant",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop",
      price: 25000,
      url: "#",
    },
    {
      id: "p2",
      title: "Chocolate Cake",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      price: 35000,
      originalPrice: 42000,
      discount: "17%",
      url: "#",
    },
    {
      id: "p3",
      title: "Blueberry Muffin",
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&h=500&fit=crop",
      price: 28000,
      url: "#",
    },
  ],
  snacks: [
    {
      id: "s1",
      title: "French Fries",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop",
      price: 20000,
      url: "#",
    },
    {
      id: "s2",
      title: "Chicken Wings",
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=500&fit=crop",
      price: 35000,
      url: "#",
    },
  ],
};

export function ProductsCatalog({ data }: { data: ProductsCatalogComponent }) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0]?.id || "");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProducts(mockCatalogData[activeCategory] || []);
      setLoading(false);
    };

    if (activeCategory) {
      fetchProducts();
    }
  }, [activeCategory]);

  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 text-center">
        {data.title}
      </h2>

      {/* Tabs */}
      <div className="mb-2 overflow-x-auto pb-2 -mx-6 px-6">
        <div className="flex gap-2 min-w-min">
          {data.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === category.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No products available
        </div>
      )}
    </section>
  );
}
