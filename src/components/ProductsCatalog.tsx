"use client";

import { useState, useEffect } from "react";
import { ProductsCatalogComponent, ProductItem } from "@/types/components";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { HorizontalScroll } from "./HorizontalScroll";

// Mock data for different categories (simulating API responses)
const mockCatalogData: Record<string, ProductItem[]> = {
  "pempek-lenjer": [
    {
      id: "pl1",
      title: "Pempek Lenjer Original",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=500&fit=crop",
      price: 8000,
      url: "#",
    },
    {
      id: "pl2",
      title: "Pempek Lenjer Jumbo",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop",
      price: 12000,
      originalPrice: 15000,
      discount: "20%",
      url: "#",
    },
    {
      id: "pl3",
      title: "Pempek Lenjer Kecil",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
      price: 5000,
      url: "#",
    },
    {
      id: "pl4",
      title: "Pempek Lenjer Paket 5",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
      price: 35000,
      url: "#",
    },
  ],
  "pempek-kapal-selam": [
    {
      id: "pks1",
      title: "Kapal Selam Telur Ayam",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
      price: 15000,
      url: "#",
    },
    {
      id: "pks2",
      title: "Kapal Selam Telur Bebek",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
      price: 18000,
      originalPrice: 20000,
      discount: "10%",
      url: "#",
    },
    {
      id: "pks3",
      title: "Kapal Selam Jumbo",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop",
      price: 22000,
      originalPrice: 25000,
      discount: "12%",
      url: "#",
    },
  ],
  "pempek-adaan": [
    {
      id: "pa1",
      title: "Pempek Adaan Bulat",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      price: 10000,
      url: "#",
    },
    {
      id: "pa2",
      title: "Pempek Adaan Isi Telur",
      image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&h=500&fit=crop",
      price: 12000,
      url: "#",
    },
    {
      id: "pa3",
      title: "Pempek Adaan Paket",
      image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=500&h=500&fit=crop",
      price: 45000,
      originalPrice: 55000,
      discount: "18%",
      url: "#",
    },
  ],
  "pempek-kulit": [
    {
      id: "pk1",
      title: "Pempek Kulit Crispy",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop",
      price: 10000,
      url: "#",
    },
    {
      id: "pk2",
      title: "Pempek Kulit Goreng",
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=500&fit=crop",
      price: 9000,
      url: "#",
    },
    {
      id: "pk3",
      title: "Pempek Kulit Bumbu Rujak",
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&h=500&fit=crop",
      price: 11000,
      originalPrice: 13000,
      discount: "15%",
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
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 items-stretch">
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
