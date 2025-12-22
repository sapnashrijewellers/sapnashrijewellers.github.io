"use client";

import { motion } from "framer-motion";
import {
  Star,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";
import testimonials from "@/data/testimonials.json";

export default function TestimonialScroller() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollBy = (offset: number) => {
    setAutoScroll(false);
    viewportRef.current?.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="my-12">
      <h2 className="au-h2">ग्राहकों की आवाज़</h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Controls */}
        <button
          aria-label="Previous testimonials"
          onClick={() => scrollBy(-360)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme rounded-full p-2 shadow-sm"
        >
          <ChevronLeft />
        </button>

        <button
          aria-label="Next testimonials"
          onClick={() => scrollBy(360)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme rounded-full p-2 shadow-sm"
        >
          <ChevronRight />
        </button>

        {/* Fixed viewport */}
        <div
          ref={viewportRef}
          onMouseEnter={() => setAutoScroll(false)}
          onTouchStart={() => setAutoScroll(false)}
          className="overflow-hidden px-4"
        >
          {/* Moving track */}
          <div
            className={`
              flex gap-6 w-max
              snap-x snap-mandatory
              ${autoScroll ? "testimonial-track-auto" : ""}
            `}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="snap-start min-w-[280px] sm:min-w-[340px] max-w-[360px]
                           bg-surface border border-theme rounded-2xl p-4 shadow-sm"
              >
                {/* Rating + Verified */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className="text-primary fill-current"
                      />
                    ))}
                  </div>

                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    <BadgeCheck size={14} />
                    Verified Buyer
                  </span>
                </div>

                {/* Testimonial text */}
                <p className="text-normal text-sm leading-relaxed mb-3">
                  {t.text}
                </p>

                {/* Name */}
                <p className="text-primary-dark text-sm font-semibold">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
