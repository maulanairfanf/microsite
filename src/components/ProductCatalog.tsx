import { ProductCatalogComponent } from "@/types/components";
import Image from "next/image";

export function ProductCatalog({ data }: { data: ProductCatalogComponent }) {
  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {data.title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((product) => (
            <a
              key={product.id}
              href={product.url}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Image Container */}
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Product Info - Centered */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {product.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
