import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsappIcon,
  YoutubeIcon,
  ClockIcon
} from "@/components/common/BrandIcons";

import { Phone, MapPin } from "lucide-react";
import BrandLogo from "../common/BrandLogo";



export default function Footer() {
  const currentYear = new Date().getFullYear()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, "");
  const policies = [
    { text: "Disclaimer", link: "/policies/disclaimer/" },
    { text: "Terms of Service", link: "/policies/terms/" },
    { text: "Privacy Policy", link: "/policies/privacy/" },
    { text: "Return & Exchange Policy", link: "/policies/returns/" },
    { text: "Shipping Policy", link: "/policies/shipping/" },
    { text: "Warranty & Purity Assurance", link: "/policies/warranty/" }
  ];

  const popularCollections = [
    { text: "Mahadev Silver Rings", link: "/c/1/" },
    { text: "Sawariya Seth Ring", link: "/c/3/" },
    { text: "Personalised Silver Rings", link: "/c/4/" },
    { text: "Khatushyam Silver Rings", link: "/c/8/" },
    { text: "Krishna Silver Pendants", link: "/c/6/" },
    { text: "Mahadev Silver Pendants", link: "/c/10/" },
    { text: "Hanuman Silver Rings", link: "/c/9/" }
  ];
  return (
    <footer
      aria-label="Site footer and store information"
      className="bg-footer text-footer border-t border-theme/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

        {/* 1. BRAND & TRUST PILLARS */}
        <section aria-label="Brand overview" className="space-y-3">
          <div className="flex items-center gap-2">
            <BrandLogo view="lg" />

          </div>
          <h2 className="text-3xl font-yatra footer-heading tracking-wide">
            Sapna Shri Jewellers
          </h2>
          <p className="text-sm italic opacity-90 leading-relaxed">
            Crafting Trust in Gold &amp; Silver Since Generations
          </p>

          <p className="text-xs opacity-80 leading-normal">
            BIS Hallmarked Jewellery &bull; Transparent Live Pricing
          </p>
        </section>

        {/* 2. POLICIES & LEGAL */}
        <nav aria-label="Store policies and customer protection">
          <h3 className="footer-heading font-yatra text-base sm:text-lg mb-3">
            Policies
          </h3>
          <ul className="space-y-2">
            {policies.map((policy) => (
              <li key={policy.link}>
                <Link
                  href={policy.link}
                  className="hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded"
                  title={`read full ${policy.text} policy details`}
                >
                  {policy.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. QUICK LINKS & UTILITIES */}
        <nav aria-label="Quick catalog navigation">
          <h3 className="footer-heading font-yatra text-base sm:text-lg mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {popularCollections.map((category) => (
              <li key={category.link}>
                <Link
                  href={category.link}
                  className="hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded"
                  title={`explore ${category.text} collection`}
                >
                  {category.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 4. PHYSICAL STORE ADDRESS & HOURS */}
        <section aria-label="Physical showroom address and hours">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-1" aria-hidden="true" />
            <h3 className="footer-heading font-yatra text-base sm:text-lg mb-3">
              Store Address
            </h3>
          </div>
          <address className="not-italic space-y-2.5 text-footer/90">


            <div>
              <p className="font-tiro leading-snug">
                सपना श्री ज्वैलर्स, रेलवे स्टेशन मेन रोड, नागदा जंक्शन, उज्जैन
              </p>
              <p className="font-cinzel text-xs opacity-80 mt-0.5">
                M G Road, Near Jain Mandir, Nagda Jn., Ujjain (M.P.)
              </p>
            </div>

            <p className="flex items-center gap-2">
              <ClockIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                11:00 AM – 8:00 PM
                <br />
                Monday Closed
              </span>
            </p>

            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <a
                href="tel:+918234042231"
                className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                title="Connect with our customer care for any queries."
              >
                +91-8234042231
              </a>
            </p>

            <p className="text-xs opacity-80 pt-1">
              GSTIN: <span className="font-mono">23AFFPG2954P1Z8</span>
            </p>
          </address>
          <Link
            href="/about-us/"
            className="hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded"
            title="Know more about Sapna Shri Jewellers heritage and history"
          >
            About Our Heritage
          </Link>
        </section>

        {/* 5. DIRECT CONTACT & SOCIAL PROFILES */}
        <section aria-label="Customer communication channels">
          <h3 className="footer-heading font-yatra text-base sm:text-lg mb-3">
            Connect With Us
          </h3>

          <a
            href={`https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent("Hello! I want to enquire about jewellery designs.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat directly on WhatsApp with Sapna Shri Jewellers"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-[transform,background-color] duration-150 ease-out will-change-[transform] shadow-md focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            title="Connect with us on WhatsApp"
          >
            <WhatsappIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Connect with us on WhatsApp</span>
          </a>

          <div className="flex items-center gap-4 mt-5 text-xl">
            <a
              href="https://www.facebook.com/share/14JjQReswYv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sapna Shri Jewellers on Facebook"
              title="Visit Sapna Shri Jewellers on Facebook"
              className="p-2 rounded-full border border-theme/40 hover:border-primary transition-[color,border-color,transform] duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]"
            >
              <FacebookIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/sapna_shri_jewllers_nagda/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Sapna Shri Jewellers on Instagram"
              title="Follow Sapna Shri Jewellers on Instagram"
              className="p-2 rounded-full border border-theme/40 hover:border-primary transition-[color,border-color,transform] duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Instagram</span>
            </a>

            <a
              href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts"
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe to Sapna Shri Jewellers on YouTube"
              aria-label="Subscribe to Sapna Shri Jewellers on YouTube"
              className="p-2 rounded-full border border-theme/40 hover:border-primary transition-[color,border-color,transform] duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]"
            >
              <YoutubeIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">YouTube</span>
            </a>
          </div>

        </section>
      </div>

      {/* COPYRIGHT & CREDITS */}
      <div className="border-t border-theme/20 text-center py-4 px-4 text-xs opacity-75">
        &copy; {currentYear} Sapna Shri Jewellers. All Rights Reserved.
      </div>
    </footer>
  );
}