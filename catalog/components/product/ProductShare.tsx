import type { Product } from "@/types/catalog";
import NativeShare from "@/components/product/NativeShare";
import { WhatsappIcon, TelegramIcon } from "@/components/common/BrandIcons";

interface ProductShareProps {
  product: Product;
  phone?: string;
  className?: string;
}

export default function ProductShare({
  product,
  phone = "8234042231",
  className = "",
}: ProductShareProps) {
  const baseURL = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in"
  ).replace(/\/+$/, "");
  const baseProductUrl = `${baseURL}/p/${product.id}/`;

  const shareText = `Check out this jewellery design: ${product.name} at Sapna Shri Jewellers 💎`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(baseProductUrl);

  const whatsappShareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  return (
    <section
      aria-label="Share product options"
      className={`py-2 mt-2 ${className}`}
    >
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2.5">
        Share this product
      </h3>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Direct WhatsApp Share */}
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share ${product.name} on WhatsApp`}
          aria-label={`Share ${product.name} on WhatsApp`}
          className="
            inline-flex items-center justify-center p-2 rounded-xl
            bg-surface border border-theme/40 text-[#25D366] shadow-sm
            hover:bg-[#25D366] hover:text-white hover:border-[#25D366]
            transition-[color,background-color,border-color,transform] duration-150 ease-out will-change-[transform]
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366]
          "
        >
          <WhatsappIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">Share on WhatsApp</span>
        </a>

        {/* Direct Telegram Share */}
        <a
          href={telegramShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share ${product.name} on Telegram`}
          aria-label={`Share ${product.name} on Telegram`}
          className="
            inline-flex items-center justify-center p-2 rounded-xl
            bg-surface border border-theme/40 text-[#229ED9] shadow-sm
            hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]
            transition-[color,background-color,border-color,transform] duration-150 ease-out will-change-[transform]
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#229ED9]
          "
        >
          <TelegramIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">Share on Telegram</span>
        </a>

        {/* Native Web Share API + Direct Clipboard & Fallback */}
        <NativeShare
          productName={product.name}
          productUrl={baseProductUrl}
          phone={phone}
        />
      </div>
    </section>
  );
}