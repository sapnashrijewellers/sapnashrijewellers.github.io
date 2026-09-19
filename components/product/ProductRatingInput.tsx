'use client';

import { useState, useCallback, useId } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { requireAuth } from '@/utils/auth/auth';

interface ProductRatingInputProps {
  productId: number;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
  className?: string;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';

export default function ProductRatingInput({
  productId,
  initialRating = 0,
  onRatingSubmit,
  className = '',
}: ProductRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const groupId = useId();

  const submitRating = useCallback(
    async (rating: number) => {
      if (isSubmitting) {
        return;
      }

      try {
        setIsSubmitting(true);
        setStatusMessage('Saving rating...');

        /*
         * Authentication is required only when the user
         * actually attempts to submit a rating.
         *
         * requireAuth():
         *   1. Initializes Firebase Auth lazily.
         *   2. Restores an existing Firebase session.
         *   3. Opens Google sign-in only if necessary.
         */
        const user = await requireAuth();

        /*
         * Submit rating using the authenticated Firebase UID.
         */
        const res = await fetch(workerUrl + '/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            rating,
            userId: user.uid,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to save rating: ${res.status}`);
        }

        setSelected(rating);
        setStatusMessage(`Thank you! Rated ${rating} out of 5 stars`);

        onRatingSubmit?.(rating);
      } catch (error) {
        console.error('Rating submission error:', error);

        setStatusMessage('Failed to submit rating. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, onRatingSubmit, productId],
  );

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      {/* Screen Reader Live Status */}
      <div className="sr-only" aria-live="polite">
        {statusMessage ||
          (selected > 0 ? `Current rating: ${selected} out of 5 stars` : 'Rate this product from 1 to 5 stars')}
      </div>

      {/* Accessible Rating Selector Group */}
      <div role="group" aria-labelledby={`${groupId}-label`} className="flex items-center gap-1">
        <span id={`${groupId}-label`} className="sr-only">
          Rate this product
        </span>

        {STAR_VALUES.map((value) => {
          const isFilled = value <= (hovered || selected);

          const isSelected = value === selected;

          return (
            <button
              key={value}
              type="button"
              disabled={isSubmitting}
              onClick={() => submitRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              onFocus={() => setHovered(value)}
              onBlur={() => setHovered(0)}
              aria-label={`Rate ${value} out of 5 stars`}
              aria-pressed={isSelected}
              className="text-muted-foreground focus:ring-primary cursor-pointer rounded-lg p-1 transition-[color,transform] duration-150 ease-out will-change-[transform] hover:text-amber-500 focus:ring-2 focus:ring-offset-1 focus:outline-none active:scale-90 disabled:pointer-events-none disabled:opacity-50"
            >
              <Star
                className={`h-5 w-5 transition-transform duration-150 ease-out will-change-transform ${
                  isFilled ? 'scale-110 fill-amber-500 text-amber-500' : 'text-muted-foreground/40 fill-none'
                } `}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Login hint */}
      <span className="text-muted-foreground text-xs select-none">(Sign in to rate)</span>

      {/* Saving indicator */}
      {isSubmitting && (
        <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />

          <span>Saving…</span>
        </span>
      )}

      {/* Selected rating */}
      {selected > 0 && !isSubmitting && <span className="text-foreground/90 text-xs font-semibold">{selected}/5</span>}
    </div>
  );
}
