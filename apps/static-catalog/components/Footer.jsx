// components/Footer.jsx
import {
  FaFacebookF, FaInstagram, FaYoutube, FaTv, FaWhatsapp,
  FaUserTie, FaShieldAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const phone = "918234042231";
  const whatsappUrl = `https://wa.me/${phone}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Disclaimer */}
        <div className="flex gap-2 text-xl">
          <FaExclamationCircle className="text-primary-dark mt-[1px]" />
          <p className="italic text-xs text-muted-foreground">
            अस्वीकरण: कीमतें बाजार दर के अनुसार बदलती रहती हैं। सभी दरें लगभग 5 मिनट की देरी से प्रदर्शित हैं। कृपया अंतिम कीमत और उत्पाद का अनुभव करने के लिए दुकान पर अवश्य आएँ। दी गई कीमतें केवल संकेतात्मक हैं, मेकिंग चार्ज एवं GST एक्स्ट्रा। *नियम एवं शर्तें लागू। किसी भी विवाद की स्थिति में न्यायिक क्षेत्र नागदा जंक्शन रहेगा।
          </p>
        </div>     
        {/* Social Media */}
        <div>
          <h2 className="flex items-center gap-2 text-lg mt-4">            
            🔗 हमसे जुड़ें / Follow Us
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
        <div className="flex flex-wrap gap-4 mt-4">
          <Link
            href="/about-us"
            className="flex items-center gap-2 font-bold text-lg mt-4 hover:text-foreground transition-colors"
            prefetch={false}
            title="Know more about Sapna Shri Jewellers"
          >
            <FaUserTie className="text-primary-dark mt-[1px]" />
            हमारी पहचान / About Us
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-2 font-bold text-lg mt-4 hover:text-foreground transition-colors"
            prefetch={false}
            title="privacy policy"
          >
            <FaShieldAlt className="text-primary-dark mt-[1px]" />
            Privacy Policy
          </Link>

          
          <Link className="flex items-center gap-2 font-bold text-lg mt-4 hover:text-foreground transition-colors hover:underline" href="/huid" title="HUID हॉलमार्किंग क्यों ज़रूरी है?">
              <img src="/img/hallmark.png" height="30px" width="25px"></img>
              हॉलमार्क
            </Link>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        &copy; {currentYear} Sapna Shri Jewellers. All rights reserved.
      </p>
    </footer>
  );
}
