'use client';

import { useState, useId, useCallback } from 'react';
import { WhatsappIcon } from '@/components/common/BrandIcons';
import { Plus, Minus } from 'lucide-react';
import type { Product } from '@/types/catalog';

interface BulkEnquiryProps {
  product: Product;
  className?: string;
}

export default function BulkEnquiry({ product, className = '' }: BulkEnquiryProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [requirements, setRequirements] = useState('');

  const sectionId = useId();
  const quantityId = useId();
  const requirementsId = useId();

  const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP;
  if (!rawWhatsApp) return null;
  const sanitizedWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  const productUrl = `${baseUrl}/p/${product.id}/`;

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const message = `
Hello,

I would like to make a bulk inquiry for the following product:
🔹 Product: ${product.name}
🔹 Link: ${productUrl}
🔹 Quantity: ${quantity.trim() || 'Not specified'}

📝 Requirements:
${requirements.trim() || 'None'}

Please share the best price and delivery time frame.
`.trim();

  const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(message)}`;

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`border-theme/40 bg-surface overflow-hidden rounded-2xl border shadow-sm transition-[box-shadow,border-color] duration-150 ease-out will-change-[box-shadow] ${className}`}
    >
      {/* Accordion Trigger Header */}
      <h2>
        <button
          id={`${sectionId}-heading`}
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-controls={sectionId}
          className="text-foreground hover:bg-theme/5 flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 focus:outline-none"
        >
          <span className="text-foreground flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
            Bulk Enquiry / Order
          </span>

          <span
            className="bg-primary/10 rounded-lg p-1 transition-transform duration-150 will-change-transform"
            aria-hidden="true"
          >
            {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </span>
        </button>
      </h2>

      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Bulk order enquiry form for {product.name}. Direct WhatsApp quotation channel available.
      </div>

      {/* Collapsible Content */}
      <div
        id={sectionId}
        role="region"
        aria-labelledby={`${sectionId}-heading`}
        aria-hidden={!open}
        className={`px-4 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity] ${
          open
            ? 'pointer-events-auto visible scale-100 pt-1 pb-4 opacity-100'
            : 'pointer-events-none hidden scale-95 opacity-0'
        } `}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5 text-sm">
          {/* Quantity Input */}
          <div>
            <label htmlFor={quantityId} className="text-muted-foreground mb-1 block text-xs font-medium">
              Required Quantity
            </label>
            <input
              id={quantityId}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-background border-theme/60 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 w-full rounded-xl border p-2.5 transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label htmlFor={requirementsId} className="text-muted-foreground mb-1 block text-xs font-medium">
              Additional Details / Customization
            </label>
            <textarea
              id={requirementsId}
              rows={3}
              placeholder="Size, customization, delivery date, engraving, etc."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="bg-background border-theme/60 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 w-full resize-none rounded-xl border p-2.5 transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* WhatsApp Direct Action CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            title={`Send bulk order enquiry for ${product.name} on WhatsApp`}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#128C7E] px-5 py-3 text-sm font-semibold text-white shadow-md transition-[transform,background-color] duration-150 ease-out will-change-[transform] hover:scale-[1.01] hover:bg-[#075E54] focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none active:scale-95"
          >
            <WhatsappIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Send bulk order enquiry for {product.name} on WhatsApp</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </form>
      </div>
    </section>
  );
}
