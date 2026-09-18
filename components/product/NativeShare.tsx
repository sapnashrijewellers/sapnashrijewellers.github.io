'use client';

import { useCallback, useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface NativeShareProps {
  productName?: string;
  productUrl?: string;
  phone?: string;
  className?: string;
}

export default function NativeShare({
  productName = 'Beautiful Jewellery',
  productUrl,
  phone = '8234042231',
  className = '',
}: NativeShareProps) {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const sanitizedPhone = phone.replace(/[^0-9]/g, '');
  const shareUrl =
    productUrl || (typeof window !== 'undefined' ? window.location.href : `https://wa.me/${sanitizedPhone}`);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${productName} | Sapna Shri Jewellers`,
      text: `Check out ${productName} from Sapna Shri Jewellers 💎`,
      url: shareUrl,
    };

    // 1. Native Web Share API (Primary mobile target)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setStatusMessage('Shared successfully');
        return;
      } catch (err) {
        // User cancellation is normal behavior
        if ((err as Error).name !== 'AbortError') {
          console.error('Web share failed:', err);
        }
      }
    }

    // 2. Clipboard Fallback (Desktop / unsupported browsers)
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setStatusMessage('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }

    // 3. WhatsApp Direct Fallback
    const whatsappFallback = `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareUrl}`)}`;
    window.open(whatsappFallback, '_blank', 'noopener,noreferrer');
  }, [productName, shareUrl]);

  const accessibleLabel = copied ? `${productName} Link copied to clipboard` : `Share ${productName})`;

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
        className="bg-surface border-theme/50 text-foreground/90 hover:bg-theme/10 hover:text-foreground focus:ring-primary focus:ring-offset-background inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-sm transition-[transform,background-color,border-color,color] duration-150 ease-out will-change-[transform] focus:ring-2 focus:ring-offset-1 focus:outline-none active:scale-95 sm:text-sm"
      >
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-emerald-600 select-none" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4 shrink-0 select-none" aria-hidden="true" />
        )}

        <span>{copied ? 'Copied' : 'Share'}</span>
        <span className="sr-only">product details</span>
      </button>
    </div>
  );
}
