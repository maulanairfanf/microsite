import { ProductItem } from "@/types/components";
import Image from "next/image";

export function ProductCard({ product }: { product: ProductItem }) {
  const hasDiscount = product.originalPrice && product.discount;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  return (
    <a
      href={product.url}
      className="flex flex-col group cursor-pointer bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.discount}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors min-h-10">
          {product.title}
        </h3>
        <div className="flex flex-col gap-0.5 min-h-11">
          <span
            className={`text-xs text-gray-400 line-through ${hasDiscount ? "" : "invisible"}`}
          >
            {hasDiscount ? formattedOriginalPrice : formattedPrice}
          </span>
          <span className="text-base md:text-lg font-bold text-gray-900">
            {formattedPrice}
          </span>
        </div>
      </div>
    </a>
  );
}
