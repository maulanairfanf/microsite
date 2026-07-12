"use client";

import { ProductItem } from "@/types/components";
import Image from "next/image";
import { useState } from "react";
import { BottomSheet } from "./BottomSheet";

function parseDiscount(discount: string | undefined): number {
  if (!discount) return 0;
  return parseInt(discount.replace("%", ""), 10) || 0;
}

function formatDiscount(discount: string | undefined): string {
  if (!discount) return "";
  return discount.includes("%") ? discount : `${discount}%`;
}

function computePrice(product: ProductItem): number {
  const discountPct = parseDiscount(product.discount);
  if (product.originalPrice && discountPct > 0) {
    return Math.round(product.originalPrice * (1 - discountPct / 100));
  }
  return product.price;
}

export function ProductCard({ product }: { product: ProductItem }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const displayPrice = computePrice(product);
  const hasDiscount = product.originalPrice && parseDiscount(product.discount) > 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(displayPrice);

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
            unoptimized
          />
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-30 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
          />
          {hasDiscount && (
            <div
              className="absolute top-2 right-2 text-xs font-semibold px-1.5 py-0.5 rounded text-white"
              style={{ backgroundColor: "#ef4444", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              {formatDiscount(product.discount)}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2.5 flex flex-col gap-0.5 transition-colors duration-300">
          <h3 className="text-xs font-medium truncate leading-tight text-card">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-0.5 min-w-0">
            <span className="text-sm font-bold text-card shrink-0">{formattedPrice}</span>
            {hasDiscount && (
              <span className="text-[10px] line-through text-card opacity-50 truncate">
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
