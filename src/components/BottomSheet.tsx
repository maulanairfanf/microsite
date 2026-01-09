'use client';

import { ProductItem } from '@/types/components';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

export function BottomSheet({ isOpen, onClose, product }: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
      // Trigger mounting animation
      requestAnimationFrame(() => {
        setIsMounted(true);
      });
    } else {
      document.body.style.overflow = 'unset';
      setIsMounted(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen || !product) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-300',
          isClosing || !isMounted ? 'opacity-0' : 'opacity-100'
        )}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 rounded-t-2xl z-50 max-w-lg mx-auto transition-transform duration-300 container-bg',
          isClosing || !isMounted ? 'translate-y-full' : 'translate-y-0'
        )}
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
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
            />
            {product.discount && (
              <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "var(--cardText)", color: "var(--pageBackground)" }}>
                {product.discount}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h2 className="text-base font-bold mb-2" style={{ color: "var(--headerTextColor)" }}>{product.title}</h2>

          {/* Product Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold" style={{ color: "var(--cardText)" }}>{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-sm line-through" style={{ color: "var(--cardText)", opacity: 0.5 }}>
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Product Description / URL */}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full btn card-border card-shadow card-bg card-hover-bg font-semibold py-2.5 px-4 mb-3 text-center"
          >
            Pesan Sekarang
          </a>
        </div>
      </div>
    </>
  );
}
