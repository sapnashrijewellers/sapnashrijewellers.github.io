"use client";

import { useState, useCallback, useId } from "react";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProductRatingInputProps {
  productId: number;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
  className?: string;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

export default function ProductRatingInput({
  productId,
  initialRating = 0,
  onRatingSubmit,
  className = "",
}: ProductRatingInputProps) {
  const { user, loading: authLoading } = useAuth();

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const groupId = useId();

  const submitRating = useCallback(
    async (rating: number) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        setStatusMessage("Saving rating...");

        // Dynamically load Firebase Auth only when rating action is triggered
        const [{ signInWithPopup }, { getFirebaseAuthInstance }] = await Promise.all([
          import("firebase/auth"),
          import("@/utils/firebase"),
        ]);

        const { auth, googleProvider } = await getFirebaseAuthInstance();

        // 1. Authenticate if not logged in
        if (!authLoading && !user) {
          await signInWithPopup(auth, googleProvider);
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
          setStatusMessage("Please login to submit rating");
          return;
        }

        // 2. Submit rating payload
        const res = await fetch("/api/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            rating,
            userId: currentUser.uid,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save rating");
        }

        setSelected(rating);
        setStatusMessage(`Thank you! Rated ${rating} out of 5 stars`);
        onRatingSubmit?.(rating);
      } catch (err) {
        console.error("Rating submission error:", err);
        setStatusMessage("Failed to submit rating. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [authLoading, isSubmitting, onRatingSubmit, productId, user]
  );

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      {/* Screen Reader Live Status */}
      <div className="sr-only" aria-live="polite">
        {statusMessage ||
          (selected > 0
            ? `Current rating: ${selected} out of 5 stars`
            : "Rate this product from 1 to 5 stars")}
      </div>

      {/* Accessible Rating Selector Group */}
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className="flex items-center gap-1"
      >
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
              className="
                p-1 rounded-lg text-muted-foreground hover:text-amber-500
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                transition-[color,transform] duration-150 ease-out will-change-[transform]
                active:scale-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer
              "
            >
              <Star
                className={`
                  w-5 h-5 transition-transform duration-150 ease-out will-change-transform
                  ${
                    isFilled
                      ? "text-amber-500 fill-amber-500 scale-110"
                      : "text-muted-foreground/40 fill-none"
                  }
                `}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Status Indicators */}
      {!user && !authLoading && (
        <span className="text-xs text-muted-foreground select-none">
          (Login to rate)
        </span>
      )}

      {isSubmitting && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2
            className="w-3.5 h-3.5 animate-spin text-primary shrink-0"
            aria-hidden="true"
          />
          <span>Saving…</span>
        </span>
      )}

      {selected > 0 && !isSubmitting && (
        <span className="text-xs font-semibold text-foreground/90">
          {selected}/5
        </span>
      )}
    </div>
  );
}