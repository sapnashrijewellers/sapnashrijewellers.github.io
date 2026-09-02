"use client";

import { useState, useId, useCallback } from "react";
import { WhatsappIcon } from "@/components/common/BrandIcons";
import {Plus, Minus} from "lucide-react"
import type { Product } from "@/types/catalog";

interface BulkEnquiryProps {
  product: Product;
  className?: string;
}

export default function BulkEnquiry({
  product,
  className = "",
}: BulkEnquiryProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [requirements, setRequirements] = useState("");

  const sectionId = useId();
  const quantityId = useId();
  const requirementsId = useId();

  const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || "";
  const sanitizedWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const productUrl = `${baseUrl}/p/${product.id}/`;

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const message = `
Hello,

I would like to make a bulk inquiry for the following product:
🔹 Product: ${product.name}
🔹 Link: ${productUrl}
🔹 Quantity: ${quantity.trim() || "Not specified"}

📝 Requirements:
${requirements.trim() || "None"}

Please share the best price and delivery time frame.
`.trim();

  const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`border border-theme/40 rounded-2xl bg-surface shadow-sm overflow-hidden transition-[box-shadow,border-color] duration-150 ease-out will-change-[box-shadow] ${className}`}
    >
      {/* Accordion Trigger Header */}
      <h2>
        <button
          id={`${sectionId}-heading`}
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-controls={sectionId}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left text-foreground hover:bg-theme/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors duration-150"
        >
          <span className="font-semibold text-base sm:text-lg text-foreground tracking-tight flex items-center gap-2">
            Bulk Enquiry / Order
          </span>

          <span
            className="p-1 rounded-lg text-primary bg-primary/10 transition-transform duration-150 will-change-transform"
            aria-hidden="true"
          >
            {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
        className={`
          px-4 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
          ${
            open
              ? "pb-4 pt-1 opacity-100 scale-100 pointer-events-auto visible"
              : "opacity-0 scale-95 pointer-events-none hidden"
          }
        `}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5 text-sm">
          {/* Quantity Input */}
          <div>
            <label
              htmlFor={quantityId}
              className="block text-xs font-medium text-muted-foreground mb-1"
            >
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
              className="w-full p-2.5 bg-background border border-theme/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label
              htmlFor={requirementsId}
              className="block text-xs font-medium text-muted-foreground mb-1"
            >
              Additional Details / Customization  
            </label>
            <textarea
              id={requirementsId}
              rows={3}
              placeholder="Size, customization, delivery date, engraving, etc."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full p-2.5 bg-background border border-theme/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 resize-none transition-colors"
            />
          </div>

          {/* WhatsApp Direct Action CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            aria-label={`Send bulk order enquiry for ${product.name} on WhatsApp`}
            className="
              inline-flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl
              bg-[#25D366] text-white font-semibold text-sm shadow-md
              hover:bg-[#20bd5a] hover:scale-[1.01] active:scale-95
              transition-[transform,background-color] duration-150 ease-out will-change-[transform]
              focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
            "
          >
            <WhatsappIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Send on WhatsApp</span>
          </a>
        </form>
      </div>
    </section>
  );
}