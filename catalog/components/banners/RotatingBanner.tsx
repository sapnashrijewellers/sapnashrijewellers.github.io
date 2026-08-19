"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import banners from "@/data/banners.json";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

/* --------------------------------------------
   Image animation map
--------------------------------------------- */
const imageAnimationMap = {
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
  "subtle-zoom": {
    initial: { scale: 1.08 },
    animate: { scale: 1 },
    exit: { scale: 1.05 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "pan-right": {
    initial: { scale: 1.1, x: -30 },
    animate: { scale: 1, x: 0 },
    exit: { scale: 1.05, x: 30 },
  },
} as const;

interface Props {
  interval?: number;
  height?: string;
  page?: string;
}

/* --------------------------------------------
   Component
--------------------------------------------- */
export default function RotatingBanner({
  interval = 10000,
  height = "h-120",
  page = "home",
}: Props) {
  const [index, setIndex] = useState(0);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  const items = banners
    .filter((b) => b.page === page)
    .sort((a, b) => a.rank - b.rank);

  /* --------------------------------------------
     Rotation timer
  --------------------------------------------- */
  useEffect(() => {
    if (items.length <= 1) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );

    return () => clearInterval(id);
  }, [items.length, interval]);

  if (items.length === 0) {
    return null;
  }

  const current = items[index];

  /* --------------------------------------------
     Resolve animations safely
  --------------------------------------------- */
  const imageAnimationKey =
    current.imageAnimation in imageAnimationMap
      ? (current.imageAnimation as keyof typeof imageAnimationMap)
      : "pan-right";

  const imageMotion = imageAnimationMap[imageAnimationKey];

  /* --------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <div className="w-full">
      <Link href={current.link} aria-label="Banner Link">
        <div
          ref={bannerRef}
          className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${height}`}
        >
          {/* ================= Image ================= */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${current.bannerImage}-${imageAnimationKey}`}
              className="absolute inset-0"
              initial={imageMotion.initial}
              animate={imageMotion.animate}
              exit={imageMotion.exit}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Image
                src={`${baseURL}/static/img/banner/${current.bannerImage}`}
                alt="Banner"
                fill
                priority
                loading="eager"
                className="object-cover opacity-95"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Link>

      {/* ================= Pagination ================= */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-black scale-125"
                  : "bg-black/30 hover:bg-black/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}