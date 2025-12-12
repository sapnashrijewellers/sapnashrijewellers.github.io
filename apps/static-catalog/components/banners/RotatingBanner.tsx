"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BannerItem } from "@/types/catalog";
import banners from "@/data/banners.json";

interface Props {  
  interval?: number;
  height?: string;
}

export default function RotatingBanner({  
  interval = 15000,
  height = "h-96"
}: Props) {
  const items = banners;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  const current = items[index];
  const Icon = current.icon
    ? (Icons[current.icon as keyof typeof Icons] as any)
    : null;

  const bgClass =
    current.bgType === "solid"
      ? current.bgColor
      : current.bgType === "gradient"
      ? `bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo}`
      : "";

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${height}`}>
      
      {/* ---------------------- */}
      {/* BACKGROUND LOGIC START */}
      {/* ---------------------- */}

      {/* If bgImage exists → IMAGE + GRADIENT OVERLAY */}
      {current.bgImage ? (
        <>
          {/* Background Image */}
          <Image
            src={current.bgImage}
            alt={current.title}
            fill
            className="object-cover object-right opacity-95"
            priority
          />

          {/* Left-side gradient overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </>
      ) : (
        /* ELSE → fallback to existing color logic */
        <>
          {current.bgType !== "dual" ? (
            <div className={`absolute inset-0 ${bgClass}`} />
          ) : (
            <div className="absolute inset-0 grid grid-cols-2">
              <div className={`${current.dualLeft}`} />
              <div className={`${current.dualRight}`} />
            </div>
          )}
        </>
      )}

      {/* -------------------- */}
      {/* BACKGROUND LOGIC END */}
      {/* -------------------- */}

      {/* Animated text content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col justify-center h-full p-8"
        >
          <Link href={current.link}>
            <div className="flex items-center gap-4 mb-4">
              {Icon && <Icon className={`w-12 h-12 ${current.textColor}`} />}
              <h2 className={`font-cinzel text-3xl md:text-4xl font-semibold ${current.textColor}`}>
                {current.title}
              </h2>
            </div>

            {current.subtitle && (
              <p className={`text-lg md:text-xl ${current.textColor} opacity-90`}>
                {current.subtitle}
              </p>
            )}
            {current.subtitle1 && (
              <p className={`text-lg md:text-xl ${current.textColor} opacity-90`}>
                {current.subtitle1}
              </p>
            )}
            {current.subtitle2 && (
              <p className={`text-lg md:text-xl ${current.textColor} opacity-90`}>
                {current.subtitle2}
              </p>
            )}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-light scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
