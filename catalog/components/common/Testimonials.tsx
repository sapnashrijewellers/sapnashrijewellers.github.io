"use client";

import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import testimonials from "@/data/testimonials.json";

const SPEED_PX_PER_SEC = 40; // constant, length-independent
const RESUME_DELAY = 1200;  // ms after user stops interacting

export default function TestimonialScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const [paused, setPaused] = useState(false);

  /* ---------------- Auto Scroll Engine ---------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = performance.now();

    const step = (now: number) => {
      if (!paused) {
        const delta = now - lastTime;
        container.scrollLeft += (SPEED_PX_PER_SEC * delta) / 1000;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      lastTime = now;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    // ✅ CLEANUP — must return void
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [paused]);

  /* ---------------- Pause on User Interaction ---------------- */
  const pauseAutoScroll = () => {
    setPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);

    pauseTimeout.current = setTimeout(() => {
      setPaused(false);
    }, RESUME_DELAY);
  };

  /* ---------------- Button Controls ---------------- */
  const scrollByCard = (dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    pauseAutoScroll();

    const cardWidth = 340;
    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="my-14">
      <h2 className="au-h2">ग्राहकों की आवाज़</h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Controls */}
        <button
          onClick={() => scrollByCard("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme rounded-full p-2 shadow"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scrollByCard("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme rounded-full p-2 shadow"
        >
          <ChevronRight size={18} />
        </button>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          onWheel={pauseAutoScroll}
          onTouchStart={pauseAutoScroll}
          onMouseDown={pauseAutoScroll}
          className="flex gap-6 overflow-x-auto px-4 scroll-smooth
                     scrollbar-hide"
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="min-w-[280px] sm:min-w-[340px] max-w-[360px]
                         bg-surface border border-theme rounded-2xl p-4"
            >
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
                <span className="flex items-center gap-1 text-xs text-primary">
                  <BadgeCheck size={14} />
                  Verified Buyer
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-3 text-normal">
                {t.text}
              </p>

              <p className="text-sm font-semibold text-primary-dark">
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
