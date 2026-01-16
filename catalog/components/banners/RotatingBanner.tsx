"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

import banners from "@/data/banners.json";


const baseURL = process.env.BASE_URL ?? "";

/* --------------------------------------------
   Icon resolver
--------------------------------------------- */
const iconMap = Icons as unknown as Record<
  string,
  ComponentType<LucideProps>
>;

function resolveLucideIcon(name?: string) {
  return name && iconMap[name] ? iconMap[name] : null;
}

/* --------------------------------------------
   Position map
--------------------------------------------- */
const positionMap: Record<string, string> = {
  "top-left": "top-0 left-0 items-start text-left",
  "top-right": "top-0 right-0 items-end text-right",
  "bottom-left": "bottom-0 left-0 items-start text-left",
  "bottom-right": "bottom-0 right-0 items-end text-right"
};

/* --------------------------------------------
   Text animation map
--------------------------------------------- */
const textAnimationMap = {
  "fade-slide": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  },
  "slide-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  "slide-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "zoom-fade": {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  },
  "reveal-up": {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 }
  },

  "flip-soft": {
    initial: { opacity: 0, rotateX: 18, y: 30 },
    animate: { opacity: 1, rotateX: 0, y: 0 },
    exit: { opacity: 0, rotateX: -12, y: -20 }
  }
} as const;




/* --------------------------------------------
   Image animation map
--------------------------------------------- */
const imageAnimationMap = {
  none: {
    initial: {},
    animate: {},
    exit: {}
  },
  "subtle-zoom": {
    initial: { scale: 1.08 },
    animate: { scale: 1 },
    exit: { scale: 1.05 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "pan-right": {
    initial: { scale: 1.1, x: -30 },
    animate: { scale: 1, x: 0 },
    exit: { scale: 1.05, x: 30 }
  }
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
  interval = 15000,
  height = "h-120",
  page = "home"
}: Props) {
  const items = banners
    .filter(b => b.active && b.page === page)
    .sort((a, b) => a.rank - b.rank);
  if (items.length === 0) {
    return null;
  }
  const [index, setIndex] = useState(0);

  const reducedMotion = useReducedMotion();
  const bannerRef = useRef<HTMLDivElement | null>(null);

  /* --------------------------------------------
     Rotation timer
  --------------------------------------------- */
  useEffect(() => {
    if (items.length <= 1) return;

    const id = setInterval(
      () => setIndex(i => (i + 1) % items.length),
      interval
    );

    return () => clearInterval(id);
  }, [items.length, interval]);

  const current = items[index];
  const Icon = resolveLucideIcon(current.icon);
  const contentPosition = positionMap[current.position ?? "bottom-left"];

  /* --------------------------------------------
     Resolve animations safely
  --------------------------------------------- */

  const textAnimationKey =
    current.textAnimation in textAnimationMap
      ? (current.textAnimation as keyof typeof textAnimationMap)
      : "slide-up";

  const imageAnimationKey =
    current.imageAnimation in imageAnimationMap
      ? (current.imageAnimation as keyof typeof imageAnimationMap)
      : "pan-right";

  const textMotion =
    textAnimationMap[textAnimationKey];

  const imageMotion =
    reducedMotion
      ? imageAnimationMap.fade
      : imageAnimationMap[imageAnimationKey];

  /* --------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <div className="w-full">
      <Link href={current.link} aria-label={current.title ?? "Banner Link"}>
        <div
          ref={bannerRef}
          className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${height}`}
        >
          {/* ================= Image ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.bgImage}-${imageAnimationKey}`}
              className="absolute inset-0"
              initial={imageMotion.initial}
              animate={imageMotion.animate}
              exit={imageMotion.exit}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Image
                src={`${baseURL}/static/${current.bgImage}`}
                alt={current.title ?? "Banner"}
                fill
                priority
                className="object-cover opacity-95"
              />
            </motion.div>
          </AnimatePresence>

          {/* ================= Text ================= */}
          <AnimatePresence initial={false}>
            <motion.div
              key={`${current.link}-${textAnimationKey}`}
              initial={textMotion.initial}
              animate={textMotion.animate}
              exit={textMotion.exit}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="absolute inset-0"
            >
              {current.title && (
                <div className={`absolute z-10 max-w-[480px] ${contentPosition}`}>
                  {/* Feathered background */}
                  <div className="
                    absolute inset-0
                bg-gradient-to-r from-black/80 via-black/55 to-transparent
                rounded-xl
                blur-[1px]
                opacity-95
                -z-10
                [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
                  "
                  />

                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {Icon && (
                        <Icon className={`w-10 h-10 ${current.textColor}`} />
                      )}
                      <h2
                        className={`font-cinzel text-2xl md:text-3xl font-semibold ${current.textColor}`}
                      >
                        {current.title}
                      </h2>
                    </div>

                    {current.subtitle && (
                      <p
                        className={`text-base md:text-lg ${current.textColor} opacity-90 font-yatra`}
                      >
                        {current.subtitle}
                      </p>
                    )}

                    {current.subtitle1 && (
                      <p
                        className={`text-base md:text-lg ${current.textColor} opacity-90`}
                      >
                        {current.subtitle1}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index
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
