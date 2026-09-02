import { MapPin, Clock, Store, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/common/BrandIcons";

interface StoreAvailabilityProps {
  productName?: string;
  className?: string;
}

export default function StoreAvailability({
  productName = "Jewellery Item",
  className = "",
}: StoreAvailabilityProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  if (!whatsappNumber) return null;
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, "");

  const appointmentMessage = `Hello Sapna Shri Jewellers, I would like to book an in-store appointment for local pickup of: ${productName}.`;
  const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(appointmentMessage)}`;

  return (
    <section
      aria-labelledby="store-availability-heading"
      className={`mt-6 rounded-2xl  bg-surface p-2 sm:p-5 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 pb-1">
        <Store className="h-5 w-5 shrink-0" aria-hidden="true" />
        <h3
          id="store-availability-heading"
          className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
        >
          Store Availability
        </h3>
      </div>

      {/* Availability Status */}
      <p className="mb-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
        This product is available for{" "}
        <span className="font-semibold text-foreground">
          Local Store Pickup
        </span>{" "}
        (MG Road, Nagda).
      </p>

      {/* Showroom Card */}
      <div className="rounded-xl  bg-background/60 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <address className="not-italic space-y-1 text-xs sm:text-sm text-foreground/85">
            <h4 className="text-sm sm:text-base font-semibold text-foreground font-yatra">
              Sapna Shri Jewellers
            </h4>

            <p className="flex items-center gap-1.5 opacity-90">
              <MapPin
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>MG Road, Near Jain Mandir, Nagda Jn., MP, India</span>
            </p>

            <p className="flex items-center gap-1.5">
              <Phone
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <a
                href={`tel:+${sanitizedWhatsApp}`}
                aria-label={`Call Sapna Shri Jewellers at +${sanitizedWhatsApp}`}
                title={`Call Sapna Shri Jewellers at +${sanitizedWhatsApp}`}
                className="font-medium text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                +{sanitizedWhatsApp}
              </a>
            </p>
          </address>

          {/* Turnaround Badge */}
          <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-surface border border-theme/40 px-3 py-1 text-[11px] sm:text-xs font-medium text-foreground/90 shrink-0">
            <Clock
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>Usually ready in 24 hours</span>
          </div>
        </div>

        {/* In-Store Appointment CTA Section */}
        <div className="pt-3 border-t border-theme/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground leading-snug">
            Want a personalized in-store preview? Book an appointment via
            WhatsApp.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Book an in-store appointment for ${productName} via WhatsApp`}
            aria-label={`Book an in-store appointment for ${productName} on WhatsApp (opens in a new tab)`}
            className="
    inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
    bg-[#128C7E] text-white font-medium text-xs sm:text-sm shadow-sm
    hover:bg-[#075E54] hover:scale-[1.01] active:scale-95
    transition-[transform,background-color] duration-150 ease-out will-change-[transform]
    focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 focus:ring-offset-background shrink-0
  "
          >
            <WhatsappIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Book Appointment</span>
            <span className="sr-only">
              for {productName} (opens in a new tab)
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
