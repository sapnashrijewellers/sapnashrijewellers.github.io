"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition?: string }>({});
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const activeImage = product.images[activeIndex];

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ---------------- Desktop hover zoom ---------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const resetZoom = () => setZoomStyle({});

  /* ---------------- Mobile double-tap zoom ---------------- */
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoomed((z) => !z);
    }
    lastTapRef.current = now;
  };

  /* ---------------- iOS-safe body lock ---------------- */
  useEffect(() => {
    if (!mobileZoomOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileZoomOpen]);

  /* ---------------- Hi-res preload ---------------- */
  useEffect(() => {
    const img = new window.Image();
    img.src = `${process.env.BASE_URL}/static/img/products/optimized/${activeImage}`;
  }, [activeImage]);

  return (
    <div className="aspect-square  rounded-lg  w-full space-y-4 relative">
      {/* Main Image */}
      <div
        ref={containerRef}
        onMouseMove={!isTouch ? handleMouseMove : undefined}
        onMouseLeave={!isTouch ? resetZoom : undefined}
        onClick={isTouch ? () => setMobileZoomOpen(true) : undefined}
        className="relative h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden bg-surface cursor-zoom-in"
        style={{
          backgroundImage: zoomStyle.backgroundPosition
            ? `url(${process.env.BASE_URL}/static/img/products/optimized/${activeImage})`
            : undefined,
          backgroundSize: zoomStyle.backgroundPosition ? "200%" : undefined,
          backgroundRepeat: "no-repeat",
          backgroundPosition: zoomStyle.backgroundPosition
        }}
      >
        {/*
          CRITICAL FIX: Only render the Next.js Image component when the zoom is NOT active.
          When zoom is active, the background-image will take over the div space.
        */}
        {!zoomStyle.backgroundPosition && ( // <-- Added conditional rendering here
          <Image
            src={`${process.env.BASE_URL}/static/img/products/optimized/${activeImage}`}
            alt={product.name}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        )}

        {/* Tap hotspot indicator */}
        {isTouch && !mobileZoomOpen && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            Tap to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 flex-shrink-0 bg-surface overflow-hidden transition
              ${i === activeIndex ? "ring-2 ring-accent" : ""}`}
          >
            <Image
              src={`${process.env.BASE_URL}/static/img/products/optimized/${img}`}
              alt={`${product.name} thumbnail ${i + 1}`}
              fill
              className="object-contain"
            />
          </button>
        ))}
      </div>

      {/* Mobile fullscreen zoom */}
      {mobileZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setMobileZoomOpen(false)}
        >
          <div
            className="relative w-full h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={handleTap}
          >
            <Image
              src={`${process.env.BASE_URL}/static/img/products/optimized/${activeImage}`}
              alt="Zoomed product"
              fill
              className="object-contain"
            />

            <button
              className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full"
              onClick={() => setMobileZoomOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ❤️ Wishlist — overlay */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton slug={product.slug} />
          </div>
    </div>
  );
}
