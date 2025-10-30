import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function AboutUs() {
  const [years, setYears] = useState(0);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    let y = 0, c = 0;
    const yInterval = setInterval(() => {
      if (y < 35) {
        y++;
        setYears(y);
      } else clearInterval(yInterval);
    }, 60);

    const cInterval = setInterval(() => {
      if (c < 5000) {
        c += 50;
        setCustomers(c);
      } else clearInterval(cInterval);
    }, 10);

    return () => {
      clearInterval(yInterval);
      clearInterval(cInterval);
    };
  }, []);

  return (
    <div className="text-white bg-black py-10 px-6 md:px-20 leading-relaxed">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Sapna Shri Jewellers - Trusted Gold Jewellery Store in Nagda</title>
        <meta
          name="description"
          content="Sapna Shri Jewellers - 35+ years of trust in gold and silver jewellery in Nagda. Discover purity, craftsmanship, and tradition."
        />
        <meta
          name="keywords"
          content="Gold Jewellery in Nagda, Best Jewellery Store in Nagda, 22 Carat Gold Jewellery, Silver Jewellery Nagda, Sapna Shri Jewellers"
        />
      </Helmet>

      {/* Heading Section */}
      <div className="text-center mb-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          हमारी पहचान
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-300">
          सपना श्री ज्वेलर्स पिछले <span className="text-yellow-400 font-semibold">{years}+</span> वर्षों से विश्वास का प्रतीक रहा है, 
          और <span className="text-yellow-400 font-semibold">{customers}+</span> खुश ग्राहकों का परिवार बन चुका है।
        </p>
      </div>

      {/* Main Description */}
      <motion.div
        className="max-w-5xl mx-auto text-gray-300 text-justify space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>
          सपना श्री ज्वेलर्स पिछले 35 वर्षों से सोने और चांदी के गहनों के क्षेत्र में अपनी उत्कृष्ट कला, भरोसेमंद सेवा 
          और उच्च गुणवत्ता के लिए जाना जाता है। हमारी पहचान है — <span className="text-yellow-400">ख़ूबसूरती, विश्वसनीयता और पारदर्शिता।</span>
        </p>
        <p>
          यहाँ आपको मिलेंगे – ✨ शुद्ध 22 कैरेट सोने के गहने ✨ आकर्षक चांदी के आभूषण ✨ 
          मनपसंद कस्टम डिज़ाइन – आपकी पसंद के अनुसार बनाए गए ✨ धार्मिक और पारंपरिक डिज़ाइन में आधुनिकता का संगम।
        </p>
        <p>
          💠 सपना श्री ज्वेलर्स – जहां हर गहना एक कहानी कहता है। 💠
        </p>
        <p>
          सपना श्री ज्वेलर्स नागदा की सांस्कृतिक धरोहर से प्रेरित एक अद्वितीय संग्रह प्रस्तुत करता है। 
          यह केवल एक आभूषण की दुकान नहीं, बल्कि कला, परंपरा और आधुनिकता का संगम है।
        </p>
        <p>
          श्री <span className="text-yellow-400">भवरलाल गांग</span> द्वारा स्थापित यह व्यवसाय अब 
          <span className="text-yellow-400"> अमीश कुमार गांग</span> के नेतृत्व में 35+ वर्षों की गौरवशाली विरासत रखता है। 
          हमारी प्राथमिकता है — उत्कृष्ट सेवा, पारदर्शिता और ग्राहक संतुष्टि।
        </p>
      </motion.div>

      {/* Owners Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <img
            src="/img/blgang.png"
            alt="Mr. Bhavar Lal Gang - Founder"
            className="rounded-2xl shadow-lg w-64 h-64 object-cover mx-auto border-2 border-yellow-500"
          />
          <h3 className="mt-3 text-xl font-semibold text-yellow-400">
            श्री भवरलाल गांग
          </h3>
          <p className="text-sm text-gray-400">संस्थापक</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <img
            src="/img/amish.png"
            alt="Mr. Amish Kumar Gang - Owner"
            className="rounded-2xl shadow-lg w-64 h-64 object-cover mx-auto border-2 border-yellow-500"
          />
          <h3 className="mt-3 text-xl font-semibold text-yellow-400">
            अमीश कुमार गांग
          </h3>
          <p className="text-sm text-gray-400">स्वामी / उत्तराधिकारी</p>
        </motion.div>
      </div>

      {/* Shop Photo */}
      <div className="text-center mt-12">
        <motion.img
          src="/img/shop.png"
          alt="Sapna Shri Jewellers Shop - Nagda"
          className="rounded-3xl shadow-2xl mx-auto border-4 border-yellow-500 w-full max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />
      </div>

      {/* Google Map */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">हमसे संपर्क करें</h2>
        <p className="text-gray-300 mb-4">
          सपना श्री ज्वैलर्स, रेलवे स्टेशन मेन रोड, जैन मंदिर के पास नागदा, जिला उज्जैन
        </p>
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-lg">
          <iframe
            title="Sapna Shri Jewellers Map"
            src="https://www.google.com/maps?q=सपना+श्री+ज्वैलर्स,+रेलवे+स्टेशन+मेन+रोड,+जैन+मंदिर+के+पास+नागदा,+जिला+उज्जैन&output=embed"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
