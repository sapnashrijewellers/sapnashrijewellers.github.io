import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { CustomerReview } from '@/types/catalog';

const MAX_STARS = 5;
const STAR_ARRAY = Array.from({ length: MAX_STARS }, (_, idx) => idx + 1);

export interface CustomerReviewCardProps {
  review: CustomerReview;
  className?: string;
  /** Optional ISO 8601 date string (e.g. '2026-03-15') for schema markup */
  datePublished?: string;
}

export const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({ review, className = '', datePublished }) => {
  const { name, rating, text, isVerified = true } = review;
  const clampedRating = Math.max(0, Math.min(MAX_STARS, Math.round(rating)));

  return (
    <article
      itemScope
      itemType="https://schema.org/Review"
      className={`bg-surface border-theme flex w-[calc(100vw-2rem)] max-w-[360px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-4 shadow-sm sm:w-[340px] sm:p-5 ${className}`.trim()}
    >
      <div>
        {/* Rating Header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div
            itemProp="reviewRating"
            itemScope
            itemType="https://schema.org/Rating"
            className="flex items-center gap-0.5"
            role="meter"
            aria-label={`Rating: ${clampedRating} out of ${MAX_STARS} stars`}
            aria-valuenow={clampedRating}
            aria-valuemin={1}
            aria-valuemax={MAX_STARS}
          >
            <meta itemProp="ratingValue" content={String(clampedRating)} />
            <meta itemProp="bestRating" content={String(MAX_STARS)} />
            <meta itemProp="worstRating" content="1" />

            {STAR_ARRAY.map((starIndex) => (
              <Star
                key={starIndex}
                className={`h-3.5 w-3.5 ${
                  starIndex <= clampedRating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          {isVerified && (
            <span className="inline-flex items-center gap-1" aria-label="Verified buyer review">
              <BadgeCheck className="bold h-3.5 w-3.5 shrink-0 text-sm text-emerald-800" aria-hidden="true" />
              <span className="text-xs">Verified Buyer</span>
            </span>
          )}
        </div>

        {/* Review Body */}
        <blockquote itemProp="reviewBody" className="text-foreground/90 mb-4 text-sm leading-relaxed italic">
          &ldquo;{text}&rdquo;
        </blockquote>

        {datePublished && <meta itemProp="datePublished" content={datePublished} />}
      </div>

      {/* Author */}
      <footer className="text-foreground/80 border-theme/30 border-t pt-2.5 text-xs font-semibold">
        <cite itemProp="author" itemScope itemType="https://schema.org/Person" className="not-italic">
          <span className="sr-only">Reviewed by </span>— <span itemProp="name">{name}</span>
        </cite>
      </footer>
    </article>
  );
};

export default CustomerReviewCard;
