'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import type { Product } from '@/types/catalog';
import { ShieldCheck, Truck, Heart, RefreshCcw, Sparkles, Award, ChevronRight, X } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

interface TrustSignalsRibbonProps {
  product?: Product;
  className?: string;
}

interface TrustSignalItem {
  id: string;
  show: boolean;
  icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
  title: string;
  subtitle: string;
  explanation: string;
  link?: string;
  badge?: string;
}

const MAX_GOLD_HALLMARK_WEIGHT = 2;

export default function TrustSignalsRibbon({ product, className = '' }: TrustSignalsRibbonProps) {
  const [activeModalItem, setActiveModalItem] = useState<TrustSignalItem | null>(null);

  const sectionId = useId();
  const headingId = `${sectionId}-heading`;
  const dialogId = `${sectionId}-dialog`;
  const dialogTitleId = `${sectionId}-dialog-title`;
  const dialogDescriptionId = `${sectionId}-dialog-description`;

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const metal = product?.metal ?? 'silver';
  const isGold = metal === 'gold';
  const weight = product?.weight ?? 0;
  const isHallmarkedGold = isGold && weight > MAX_GOLD_HALLMARK_WEIGHT;

  const signals: TrustSignalItem[] = [
    {
      id: 'authenticity',
      show: true,
      icon: Award,
      title: isHallmarkedGold ? 'BIS 916 Hallmark' : '925 Certified Silver',
      subtitle: 'Authenticity guaranteed',
      badge: 'Govt. Verified',
      explanation: isHallmarkedGold
        ? 'Government-approved BIS 916 hallmarking verifies precious gold purity with a unique laser-engraved HUID number traceable through the BIS Care app.'
        : 'Stamped authentic 925 sterling silver alloy containing 92.5% fine pure silver, tested and certified for metal purity.',
    },
    {
      id: 'warranty',
      show: true,
      icon: ShieldCheck,
      title: '6 Month Warranty',
      subtitle: "We're here after delivery",
      explanation:
        'Covers structural repairs, stone resetting, plating defects, and clasp malfunctions under regular wear. Claims can be initiated through WhatsApp or email.',
      link: '/policies/warranty/',
    },
    {
      id: 'skin-safe',
      show: true,
      icon: Heart,
      title: 'Skin Safe Wear',
      subtitle: 'Nickel-free composition',
      explanation:
        'Made with a nickel-free composition designed for comfortable everyday wear. Individual sensitivities can vary, so customers with known metal allergies should review the product details before purchase.',
    },
    {
      id: 'shipping',
      show: true,
      icon: Truck,
      title: 'Insured Delivery',
      subtitle: 'Travels safely to your door',
      explanation:
        'Parcels are shipped in tamper-evident packaging with transit protection. If a package is damaged or lost in transit, the applicable replacement or refund policy applies.',
      link: '/policies/shipping/',
    },
    {
      id: 'returns',
      show: true,
      icon: RefreshCcw,
      title: 'Transparent Returns',
      subtitle: 'Shop with confidence',
      explanation:
        'Eligible purchases can be returned or exchanged within the applicable return window, subject to the conditions described in our return policy.',
      link: '/policies/returns/',
    },
    {
      id: 'craftsmanship',
      show: true,
      icon: Sparkles,
      title: 'Authentic Certificate',
      subtitle: 'Certificate included',
      explanation:
        'Eligible orders include a physical certificate of authenticity containing applicable product details such as metal weight, purity information, and authorized verification.',
    },
  ];

  const activeSignals = signals.filter((signal) => signal.show);

  const openModal = (item: TrustSignalItem) => {
    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    setActiveModalItem(item);
  };

  const closeModal = () => {
    setActiveModalItem(null);

    requestAnimationFrame(() => {
      previouslyFocusedElementRef.current?.focus();
      previouslyFocusedElementRef.current = null;
    });
  };

  useEffect(() => {
    if (!activeModalItem) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key === 'Tab') {
        const dialog = document.getElementById(dialogId);

        if (!dialog) return;

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalItem, dialogId]);

  return (
    <section aria-labelledby={headingId} className={`relative rounded-2xl py-2 ${className}`.trim()}>
      <SectionHeading
        heading="Our Trust Promise"
        punchline="Tap any assurance to review verification and policy details."
        id={headingId}
      />

      {/* 
        Container-width responsive layout.

        Unlike md:grid-cols-3 / lg:grid-cols-6, this does NOT
        depend on viewport width.

        Each card gets at least 180px.
        The number of columns is automatically determined by
        the available width of this component's parent.
      */}
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5"
        aria-label="Customer trust assurances"
      >
        {activeSignals.map((item) => {
          const Icon = item.icon;
          const isActive = activeModalItem?.id === item.id;

          return (
            <div key={item.id} className="min-w-0">
              <button
                type="button"
                onClick={() => openModal(item)}
                aria-haspopup="dialog"
                aria-expanded={isActive}
                aria-controls={isActive ? dialogId : undefined}
                className="group focus-visible:outline-primary relative flex min-h-[145px] w-full cursor-pointer flex-col rounded-xl border border-neutral-200/80 bg-white/70 p-3 text-left transition-all duration-200 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {item.badge && (
                  <span className="bg-primary/15 absolute top-2 right-2 max-w-[calc(100%-1rem)] truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide">
                    {item.badge}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className="bg-primary/10 group-hover:bg-primary mb-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <span className="text-xs leading-snug font-semibold text-neutral-900 transition-colors sm:text-sm">
                  {item.title}
                </span>

                <span className="mt-0.5 text-[11px] leading-tight text-neutral-600">{item.subtitle}</span>

                <span
                  aria-hidden="true"
                  className="mt-auto inline-flex items-center pt-2 text-[10px] font-medium text-neutral-600"
                >
                  Details
                  <ChevronRight className="ml-0.5 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            className="animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden="true" className="bg-primary/10 flex shrink-0 rounded-xl p-2">
                  <activeModalItem.icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <h2 id={dialogTitleId} className="text-sm font-bold text-neutral-900">
                    {activeModalItem.title}
                  </h2>

                  <p className="text-xs text-neutral-600">{activeModalItem.subtitle}</p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                aria-label="Close details"
                className="focus-visible:outline-primary shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p id={dialogDescriptionId} className="mt-3.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">
              {activeModalItem.explanation}
            </p>

            {activeModalItem.link && (
              <a
                href={activeModalItem.link}
                className="focus-visible:outline-primary mt-4 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Read our official policy terms
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
