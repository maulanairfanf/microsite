'use client';

import { ProductItem } from "@/types/components";
import Image from "next/image";
import { useState } from "react";
import { BottomSheet } from "./BottomSheet";

export function ProductCard({ product }: { product: ProductItem }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
    <>
      <div
        onClick={() => setIsBottomSheetOpen(true)}
        className="flex flex-col group/card cursor-pointer overflow-hidden transition-all h-full card-bg card-hover-bg card-style"
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
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-30 transition-opacity duration-300" style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />
        {hasDiscount && (
          <div className="absolute top-2 right-2 text-sm font-semibold px-2 py-1 rounded bg-card-text">
            {product.discount}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex flex-col gap-0.5 transition-colors duration-300">
        <h3 className="text-xs font-medium line-clamp-3 leading-tight text-card">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-card">
            {formattedPrice}
          </span>
          {hasDiscount && (
            <span className="text-[10px] line-through text-card opacity-50">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      </div>
      </div>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        product={product}
      />
    </>
  );
}
