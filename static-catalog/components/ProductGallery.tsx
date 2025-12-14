"use client";
import { useState } from "react";
import { Product } from "@/types/catalog"
import Image from "next/image"

export default function ProductGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="relative w-full">
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {product.images.map((img: string, i: number) => (
          <div key={i} className="flex-shrink-0 w-full snap-center">
            <Image
              src={`/img/products/optimized/${img}`}
              alt={`${product.name} ${i + 1}`}
              loading="lazy"
              onClick={() => setActiveImage(img)}
              className="w-full h-[350px] object-contain rounded-xl cursor-pointer"
              fill
            />
          </div>
        ))}
      </div>

      {product.newArrival && (
        <span className="absolute top-3 left-3 bg-accent  text-sm px-3 py-1 rounded-full shadow-md rotate-[-5deg]">
          ✨ NEW ARRIVAL
        </span>
      )}

      {/* Fullscreen Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <Image
            src={`/img/products/optimized/${activeImage}`}
            alt="Zoomed view"
            className="max-h-full max-w-full object-contain"
            fill
          />
        </div>
      )}
    </div>
  );
}
