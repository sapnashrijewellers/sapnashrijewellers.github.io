import { MapPin, Clock, Store } from "lucide-react";

export default function StoreAvailability() {
  return (
    <section className="mt-6 rounded-2xl border border-primary/30 bg-surface p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Store className="h-5 w-5 " />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
          Store Availability
        </h3>
      </div>

      {/* Availability Message */}
      <p className="mb-4 text-sm text-normal">
        This product is available for <span className="font-medium">local pickup</span>.
      </p>

      {/* Store Card */}
      <div className="rounded-xl border border-theme bg-highlight p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2>Sapna Shri Jewellers</h2>
            <p className="flex items-center gap-1 text-sm opacity-80">
              <MapPin className="h-4 w-4" />
              MG Road, Nagda Jn., India
            </p>
            <a
              href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP}`}
              className="text-sm font-medium"
            >
              +{process.env.NEXT_PUBLIC_WHATSAPP}
            </a>
          </div>

          
        </div>
        <div className="flex items-center gap-1 rounded-full bg-page px-3 py-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            Usually ready in 24 hours
          </div>
              {/* Appointment CTA */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ">
          <p className="text-sm opacity-80">
            Want a personalized in-store experience? Book an appointment so we can serve you better.
          </p>

          <a
            href="https://wa.me/91888XXXXXXX?text=Hello%20Sapna%20Shri%20Jewellers,%20I%20would%20like%20to%20book%20an%20appointment%20for%20local%20pickup."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center border border-primary px-5 py-2 text-sm ssj-btn"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
