'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/catalog';
import { ShieldCheck, Truck, Heart, RefreshCcw, Sparkles, Award, ChevronRight, X, ExternalLink } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

interface TrustSignalsRibbonProps {
  product?: Product;
  className?: string;
}

interface TrustSignalItem {
  id: string;
  show: boolean;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  title: string;
  subtitle: string;
  explanation: string;
  link?: string;
  badge?: string;
}

export default function TrustSignalsRibbon({ product, className = '' }: TrustSignalsRibbonProps) {
  const [activeModalItem, setActiveModalItem] = useState<TrustSignalItem | null>(null);

  const metal = product?.metal || 'silver';
  const isGold = metal === 'gold';
  const weight = product?.weight || 0;
  const isHallmarkedGold = isGold && weight > 2;

  const signals: TrustSignalItem[] = [
    {
      id: 'authenticity',
      show: true,
      icon: Award,
      title: isHallmarkedGold ? 'BIS 916 Hallmark' : '925 Certified Silver',
      subtitle: 'Authenticity guaranteed',
      badge: 'Govt. Verified',
      explanation: isHallmarkedGold
        ? 'Government-approved BIS 916 hallmarking verifies precious gold purity with a unique laser-engraved HUID number traceable in the BIS Care app.'
        : 'Stamped authentic 925 sterling silver alloy containing 92.5% fine pure silver, tested and certified for lifelong metal integrity.',
      link: '/policies/authenticity/',
    },
    {
      id: 'warranty',
      show: true,
      icon: ShieldCheck,
      title: '6 Month Warranty',
      subtitle: "We're here after delivery",
      explanation:
        'Covers structural repairs, stone resetting, plating defects, and clasp malfunctions under regular wear. Claim easily via WhatsApp or email.',
      link: '/policies/warranty/',
    },
    {
      id: 'skin-safe',
      show: true,
      icon: Heart,
      title: 'Skin Safe Wear',
      subtitle: '100% hypoallergenic',
      explanation:
        'Completely lead-free and nickel-free composition. Rigorously tested against corrosion to avoid irritation, rashes, or greenish skin discoloration.',
    },
    {
      id: 'shipping',
      show: true,
      icon: Truck,
      title: 'Insured Delivery',
      subtitle: 'Travels safely to your door',
      explanation:
        'All parcels are shipped under transit insurance in tamper-evident sealed packaging. In case of theft or damage, we issue a prompt replacement or 100% refund.',
      link: '/policies/shipping/',
    },
    {
      id: 'returns',
      show: true,
      icon: RefreshCcw,
      title: 'Transparent Returns',
      subtitle: 'Shop with total confidence',
      explanation:
        "Try it on at home. If the fit or finish isn't perfect, initiate a straightforward doorstep exchange or return within our return window with zero hassle.",
      link: '/policies/returns/',
    },
    {
      id: 'craftsmanship',
      show: true,
      icon: Sparkles,
      title: 'Authentic Certificate',
      subtitle: 'Official grading card included',
      explanation:
        'Every order ships with a physical certificate of authenticity detailing metal gross weight, net weight, purity mark, and authorized signature.',
    },
  ];

  const activeSignals = signals.filter((s) => s.show);

  return (
    <section aria-labelledby="trust-ribbon-heading" className={`relative rounded-2xl py-2 ${className}`}>
      <SectionHeading
        heading="Your Trust Promise"
        punchline="Tap or hover over any assurance to review verification details."
      />
      {/* Screen Reader & SEO Context */}
      <div className="sr-only">
        Customer assurances for {product?.name || 'this item'}: Certified pure metal purity, 6-month repair warranty,
        hypoallergenic nickel-safe metals, transit-insured courier shipping, and transparent return policies.
      </div>

      {/* Interactive Assurance Cards */}
      <div
        role="list"
        aria-label="Trust assurances and guarantee details"
        className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6"
      >
        {activeSignals.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModalItem(item)}
              aria-haspopup="dialog"
              className="group hover:border-primary/50 focus-visible:outline-primary relative flex cursor-pointer flex-col rounded-xl border border-neutral-200/80 bg-white/70 p-3 text-left transition-all duration-200 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {/* Badge if present */}
              {item.badge && (
                <span className="bg-primary/15 absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide">
                  {item.badge}
                </span>
              )}

              {/* Icon Container */}
              <div
                className="bg-primary/10 group-hover:bg-primary mb-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Text Meta */}
              <span className="text-xs leading-snug font-semibold text-neutral-900 transition-colors sm:text-sm">
                {item.title}
              </span>
              <span className="mt-0.5 text-[11px] leading-tight text-neutral-600">{item.subtitle}</span>

              {/* Subtle hover trigger indicator */}
              <span className="mt-2 inline-flex items-center text-[10px] font-medium text-neutral-600">
                Details <ChevronRight className="ml-0.5 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Accessible Detail Modal / Bottom Drawer for Deep Risk Reduction */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trust-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
          onClick={() => setActiveModalItem(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setActiveModalItem(null);
          }}
        >
          <div
            className="animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 rounded-xl p-2">
                  <activeModalItem.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="trust-modal-title" className="text-sm font-bold text-neutral-900">
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs text-neutral-600">{activeModalItem.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">{activeModalItem.explanation}</p>

            {activeModalItem.link && (
              <a
                href={activeModalItem.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                Read our official policy terms
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
