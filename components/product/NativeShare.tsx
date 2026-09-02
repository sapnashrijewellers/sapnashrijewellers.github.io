"use client";

import { useCallback, useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface NativeShareProps {
  productName?: string;
  productUrl?: string;
  phone?: string;
  className?: string;
}

export default function NativeShare({
  productName = "Beautiful Jewellery",
  productUrl,
  phone = "8234042231",
  className = "",
}: NativeShareProps) {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const sanitizedPhone = phone.replace(/[^0-9]/g, "");
  const shareUrl =
    productUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : `https://wa.me/${sanitizedPhone}`);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${productName} | Sapna Shri Jewellers`,
      text: `Check out ${productName} from Sapna Shri Jewellers 💎`,
      url: shareUrl,
    };

    // 1. Native Web Share API (Primary mobile target)
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setStatusMessage("Shared successfully");
        return;
      } catch (err) {
        // User cancellation is normal behavior
        if ((err as Error).name !== "AbortError") {
          console.error("Web share failed:", err);
        }
      }
    }

    // 2. Clipboard Fallback (Desktop / unsupported browsers)
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setStatusMessage("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }

    // 3. WhatsApp Direct Fallback
    const whatsappFallback = `https://wa.me/?text=${encodeURIComponent(
      `${shareData.text}\n${shareUrl}`
    )}`;
    window.open(whatsappFallback, "_blank", "noopener,noreferrer");
  }, [productName, shareUrl]);

  const accessibleLabel = copied
    ? `${productName} Link copied to clipboard`
    : `Share ${productName})`;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {statusMessage}
      </div>

      <button
        type="button"
        onClick={handleShare}
        aria-label={accessibleLabel}
        className="
          inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl
          bg-surface border border-theme/50 text-foreground/90 font-medium text-xs sm:text-sm shadow-sm
          hover:bg-theme/10 hover:text-foreground hover:border-primary/40 active:scale-95
          transition-[transform,background-color,border-color,color] duration-150 ease-out will-change-[transform]
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background
          cursor-pointer
        "
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600 shrink-0 select-none" aria-hidden="true" />
        ) : (
          <Share2 className="w-4 h-4 shrink-0 select-none" aria-hidden="true" />
        )}

        <span>{copied ? "Copied" : "Share"}</span>
        <span className="sr-only">product details</span>
      </button>
    </div>
  );
}