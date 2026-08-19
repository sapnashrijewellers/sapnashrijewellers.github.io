import { WhatsappIcon } from "@/components/common/BrandIcons";
import type { Product } from "@/types/catalog";

interface OrderViaWhatsappButtonProps {
  product: Product;
  title?: string;
  className?: string;
}

export default function OrderViaWhatsappButton({
  product,
  title = "Order via WhatsApp",
  className = "",
}: OrderViaWhatsappButtonProps) {
  const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || "918234042231";
  const sanitizedWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in"
  ).replace(/\/+$/, "");

  const productUrl = `${baseUrl}/product/${product.slug}/`;

  const message = `
नमस्ते,

मुझे इस आभूषण के बारे में अधिक जानकारी और छूट (discount) चाहिए:

🔹 उत्पाद (Product): ${product.name}
🔹 लिंक (Link): ${productUrl}

कृपया विवरण और सर्वोत्तम मूल्य साझा करें।
`.trim();

  const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(
    message
  )}`;

  const accessibleLabel = `WhatsApp पर ऑर्डर करें: ${product.name} (Order ${product.name} via WhatsApp enquiry)`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Order ${product.name} via WhatsApp`}
      aria-label={accessibleLabel}
      className={`
        inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl
        bg-surface border border-theme/50 shadow-sm
        hover:border-[#25D366] hover:shadow-md hover:scale-[1.01] active:scale-95
        transition-[transform,border-color,box-shadow] duration-150 ease-out will-change-[transform]
        focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background
        ${className}
      `}
    >
      {/* WhatsApp Brand Icon */}
      <WhatsappIcon
        className="w-7 h-7 sm:w-8 sm:h-8 text-[#25D366] shrink-0"
        aria-hidden="true"
      />

      {/* Label Container */}
      <div className="flex flex-col text-left leading-tight">
        <span className="font-semibold text-foreground text-sm sm:text-base">
          {title}
        </span>
        <span className="text-[11px] sm:text-xs text-[#25D366] font-medium">
          Click for offers &amp; instant assistance
        </span>
      </div>

      <span className="sr-only">for {product.name}</span>
    </a>
  );
}