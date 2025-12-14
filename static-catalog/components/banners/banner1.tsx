import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

/**
 * Banner Props
 */
export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  textColor?: string; // e.g. "text-white"
  bgType: "solid" | "gradient" | "dual";
  bgColor?: string; // for solid
  gradientFrom?: string; // for gradient
  gradientTo?: string;   // for gradient
  dualLeft?: string; // for dual background
  dualRight?: string;
}

interface BannerProps {
  items: BannerItem[];
  interval?: number;
  height?: string; // e.g. "h-64"
}

export default function RotatingBanner({ items, interval = 5000, height = "h-64" }: BannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  const current = items[index];

  const renderBackground = () => {
    if (current.bgType === "solid") {
      return `${current.bgColor}`;
    }

    if (current.bgType === "gradient") {
      return `bg-gradient-to-r from-${current.gradientFrom} to-${current.gradientTo}`;
    }

    if (current.bgType === "dual") {
      return "";
    }

    return "bg-gray-800";
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${height}`}>
      {/* Background */}
      {current.bgType !== "dual" ? (
        <div className={`absolute inset-0 ${renderBackground()}`} />
      ) : (
        <div className="absolute inset-0 grid grid-cols-2">
          <div className={`${current.dualLeft}`} />
          <div className={`${current.dualRight}`} />
        </div>
      )}

      {/* Content */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col justify-center h-full p-8 text-left"
      >
        <div className="flex items-center gap-4 mb-3">
          {current.icon && (
            <current.icon className={`w-10 h-10 ${current.textColor || "text-white"}`} />
          )}
          <h2 className={`text-3xl font-bold tracking-wide ${current.textColor || "text-white"}`}>
            {current.title}
          </h2>
        </div>
        {current.subtitle && (
          <p className={`text-lg opacity-90 ${current.textColor || "text-white"}`}>{current.subtitle}</p>
        )}
      </motion.div>
    </div>
  );
}
