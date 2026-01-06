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
      className="flex flex-col group/card cursor-pointer rounded-lg overflow-hidden transition-all shadow-sm hover:bg-gray-200 h-full"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover/card:opacity-30 transition-opacity duration-300" />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {product.discount}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex flex-col gap-0.5 bg-white grow">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-3 leading-tight">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-gray-900">
            {formattedPrice}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
