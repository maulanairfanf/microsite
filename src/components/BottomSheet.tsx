"use client";

import { ProductItem } from "@/types/components";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/useIsClient";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

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

export function BottomSheet({ isOpen, onClose, product }: BottomSheetProps) {
  const isClient = useIsClient();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if ((!isOpen && !isClosing) || !product) return null;

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
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isClosing || !isClient ? "opacity-0" : "opacity-100",
        )}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 rounded-t-2xl z-50 max-w-lg mx-auto transition-transform duration-300 card-bg",
          isClosing || !isClient ? "translate-y-full" : "translate-y-0",
        )}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Content */}
        <div className="px-4 py-6">
          {/* Product Image */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="400px"
              unoptimized
            />
            {hasDiscount && (
              <div
                className="absolute top-2 right-2 text-sm font-semibold px-2.5 py-1 rounded text-white"
                style={{ backgroundColor: "#ef4444", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {formatDiscount(product.discount)}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h2 className="text-base font-bold text-card">{product.title}</h2>

          {/* Product Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-card">{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-sm line-through text-card opacity-50 truncate">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Product URL */}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center font-semibold py-2.5 px-4 rounded-lg transition-colors card-border card-shadow card-bg card-hover-bg text-sm"
            >
              Pesan Sekarang
            </a>
          )}
        </div>
      </div>
    </>
  );
}
