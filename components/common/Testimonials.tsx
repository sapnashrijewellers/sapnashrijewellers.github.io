'use client';

import testimonials from '@/data/testimonials.json';
import SectionHeading from './SectionHeading';
import { CustomerReview } from '@/types/catalog';
import CustomerReviewCard from './CustomerReviewCard';

interface TestimonialScrollerProps {
  className?: string;
}

export default function TestimonialScroller({ className = '' }: TestimonialScrollerProps) {
  const items = testimonials as CustomerReview[];

  return (
    <section className={`relative w-full max-w-full min-w-0 overflow-hidden py-4 ${className}`.trim()}>
      <SectionHeading
        heading="Customer Reviews"
        punchline="See why thousands trust our hallmark purity, craftsmanship, and service."
      />

      <nav
        aria-label="Customer review carousel"
        className="scrollbar-hide flex max-w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-2xl p-2 sm:gap-4 sm:p-3"
      >
        {items.map((review, index) => (
          <CustomerReviewCard review={review} key={index} />
        ))}
      </nav>
    </section>
  );
}
