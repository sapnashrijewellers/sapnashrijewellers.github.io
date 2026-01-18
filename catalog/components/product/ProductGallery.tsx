"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";
import { ExternalLink } from "lucide-react";

const SWIPE_THRESHOLD = 50;

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition?: string }>(
    {}
  );
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  const activeImage = product.images[activeIndex];
  const imageUrl = `${process.env.BASE_URL}/static/img/products/optimized/${activeImage}`;

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ---------------- Desktop hover zoom ---------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

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

  /* ---------------- Swipe handling (mobile only) ---------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 10) isSwiping.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;

    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      setActiveIndex((i) => (i + 1) % product.images.length);
    } else {
      setActiveIndex((i) =>
        i === 0 ? product.images.length - 1 : i - 1
      );
    }
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
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div className="rounded-lg w-full space-y-4 relative">
      {/* Main Image */}
      <div
        ref={containerRef}
        onMouseMove={!isTouch ? handleMouseMove : undefined}
        onMouseLeave={!isTouch ? resetZoom : undefined}
        onClick={isTouch ? () => setMobileZoomOpen(true) : undefined}
        onTouchStart={isTouch ? onTouchStart : undefined}
        onTouchMove={isTouch ? onTouchMove : undefined}
        onTouchEnd={isTouch ? onTouchEnd : undefined}
        className="relative h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden bg-surface cursor-zoom-in"
      >
        {/* Base image NEVER disappears */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />

        {/* Desktop zoom overlay (graceful) */}
        {!isTouch && zoomStyle.backgroundPosition && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "200%",
              backgroundPosition: zoomStyle.backgroundPosition,
            }}
          />
        )}

        {/* Open in new tab (always works) */}
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 z-10 bg-accent  text-xs px-3 py-1 rounded-full flex items-center gap-1"
        >
          <ExternalLink size={12} />
          Open
        </a>

        {isTouch && !mobileZoomOpen && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            Swipe or tap
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden transition ${
              i === activeIndex ? "ring-4 ring-accent" : ""
            }`}
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

      {/* Mobile fullscreen zoom (UNCHANGED) */}
      {mobileZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setMobileZoomOpen(false)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={(e) => {
              onTouchEnd(e);
              handleTap();
            }}
          >
            <Image
              src={imageUrl}
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

      {/* ❤️ Wishlist */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton slug={product.slug} />
      </div>
    </div>
  );
}
