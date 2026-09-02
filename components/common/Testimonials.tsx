"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import testimonials from "@/data/testimonials.json";

interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
}

const SPEED_PX_PER_SEC = 40;
const RESUME_DELAY = 1200;

export default function TestimonialScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const [paused, setPaused] = useState(false);
  const sectionTitleId = useId();

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

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (pauseTimeout.current) {
        clearTimeout(pauseTimeout.current);
      }
    };
  }, [paused]);

  /* ---------------- Pause on User Interaction ---------------- */
  const pauseAutoScroll = useCallback(() => {
    setPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);

    pauseTimeout.current = setTimeout(() => {
      setPaused(false);
    }, RESUME_DELAY);
  }, []);

  /* ---------------- Button Controls ---------------- */
  const scrollByCard = useCallback((dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    pauseAutoScroll();

    const cardWidth = 340;
    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, [pauseAutoScroll]);

  const items = testimonials as TestimonialItem[];

  return (
    <section aria-labelledby={sectionTitleId} className="my-14">
      {/* Section Heading with bilingual context for Agentic Crawlers */}
      <div className="flex items-baseline justify-between px-4 mb-4">
        <h2 id={sectionTitleId} className="au-h2 text-foreground font-bold">
          Customer Reviews
        </h2>        
      </div>

      <div className="relative group">
        {/* Navigation Controls */}
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Scroll testimonials backward"
          className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme text-foreground/80 hover:text-foreground
                     rounded-full p-2.5 shadow-md transition-[background-color,color,transform]
                     duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Previous review</span>
        </button>

        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Scroll testimonials forward"
          className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 z-10
                     bg-surface border border-theme text-foreground/80 hover:text-foreground
                     rounded-full p-2.5 shadow-md transition-[background-color,color,transform]
                     duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Next review</span>
        </button>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          role="region"
          aria-label="Customer review carousel"
          tabIndex={0}
          onMouseEnter={pauseAutoScroll}
          onWheel={pauseAutoScroll}
          onTouchStart={pauseAutoScroll}
          onMouseDown={pauseAutoScroll}
          onFocus={pauseAutoScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto px-4 py-2 scroll-smooth
                     scrollbar-hide focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl"
        >
          {[...items, ...items].map((t, i) => {
            const isDuplicate = i >= items.length;

            return (
              <article
                key={`${t.name}-${i}`}
                aria-hidden={isDuplicate ? "true" : undefined}
                className="flex flex-col justify-between shrink-0 min-w-[280px] sm:min-w-[340px] max-w-[360px]
                           bg-surface border border-theme rounded-2xl p-4 sm:p-5 shadow-sm
                           transition-[transform,border-color] duration-150 will-change-[transform]"
              >
                <div>
                  {/* Rating Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="flex items-center"
                      role="img"
                      aria-label={`Rating: ${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < t.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <BadgeCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Verified Buyer</span>
                    </span>
                  </div>

                  {/* Review Body */}
                  <blockquote className="text-sm leading-relaxed text-foreground/90 mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                </div>

                {/* Author attribution */}
                <footer className="text-xs font-semibold text-foreground/80 border-t border-theme/30 pt-2.5">
                  <cite className="not-italic">— {t.name}</cite>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}