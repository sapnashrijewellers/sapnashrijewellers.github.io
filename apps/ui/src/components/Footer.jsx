import { FaFacebookF, FaInstagram, FaYoutube, FaTv, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const phone = "918234042231"; // India country code + number
  const whatsappUrl = `https://wa.me/${phone}`;
  return (
    <footer className="bg-gray-900 text-white p-6 mt-12">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* About Us */}
        <div>
          <p className="italic text-xs ">
            अस्वीकरण: कीमतें बाजार दर के अनुसार बदलती रहती हैं। सभी दरें लगभग 5 मिनट की देरी से प्रदर्शित हैं। कृपया अंतिम कीमत और उत्पाद का अनुभव करने के लिए दुकान पर अवश्य आएँ। दी गई कीमतें केवल संकेतात्मक हैं,मेकिंग चार्ज एवं GST एक्स्ट्रा" *नियम एवं शर्ते लागू .किसी भी विवाद की स्थिति में न्यायिक क्षेत्र नागदा जंक्शन रहेगा|

          </p>
          <br />
          <h2 className="font-bold text-lg">हमारी पहचान</h2>
          <p className="text-gray-300">
            सपना श्री ज्वेलर्स पिछले 35 वर्षों से सोने और चांदी के गहनों के क्षेत्र में अपनी उत्कृष्ट कला, भरोसेमंद सेवा और उच्च गुणवत्ता के लिए जाना जाता है।
हमारी पहचान है — ख़ूबसूरती, विश्वसनीयता और पारदर्शिता।

यहाँ आपको मिलेंगे –
✨ शुद्ध 22 कैरेट सोने के गहने
✨ आकर्षक चांदी के आभूषण
✨ मनपसंद कस्टम डिज़ाइन – आपकी पसंद के अनुसार बनाए गए
✨ धार्मिक और पारंपरिक डिज़ाइन में आधुनिकता का संगम
💠 सपना श्री ज्वेलर्स – जहां हर गहना एक कहानी कहता है। 💠          </p>

        </div>

        {/* Store Location */}
        <div>
          <h2 className="font-bold text-lg">दुकान का स्थान</h2>
          <p className="text-gray-300">
            सपना श्री ज्वैलर्स,
            रेलवे स्टेशन मेन रोड, जैन मंदिर के पास
            नागदा, जिला उज्जैन
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="font-bold text-lg">Follow Us</h2>
          <div className="flex gap-4 mt-2 text-gray-300 text-3xl">
            <a href="https://www.facebook.com/share/14JjQReswYv/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-blue-500" />
            </a>
            <a href="https://www.instagram.com/sapna_shri_jewllers/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-500" />
            </a>
            <a href="https://www.youtube.com/@SapnaShriJewellers-b1f/shorts" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-red-500" />
            </a>
            <a target="_blank"
              onClick={() => window.open(whatsappUrl, "_blank")}
              rel="noopener noreferrer">
              <FaWhatsapp className="hover:text-green-500" />
            </a>
            <a href="/#/tv" target="_blank" rel="noopener noreferrer">
              <FaTv className="hover:text-yellow-400 hover:scale-110 transform transition duration-200" />
            </a>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4">&copy; {new Date().getFullYear()} Sapna Shri Jewellers. All rights reserved.</p>
      </div>
    </footer>
  );
}
