"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import Image from "next/image";
import type { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";
import { ExternalLink, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  product: Product;
  className?: string;
}

const SWIPE_THRESHOLD = 40;

export default function ProductGallery({
  product,
  className = "",
}: ProductGalleryProps) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["placeholder.png"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const galleryId = useId();
  const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

  const activeImageFileName = images[activeIndex] || images[0];
  const imageUrl = `${baseImageURL}/products/optimized/${activeImageFileName}`;

  // Safe client-side media detection after hydration to prevent SSR mismatch
useEffect(() => {
  const mediaQuery = window.matchMedia("(pointer: coarse)");
  
  // Set the initial value asynchronously 
  requestAnimationFrame(() => {
    setIsTouchDevice(mediaQuery.matches);
  });

  // Track future changes (optional but recommended)
  const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
  mediaQuery.addEventListener("change", handler);
  
  return () => mediaQuery.removeEventListener("change", handler);
}, []);

  // Preload neighboring high-res images for smooth navigation
  useEffect(() => {
    const nextIdx = (activeIndex + 1) % images.length;
    const prevIdx = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    [nextIdx, prevIdx].forEach((idx) => {
      const img = new window.Image();
      img.src = `${baseImageURL}/products/optimized/${images[idx]}`;
    });
  }, [activeIndex, images, baseImageURL]);

  // Desktop hover zoom tracker
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setZoomPosition({ x, y });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomPosition(null);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Mobile double-tap toggle
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoomed((z) => !z);
    }
    lastTapRef.current = now;
  }, []);

  // Mobile Touch Swipe Handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 10) {
      isSwiping.current = true;
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping.current) return;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    },
    [handleNext, handlePrev]
  );

  // iOS-safe body scroll lock during full-screen zoom
  useEffect(() => {
    if (!mobileZoomOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileZoomOpen]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!mobileZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileZoomOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileZoomOpen, handlePrev, handleNext]);

  return (
    <section
      aria-label="Product image gallery"
      className={`relative w-full flex flex-col gap-3 sm:gap-4 ${className}`}
    >
      {/* 1. MAIN DISPLAY FRAME (Strict Aspect-Square to guarantee layout stability on all screens) */}
      <div
        ref={containerRef}
        onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
        onMouseLeave={!isTouchDevice ? resetZoom : undefined}
        onClick={isTouchDevice ? () => setMobileZoomOpen(true) : undefined}
        onTouchStart={isTouchDevice ? onTouchStart : undefined}
        onTouchMove={isTouchDevice ? onTouchMove : undefined}
        onTouchEnd={isTouchDevice ? onTouchEnd : undefined}
        className="
          group relative w-full aspect-square max-h-[500px]
          rounded-2xl border border-theme/40 bg-surface/90 overflow-hidden shadow-sm
          cursor-zoom-in select-none
          transition-[border-color,box-shadow] duration-150 ease-out
          hover:border-primary/40
        "
      >
        {/* Base Layer: Responsive Next.js Image with LCP priority */}
        <Image
          src={imageUrl}
          alt={`${product.name} - View ${activeIndex + 1}`}
          title={`${product.name} - Image ${activeIndex + 1} of ${images.length}  `}
          itemProp="image"
          fill
          priority={activeIndex === 0}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          fetchPriority={activeIndex === 0 ? "high" : "low"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-contain p-2 sm:p-4 transition-transform duration-150 ease-out will-change-transform"
        />

        {/* Desktop GPU-accelerated Zoom Overlay */}
        {!isTouchDevice && zoomPosition && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-150 ease-out will-change-[transform,opacity]"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "220%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        )}

        {/* Top-Right: Wishlist Action (Decoupled & accessible) */}
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton id={product.id} productName={product.name} />
        </div>

        {/* Bottom-Left: External Direct Link (Original source guarantee) */}
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open full resolution image in new tab"
          aria-label={`Open full resolution image for ${product.name} in new tab`}
          className="
            absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5
            px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-sm border border-theme/40
            text-xs font-medium text-foreground shadow-sm
            hover:bg-primary hover:text-white transition-[background-color,color] duration-150 ease-out
            focus:outline-none focus:ring-2 focus:ring-primary
          "
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Full HD</span>
        </a>

        {/* Mobile Swipe / Tap Visual Helper */}
        {isTouchDevice && (
          <div
            aria-hidden="true"
            className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium pointer-events-none"
          >
            <ZoomIn className="w-3 h-3" />
            <span>Tap to Zoom</span>
          </div>
        )}

        {/* Inline Navigation Arrows for Multi-image products */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product image"
              className="
                hidden sm:inline-flex absolute left-2.5 top-1/2 -translate-y-1/2 z-20
                p-2 rounded-full bg-surface/80 hover:bg-surface border border-theme/40 text-foreground shadow-md
                transition-[transform,background-color] duration-150 ease-out active:scale-90
                focus:outline-none focus:ring-2 focus:ring-primary will-change-transform
              "
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next product image"
              className="
                hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 z-20
                p-2 rounded-full bg-surface/80 hover:bg-surface border border-theme/40 text-foreground shadow-md
                transition-[transform,background-color] duration-150 ease-out active:scale-90
                focus:outline-none focus:ring-2 focus:ring-primary will-change-transform
              "
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* 2. THUMBNAILS HORIZONTAL SCROLLER */}
      {images.length > 1 && (
        <nav
          aria-label="Product thumbnail navigation"
          className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x"
        >
          {images.map((img, i) => {
            const isSelected = i === activeIndex;
            const thumbUrl = `${baseImageURL}/products/thumbnail/${img}`;

            return (
              <button
                key={`${img}-${i}`}
                type="button"
                aria-label={`Select product image ${i + 1} of ${images.length}`}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => setActiveIndex(i)}
                className={`
                  relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden
                  bg-surface border transition-[border-color,box-shadow,transform] duration-150 ease-out snap-start
                  focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]
                  ${isSelected
                    ? "border-primary ring-2 ring-primary/40 shadow-sm scale-95"
                    : "border-theme/40 hover:border-primary/50 opacity-75 hover:opacity-100"
                  }
                `}
              >
                <Image
                  src={thumbUrl}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  loading="eager"
                  decoding="async"
                  className="object-contain p-1"

                />
              </button>
            );
          })}
        </nav>
      )}

      {/* 3. MOBILE FULL-SCREEN MODAL ZOOM DIALOG */}
      {mobileZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image preview"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2"
          onClick={() => setMobileZoomOpen(false)}
        >
          {/* Controls Bar */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <span className="text-xs text-white/80 font-medium px-3 py-1 bg-white/10 rounded-full">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setMobileZoomOpen(false)}
              aria-label="Close zoom preview"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-90 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={(e) => {
              onTouchEnd(e);
              handleTap();
            }}
          >
            <div
              className={`
                relative w-full h-[85vh] transition-transform duration-300 ease-out will-change-transform
                ${zoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"}
              `}
            >
              <Image
                src={imageUrl}
                alt={`${product.name} zoomed preview`}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>

            {/* Mobile swipe helper */}
            <p className="absolute bottom-6 text-center text-xs text-white/70 pointer-events-none select-none">
              Double-tap to {zoomed ? "zoom out" : "zoom in"} &bull; Swipe to switch
            </p>
          </div>
        </div>
      )}
    </section>
  );
}