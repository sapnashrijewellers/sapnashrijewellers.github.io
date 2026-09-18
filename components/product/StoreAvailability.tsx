import { MapPin, Clock, Store, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/common/BrandIcons';

interface StoreAvailabilityProps {
  productName?: string;
  className?: string;
}

export default function StoreAvailability({ productName = 'Jewellery Item', className = '' }: StoreAvailabilityProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  if (!whatsappNumber) return null;
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const appointmentMessage = `Hello Sapna Shri Jewellers, I would like to book an in-store appointment for local pickup of: ${productName}.`;
  const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(appointmentMessage)}`;

  return (
    <section
      aria-labelledby="store-availability-heading"
      className={`bg-surface mt-6 rounded-2xl p-2 shadow-sm sm:p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 pb-1">
        <Store className="h-5 w-5 shrink-0" aria-hidden="true" />
        <h3 id="store-availability-heading">Store Availability</h3>
      </div>

      {/* Availability Status */}
      <p className="text-foreground/90 mb-3.5 text-xs leading-relaxed sm:text-sm">
        This product is available for <span className="text-foreground font-semibold">Local Store Pickup</span> (MG
        Road, Nagda).
      </p>

      {/* Showroom Card */}
      <div className="bg-background/60 space-y-3 rounded-xl p-3.5 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <address className="text-foreground/85 space-y-1 text-xs not-italic sm:text-sm">
            <h4 className="text-foreground text-sm font-semibold sm:text-base">Sapna Shri Jewellers</h4>

            <p className="flex items-center gap-1.5 opacity-90">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>MG Road, Near Jain Mandir, Nagda Jn., MP, India</span>
            </p>

            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <a
                href={`tel:+${sanitizedWhatsApp}`}
                aria-label={`Call Sapna Shri Jewellers at +${sanitizedWhatsApp}`}
                title={`Call Sapna Shri Jewellers at +${sanitizedWhatsApp}`}
                className="text-foreground focus:ring-primary rounded font-medium transition-colors focus:ring-1 focus:outline-none"
              >
                +{sanitizedWhatsApp}
              </a>
            </p>
          </address>

          {/* Turnaround Badge */}
          <div className="bg-surface border-theme/40 text-foreground/90 inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1 text-[11px] font-medium sm:text-xs">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Usually ready in 24 hours</span>
          </div>
        </div>

        {/* In-Store Appointment CTA Section */}
        <div className="border-theme/20 flex flex-col justify-between gap-3 border-t pt-3 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-xs leading-snug">
            Want a personalized in-store preview? Book an appointment via WhatsApp.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Book an in-store appointment for ${productName} via WhatsApp`}
            aria-label={`Book an in-store appointment for ${productName} on WhatsApp (opens in a new tab)`}
            className="focus:ring-offset-background inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 py-2 text-xs font-medium text-white shadow-sm transition-[transform,background-color] duration-150 ease-out will-change-[transform] hover:scale-[1.01] hover:bg-[#075E54] focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 focus:outline-none active:scale-95 sm:text-sm"
          >
            <WhatsappIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Book Appointment</span>
            <span className="sr-only">for {productName} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
