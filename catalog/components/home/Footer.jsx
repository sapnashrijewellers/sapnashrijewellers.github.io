"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import JewelleryTipsWidget from "@/components/common/JewelleryTipsWidget";
import BrandLogo from "../common/BrandLogo";

export default function Footer() {
  const [tipsOpen, setTipsOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer text-footer">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* BRAND */}
        <div>
          <h1 className="text-2xl font-yatra footer-heading">
            <BrandLogo view="lg" />
            Sapna Shri Jewellers
          </h1>
          <p className="mt-2 text-sm italic opacity-90">
            Crafting Trust in Gold & Silver Since Generations
          </p>
          <div className="mt-4 text-xs opacity-80">
            BIS Hallmarked Jewellery • Transparent Pricing
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="footer-heading font-yatra text-lg mb-3">Policies</h2>
          <p className="text-xs mt-3 opacity-75">
            Prices may vary based on live market rates... <Link href="/policies/disclaimer/" className="text-xs underline">
              Read full disclaimer
            </Link>
          </p>


          <ul className="space-y-2 text-sm">
            <li><Link href="/policies/terms/">Terms of Service</Link></li>
            <li><Link href="/policies/privacy/">Privacy Policy</Link></li>
            <li><Link href="/policies/returns/">Return Policy</Link></li>
            <li><Link href="/policies/shipping/">Shipping Policy</Link></li>
            <li><Link href="/policies/warranty/">Warranty Policy</Link></li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="footer-heading font-yatra text-lg mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about-us/">About Us</Link></li>            
            <li><Link href="/#shop-by-category">Shop by Category</Link></li>
            <li><Link href="/#shop-by-occasion">Shop by Occasion</Link></li>
            <li><Link href="/qr/">QR code for Payment</Link></li>
            <li><Link href="#" onClick={() => setTipsOpen(true)}>Jewellery Buying Tips 💡</Link></li>
          </ul>
        </div>

        {/* STORE & LEGAL */}
        <div>
          <h2 className="footer-heading font-yatra text-lg mb-3 ">Store Address</h2>

          <div className="text-sm space-y-3">
            <p className="font-tiro">
              सपना श्री ज्वैलर्स,<br />
              रेलवे स्टेशन मेन रोड,<br />
              नागदा जंक्शन, उज्जैन
            </p>

            <p className="font-cinzel">
              M G Road, Near Jain Mandir, <br />
              Nagda Junction, Ujjain
            </p>

            <p className="flex items-center gap-2">
              <FaClock /> 11:00 AM – 8:00 PM
            </p>
            <p className="flex items-center gap-2">
              📞 Mobile: +91-8234042231
            </p>


            <p className="text-xs opacity-80">
              GSTIN: 23AFFPG2954P1Z8
            </p>
          </div>
        </div>

        {/* CONNECT */}
        <div>
          <h2 className="footer-heading font-yatra text-lg mb-3">Connect With Us</h2>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
            className="inline-flex items-center gap-2 text-sm ssj-btn"
          >
            <FaWhatsapp /> Ask on WhatsApp
          </a>

          <div className="flex gap-4 mt-4 text-xl">
            <a href="https://www.facebook.com/share/14JjQReswYv/" target="_blank"><FaFacebookF className="icon-footer-trust" /></a>
            <a href="https://www.instagram.com/sapna_shri_jewllers/" target="_blank"><FaInstagram className="icon-footer-trust"/></a>
            <a href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts" target="_blank"><FaYoutube className="icon-footer-trust"/></a>
          </div>
          {/* Play Store Widget */}
          <div className="mt-6">
            <p className="text-xs font-medium opacity-80 mb-2">📱 Download our Android App</p>
            <a
              href="https://play.google.com/store/apps/details?id=com.yourapp.package"
              target="_blank"
              className="inline-block"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-16"  
              />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-theme text-center py-4 text-xs opacity-70">
        © {year} Sapna Shri Jewellers. All Rights Reserved.
      </div>

      <JewelleryTipsWidget
        isOpen={tipsOpen}
        onOpen={() => setTipsOpen(true)}
        onClose={() => setTipsOpen(false)}
      />
    </footer>
  );
}
