import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number; // e.g. 4.6
  count?: number; // e.g. 12
  size?: number; // icon dimension in px (default 16)
  showExpert?: boolean;
  className?: string;
}

export default function ProductRating({
  rating,
  count = 0,
  size = 16,
  showExpert = true,
  className = "",
}: ProductRatingProps) {
  // Graceful bailout: prevent layout shift and avoid rendering empty containers
  if (!Number.isFinite(rating) || rating <= 0) {
    return null;
  }

  // Constrain rating to standard 0 to 5 range
  const normalizedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const roundedDisplayRating = normalizedRating.toFixed(1);

  const starCountLabel = `${roundedDisplayRating} out of 5 stars`;
  const expertReviewLabel = count > 0 ? `${count} reviews` : undefined;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm select-none ${className}`}
      aria-label={`Product rating: ${starCountLabel}${count > 0 && showExpert ? `, based on ${count} expert reviews` : ""}`}
    >
      {/* Visual Star Matrix wrapped in a single semantic accessible image role */}
      <div
        className="flex items-center gap-0.5 text-amber-500 shrink-0"
        role="img"
        aria-label={starCountLabel}
      >
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={`star-full-${i}`}
                style={{ width: size, height: size }}
                className="shrink-0 text-amber-500 fill-amber-500"
                aria-hidden="true"
              />
            );
          }

          if (i === fullStars && hasHalfStar) {
            return (
              <span
                key={`star-half-${i}`}
                className="relative inline-flex items-center justify-center shrink-0"
                style={{ width: size, height: size }}
                aria-hidden="true"
              >
                {/* Background Empty Star (Reserve space without shifting layout) */}
                <Star
                  style={{ width: size, height: size }}
                  className="absolute inset-0 text-muted-foreground/30"
                  aria-hidden="true"
                />
                {/* Hardware-accelerated Clipped Half Star */}
                <Star
                  style={{
                    width: size,
                    height: size,
                    clipPath: "inset(0 50% 0 0)",
                  }}
                  className="absolute inset-0 text-amber-500 fill-amber-500 will-change-[clip-path]"
                  aria-hidden="true"
                />
              </span>
            );
          }

          return (
            <Star
              key={`star-empty-${i}`}
              style={{ width: size, height: size }}
              className="shrink-0 text-muted-foreground/30"
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Numeric Score */}
      <span className="font-semibold text-foreground leading-none tracking-tight">
        {roundedDisplayRating}
      </span>

      {/* Simple English Expert Rating Tag */}
      {count > 0 && showExpert && (
        <span className="text-muted-foreground leading-none flex items-center gap-1 text-[11px] sm:text-xs">
          <span aria-hidden="true">&bull;</span>
          <span>Expert rating ({count})</span>
          <span className="sr-only">({expertReviewLabel})</span>
        </span>
      )}
    </div>
  );
}