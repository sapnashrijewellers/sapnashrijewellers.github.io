"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import { BannerItem } from "@/types/catalog";

interface Props {
  items: BannerItem[];
  interval?: number;
  height?: string;
}

export default function RotatingBanner({
  items,
  interval = 15000,
  height = "h-64"
}: Props) {
  const [index, setIndex] = useState(0);

  // autoplay
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

  // background utility
  const bgClass =
    current.bgType === "solid"
      ? current.bgColor
      : current.bgType === "gradient"
      ? `bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo}`
      : "";

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${height}`}>
      
      {/* Background layers */}
      {current.bgType !== "dual" ? (
        <div className={`absolute inset-0 ${bgClass}`} />
      ) : (
        <div className="absolute inset-0 grid grid-cols-2">
          <div className={`${current.dualLeft}`} />
          <div className={`${current.dualRight}`} />
        </div>
      )}

      {/* Animated content */}
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
              {Icon && <Icon className={`w-15 h-15 ${current.textColor}`} />}
              <h2 className={`font-cinzel text-3xl md:text-4xl font-semibold ${current.textColor}`}>
                {current.title}
              </h2>
            </div>

            {current.subtitle && (
              <p className={`text-lg md:text-xl ${current.textColor} opacity-90`}>
                {current.subtitle}
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
