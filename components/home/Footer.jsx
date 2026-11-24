import Link from 'next/link';
import { FacebookIcon, InstagramIcon, WhatsappIcon, YoutubeIcon, ClockIcon } from '@/components/common/BrandIcons';

import { Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '';
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const policies = [
    { text: 'Disclaimer', link: '/policies/disclaimer/' },
    { text: 'Terms of Service', link: '/policies/terms/' },
    { text: 'Privacy Policy', link: '/policies/privacy/' },
    { text: 'Return & Exchange Policy', link: '/policies/returns/' },
    { text: 'Shipping Policy', link: '/policies/shipping/' },
    { text: 'Warranty & Purity Assurance', link: '/policies/warranty/' },
  ];

  const trustHighlights = [
    '35+ years of craftsmanship',
    '5,000+ happy customers',
    'BIS-certified jewellery',
    'Pan-India delivery',
  ];

  return (
    <footer
      aria-label="Site footer and store information"
      className="border-theme/30 border-t bg-(--color-footer-bg) text-(--color-footer-text)"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* 1. BRAND & TRUST PILLARS */}
        <section aria-label="Brand overview" className="space-y-3">
          <div className="flex items-center gap-2">
            <BrandLogo view="lg" />
          </div>
          <h2 className="footer-heading text-3xl tracking-wide">Sapna Shri Jewellers</h2>
          <p className="text-sm leading-relaxed italic opacity-90">
            Crafting Trust in Gold &amp; Silver Since Generations
          </p>

          <div className="mt-5 flex items-center gap-4 text-xl">
            <a
              href="https://www.facebook.com/share/14JjQReswYv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sapna Shri Jewellers on Facebook"
              title="Visit Sapna Shri Jewellers on Facebook"
              className="rounded-full p-2"
            >
              <FacebookIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/sapna_shri_jewllers_nagda/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Sapna Shri Jewellers on Instagram"
              title="Follow Sapna Shri Jewellers on Instagram"
              className="rounded-full p-2"
            >
              <InstagramIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Instagram</span>
            </a>

            <a
              href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts"
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe to Sapna Shri Jewellers on YouTube"
              aria-label="Subscribe to Sapna Shri Jewellers on YouTube"
              className="rounded-full p-2"
            >
              <YoutubeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </section>

        {/* 2. POLICIES & LEGAL */}
        <nav aria-label="Store policies and customer protection">
          <h3 className="footer-heading mb-3 text-base sm:text-lg">Policies</h3>
          <ul className="space-y-2">
            {policies.map((policy) => (
              <li key={policy.link}>
                <Link
                  href={policy.link}
                  className="focus:ring-primary rounded transition-colors hover:underline focus:ring-1 focus:outline-none"
                  title={`read full ${policy.text} policy details`}
                >
                  {policy.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. OUR STORY & TRUST PILLARS */}
        <section aria-label="Our story and heritage" className="space-y-3">
          <h3 className="footer-heading text-base sm:text-lg">35+ Years of Trust</h3>
          <p className="text-sm leading-relaxed opacity-90">
            From a family jeweller in Nagda to jewellery lovers across India.
          </p>

          <ul className="space-y-1.5 pt-1 text-sm opacity-90">
            {trustHighlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
            <li>
              <Link
                href="/about-us/"
                className="focus:ring-primary group inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:underline focus:ring-1 focus:outline-none"
                title="Discover the journey and heritage of Sapna Shri Jewellers"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                href="/925-silver-jewellery/"
                className="focus:ring-primary group inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:underline focus:ring-1 focus:outline-none"
                title="925 Silver Jewellery Online in India | Handmade Silver Jewellery"
              >
                925 Silver Jewellery
              </Link>
            </li>
            <li>
              <Link
                href="/huid/"
                className="focus:ring-primary group inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:underline focus:ring-1 focus:outline-none"
                title="HUID Number Kya Hota Hai? Gold Jewellery Mein HUID Hallmark Samjhein"
              >
                HUID Number Kya Hota Hai?
              </Link>
            </li>
            <li>
              <Link
                href="/wholesale-silver-rings/"
                className="focus:ring-primary group inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:underline focus:ring-1 focus:outline-none"
                title="Wholesale Silver Rings – Religious & God Design Rings"
              >
                Wholesale Silver Rings
              </Link>
            </li>
          </ul>
        </section>

        {/* 4. PHYSICAL STORE ADDRESS & HOURS */}
        <section aria-label="Physical showroom address and hours">
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <h3 className="footer-heading mb-3">Store Address</h3>
          </div>
          <address className="space-y-2.5 text-(--color-footer-text)/90 not-italic">
            <div>
              <p>Sapna Shri Jewellers</p>
              <p className="mt-0.5">M G Road, Near Jain Mandir,</p>
              <p>Nagda Jn., Ujjain (M.P.)</p>
            </div>

            <p className="flex items-center gap-2">
              <ClockIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                11:00 AM – 8:00 PM
                <br />
                Monday Closed
              </span>
            </p>

            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <a
                href="tel:+918234042231"
                className="focus:ring-primary rounded hover:underline focus:ring-1 focus:outline-none"
                title="Connect with our customer care for any queries."
              >
                +91-8234042231
              </a>
            </p>

            <p className="pt-1 text-xs opacity-80">
              GSTIN: <span className="font-mono">23AFFPG2954P1Z8</span>
            </p>
          </address>
        </section>
      </div>

      {/* COPYRIGHT & CREDITS */}
      <div className="border-theme/20 border-t px-4 py-4 text-center text-xs opacity-75">
        &copy; {currentYear} Sapna Shri Jewellers. All Rights Reserved. | Technology Partner&nbsp;
        <a href="https://mehtalogy.in" className="hover:underline">
          mehtalogy.in
        </a>
      </div>
    </footer>
  );
}
