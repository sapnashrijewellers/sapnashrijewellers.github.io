import { WhatsappIcon } from "@/components/common/BrandIcons";

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  className?: string;
}

export default function FloatingWhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP,
  defaultMessage = "Hello! I have a question about your jewellery collection and services.",
  className = "",
}: FloatingWhatsAppButtonProps) {
  if (!phoneNumber) return null;

  const sanitizedNumber = phoneNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodedText}`;
  const accessibleActionLabel = `WhatsApp पर चैट करें: प्रश्न पूछें (Chat on WhatsApp with customer support at +${sanitizedNumber})`;

  return (
    <aside
      aria-label="Direct customer support contact"
      className={`fixed bottom-16 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${accessibleActionLabel} (opens in a new tab)`}
        title={`Chat on WhatsApp: +${sanitizedNumber} (opens in a new tab)`}
        className="
    inline-flex items-center justify-center p-3.5 sm:p-4 rounded-full
    bg-[#128C7E] text-white shadow-xl
    hover:bg-[#075E54] hover:scale-105 active:scale-95
    transition-[transform,background-color] duration-150 ease-out will-change-[transform]
    focus:outline-none focus:ring-2 focus:ring-[#128C7E] dark:focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background
  "
      >
        <WhatsappIcon
          className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-white"
          aria-hidden="true"
        />
        <span className="sr-only">
          Contact support on WhatsApp (opens in a new tab)
        </span>
      </a>
    </aside>
  );
}
