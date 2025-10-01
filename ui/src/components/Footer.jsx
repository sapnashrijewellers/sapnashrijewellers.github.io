import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-12">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* About Us */}
        <div>
          <p className="italic text-xs ">
            “कीमतें बाजार दर के अनुसार बदलती रहती हैं। कृपया अंतिम कीमत और उत्पाद का अनुभव करने के लिए दुकान पर अवश्य आएँ। दी गई कीमतें केवल संकेतात्मक हैं।”

          </p>
          <br/>
          <h2 className="font-bold text-lg">हमारी पहचान</h2>
          <p className="text-gray-300">
            सपना श्री ज्वैलर्स एक बहुमुखी सोने के आभूषण निर्माता और रिटेलर है। हमारे सभी उत्पादों के साथ गारंटी दी जाती है — नेकलेस और हारम के लिए 1 वर्ष और अन्य दैनिक पहनने वाले उत्पादों के लिए 6 महीने।

35 वर्षों से अधिक के अनुभव के साथ, हम सभी प्रकार के गोल्ड प्लेटेड ज्वैलरी उत्पादों का व्यापार करते हैं, जिनमें शामिल हैं: चेन, नेकलेस, हारम, चूड़ियाँ, मंगलसूत्र, अंगूठियाँ, शुभ धागे, थाली डिज़ाइन, पेंडेंट सेट, हिप चेन, झुमके, कान की बाली, कंगन, सोने और चाँदी की पायल।


          </p>

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
          <div className="flex gap-4 mt-2 text-gray-300">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-blue-500" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-500" />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-red-500" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-blue-400" />
            </a>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4">&copy; {new Date().getFullYear()} Sapna Shri Jewellers. All rights reserved.</p>
      </div>
    </footer>
  );
}
