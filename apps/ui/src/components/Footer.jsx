import {
  FaFacebookF, FaInstagram, FaYoutube, FaTv, FaWhatsapp, FaLocationArrow, FaMapPin,
  FaMapMarkerAlt, FaPhoneAlt, FaLink, FaUserTie, FaShieldAlt, FaExclamationCircle, FaBoxOpen
} from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Footer() {
  const phone = "918234042231";
  const whatsappUrl = `https://wa.me/${phone}`;

  return (
    <footer className="bg-background text-foreground p-6 mt-12 border-t border-border">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Disclaimer */}
        <div className="flex gap-2 text-xl">
          <FaExclamationCircle className="text-primary-dark mt-[1px]" />
          <p className=" italic text-xs text-muted-foreground">
            अस्वीकरण: कीमतें बाजार दर के अनुसार बदलती रहती हैं। सभी दरें लगभग 5 मिनट की देरी से प्रदर्शित हैं। कृपया अंतिम कीमत और उत्पाद का अनुभव करने के लिए दुकान पर अवश्य आएँ। दी गई कीमतें केवल संकेतात्मक हैं, मेकिंग चार्ज एवं GST एक्स्ट्रा। *नियम एवं शर्तें लागू। किसी भी विवाद की स्थिति में न्यायिक क्षेत्र नागदा जंक्शन रहेगा।
          </p>
        </div>

        {/* About Us */}
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg mt-4">
            <FaUserTie className="text-primary-dark mt-[1px]" />
            हमारी पहचान / About Us
          </h2>
          <p className="text-muted-foreground">
            सपना श्री ज्वेलर्स पिछले 35 वर्षों से सोने और चांदी के गहनों के क्षेत्र में अपनी उत्कृष्ट कला, भरोसेमंद सेवा और उच्च गुणवत्ता के लिए जाना जाता है।
            हमारी पहचान है — ख़ूबसूरती, विश्वसनीयता और पारदर्शिता।
          </p>

          <br />
          <p className="flex gap-2">
            <FaBoxOpen className="text-emerald-600 mt-[1px]" />
            यहाँ आपको मिलेंगे –
          </p>
          <p >
            ✨ शुद्ध 22 कैरेट सोने के गहने <br />
            ✨ आकर्षक चांदी के आभूषण <br />
            ✨ मनपसंद कस्टम डिज़ाइन – आपकी पसंद के अनुसार बनाए गए <br />
            ✨ धार्मिक और पारंपरिक डिज़ाइन में आधुनिकता का संगम <br />
            💠 सपना श्री ज्वेलर्स – जहां हर गहना एक कहानी कहता है। 💠
          </p>
        </div>

        {/* Store Location */}
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg">
            <FaMapMarkerAlt className="text-red-500 mt-[1px]" />
            दुकान का स्थान
          </h2>
          <address className="text-muted-foreground not-italic">
            सपना श्री ज्वैलर्स,<br />
            रेलवे स्टेशन मेन रोड, जैन मंदिर के पास,<br />
            नागदा, जिला उज्जैन<br />
            📞 8234042231
          </address>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg mt-4">
            <FaLink className="text-blue-600 mt-[1px]" />
            हमसे जुड़ें / Follow Us
          </h2>
          <div className="flex gap-4 mt-2 text-xl sm:text-2xl md:text-3xl text-muted-foreground">
            <a
              href="https://www.facebook.com/share/14JjQReswYv/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="hover:text-blue-600 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/sapna_shri_jewllers/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="hover:text-pink-600 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="hover:text-red-600 transition-colors"
            >
              <FaYoutube />
            </a>
            <a
              onClick={() => window.open(whatsappUrl, "_blank")}
              href="_blank"
              title="WhatsApp"
              className="hover:text-green-600 transition-colors text-primary"
            >
              <FaWhatsapp />
            </a>
            <Link
              to="/tv"
              title="TV"
              className="hover:text-accent hover:scale-110 transform transition duration-200"
            >
              <FaTv />
            </Link>
            {/* <a
              href="/#/tv"
              target="_blank"
              rel="noopener noreferrer"
              title="TV"
              className="hover:text-accent hover:scale-110 transform transition duration-200"
            >
              <FaTv />
            </a> */}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-4">
          <Link to="/privacy" className="flex items-center gap-2 font-bold text-lg mt-4 hover:text-foreground transition-colors">
            <FaShieldAlt className="text-primary-dark mt-[1px]" />
            Privacy Policy
          </Link>
          <Link to="/about-us" className="flex items-center gap-2 font-bold text-lg mt-4 hover:text-foreground transition-colors">
            <FaUserTie className="text-primary-dark mt-[1px]" />
            हमारी पहचान / About Us
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        &copy; {new Date().getFullYear()} Sapna Shri Jewellers. All rights reserved.
      </p>
    </footer>
  );
}
