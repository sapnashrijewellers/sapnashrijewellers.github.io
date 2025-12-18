"use client";

import {
  FaFacebookF, FaInstagram, FaYoutube, FaTv, FaWhatsapp,
  FaUserTie, FaShieldAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JewelleryTipsWidget from "@/components/common/JewelleryTipsWidget";

const baseURL = process.env.BASE_URL;

export default function Footer() {
  const [tipsOpen, setTipsOpen] = useState(false);

  const phone = "918234042231";
  const whatsappUrl = `https://wa.me/${phone}`;
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Disclaimer */}
        <div className="flex gap-2 text-xl">
          <p className="italic text-xs text-muted-foreground">
            अस्वीकरण: कीमतें बाजार दर के अनुसार बदलती रहती हैं। सभी दरें लगभग 5 मिनट की देरी से प्रदर्शित हैं। कृपया अंतिम कीमत और उत्पाद का अनुभव करने के लिए दुकान पर अवश्य आएँ।
            दी गई कीमतें केवल संकेतात्मक हैं, मेकिंग चार्ज एवं GST एक्स्ट्रा। *नियम एवं शर्तें लागू। *
            The indicated rates are for Gold per 10 grams and Silver per kilogram only.
            *Rates are for reference purpose only, rates may sometimes vary due to high volatility in the market.
            Actual product design may vary slightly from the images shown.
            किसी भी विवाद की स्थिति में न्यायिक क्षेत्र नागदा जंक्शन रहेगा।
          </p>
        </div>
        {/* Store Location */}
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg font-cinzel">
            <FaMapMarkerAlt className="text-red-500 mt-[1px]" />
            Store Address
          </h2>
          {/* Store Location */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto text-primary">
            {/* Hindi Address */}
            <address className="bg-accent border border-theme rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold ">
                📌 सपना श्री ज्वैलर्स,
              </h3>
              रेलवे स्टेशन मेन रोड, जैन मंदिर के पास,<br />
              नागदा जंक्शन, जिला उज्जैन<br />
              📞 8234042231
            </address>
            {/* English Address */}
            <address className="bg-accent border border-theme rounded-2xl p-6 shadow-md font-cinzel">
              <h2 className="text-lg font-semibold">
                📌 Sapna Shri Jewellers,
              </h2>
              Near Railway Station, M G Road,<br />
              Nagda Junction, District: Ujjain<br />
              📞 8234042231
            </address>
          </div>
        </div>
        {/* Social Media */}
        <div>
          <h2 className="flex items-center gap-2 text-lg mt-4 font-cinzel">
            🔗 Follow Us
          </h2>

          <div className="flex gap-4 mt-2 text-xl sm:text-2xl md:text-3xl text-muted-foreground">
            <a
              href="https://www.facebook.com/share/14JjQReswYv/"
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with us on Facebook"
              className="hover:!text-blue-600 transition-colors"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/sapna_shri_jewllers/"
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with us on Instagram"
              className="hover:!text-pink-600 transition-colors"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts"
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with us on YouTube"
              className="hover:!text-red-600 transition-colors"
            >
              <FaYoutube />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with us on WhatsApp"
              className="hover:!text-green-600 transition-colors text-primary"
            >
              <FaWhatsapp />
            </a>

            <Link
              href="/tv"
              title="TV advertisement"
              className="hover:text-accent hover:scale-110 transform transition duration-200"
              prefetch={false}
            >
              <FaTv />
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-4 mt-4 font-cinzel">
          <Link
            href="/about-us"
            className="flex items-center gap-2 mt-4 transition-colors"
            prefetch={false}
            title="Know more about Sapna Shri Jewellers"
          >
            <FaUserTie className="text-primary-dark mt-[1px]" />
            About Us
          </Link>
          <button
          onClick={() => setTipsOpen(true)}
          className="ssj-btn flex items-center gap-2 mt-4 transition-colors text-primary underline hover:text-primary-dark"
        >          Jewellery Buying Tips
        </button>
          <Link
            href="/privacy"
            className="flex items-center gap-2 mt-4 transition-colors"
            prefetch={false}
            title="privacy policy"
          >
            <FaShieldAlt className="text-primary-dark mt-[1px]" />
            Privacy Policy
          </Link>

          <Link
            className="flex items-center gap-2 mt-4 transition-colors"
            href="/huid"
            title="HUID हॉलमार्किंग क्यों ज़रूरी है?"
          >
            <Image
              src={`${baseURL}/static/img/hallmark.png`}
              width={25}
              height={30}
              alt="HUID हॉलमार्किंग क्यों ज़रूरी है?"
              style={{ height: "auto" }}   // 👈 fix
            />
            Hallmark
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        &copy; {currentYear} Sapna Shri Jewellers. All rights reserved.
      </p>
      <JewelleryTipsWidget
        isOpen={tipsOpen}
        onOpen={() => setTipsOpen(true)}
        onClose={() => setTipsOpen(false)}
      />
    </footer>
  );
}
