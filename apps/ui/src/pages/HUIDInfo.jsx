import React, { useState } from "react";
import { renderSEOTags } from "../utils/SEO";

export default function HUIDInfo() {
  const title = "HUID Hallmarking Info - Sapna Shri Jewellers Nagda";
  const description = "जानें HUID हॉलमार्किंग का महत्व। BIS 916 प्रमाणित सोने और चांदी के आभूषण खरीदते समय HUID क्यों ज़रूरी है।";
  const keywords = "HUID, BIS Hallmark, Gold Jewellery Nagda, Silver Jewellery Nagda, Sapna Shri Jewellers, Hallmark Unique ID";
  const baseURL = "https://sapnashrijewellers.github.io";
  const imageUrl = `${baseURL}/logo.png`;


  const ldjson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${baseURL}/huid`,
    description,
    publisher: {
      "@type": "JewelryStore",
      name: "Sapna Shri Jewellers Nagda",
      image: `${baseURL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Railway Station Main Road, Near Jain Mandir",
        addressLocality: "Nagda",
        addressRegion: "Ujjain",
        postalCode: "456335",
        addressCountry: "IN",
      },
      telephone: "+91-8234042231",
    },
  };

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "HUID हॉलमार्क क्या है?",
      a: "HUID (Hallmark Unique Identification) एक 6-अंकों का विशेष कोड है जो हर सोने या चांदी के आभूषण पर अंकित होता है।"
    },
    {
      q: "HUID क्यों जरूरी है?",
      a: "HUID यह सुनिश्चित करता है कि आपका आभूषण BIS द्वारा प्रमाणित और असली है, जिससे नकली या मिलावटी ज्वेलरी से सुरक्षा मिलती है।"
    },
    {
      q: "क्या सभी सोने के गहनों पर HUID होता है?",
      a: "2 ग्राम से अधिक वज़न वाले सभी सोने के गहनों पर HUID अनिवार्य है। 2 ग्राम से कम पर छूट मिल सकती है।"
    },
    {
      q: "HUID को कैसे चेक करें?",
      a: "आप HUID नंबर को BIS की वेबसाइट पर दर्ज कर ज्वेलरी की प्रमाणिकता सत्यापित कर सकते हैं।"
    },
    {
      q: "क्या HUID केवल सोने के लिए है?",
      a: "नहीं, HUID चांदी के प्रमाणित आभूषणों पर भी अंकित किया जाता है।"
    },
    {
      q: "HUID देखकर क्या फायदा होता है?",
      a: "HUID से खरीदार को पूरी पारदर्शिता और भरोसा मिलता है। यह नकली ज्वेलरी के जोखिम को कम करता है।"
    }
  ];
  return (
    <>
      {renderSEOTags(
        title,
        description,
        imageUrl,
        `${baseURL}`,
        keywords,
        ldjson
      )}
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-accent">ℹ️</span>
          <h2 className="text-2xl font-bold text-accent-foreground">
            HUID हॉलमार्किंग क्यों ज़रूरी है?
          </h2>
        </div>

        {/* Description */}
        <p className="leading-relaxed mb-4 text-muted-foreground">
          <strong>HUID (Hallmark Unique Identification)</strong> एक{" "}
          <strong>विशेष 6-अंकों का कोड</strong> होता है, जो हर सोने या चांदी के
          आभूषण पर अंकित किया जाता है। यह कोड यह सुनिश्चित करता है कि आपका
          आभूषण <strong>BIS (भारतीय मानक ब्यूरो)</strong> द्वारा प्रमाणित और असली
          है।
        </p>

        {/* Benefits */}
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
          <li>
            हर ज्वेलरी का अलग <strong>HUID नंबर</strong> होता है — जैसे आपकी पहचान का
            आधार नंबर।
          </li>
          <li>
            यह BIS डेटाबेस में दर्ज रहता है, जिससे नकली या मिलावटी ज्वेलरी का खतरा
            कम होता है।
          </li>
          <li>
            HUID से खरीदार को पूरी <strong>पारदर्शिता</strong> और
            <strong> भरोसा</strong> मिलता है।
          </li>
          <li>
            2 ग्राम से ज़्यादा वज़न वाले सभी सोने के गहनों की
            <strong> हॉलमार्किंग अनिवार्य</strong> है।
          </li>
          <li>
            2 ग्राम से कम वज़न वाले सोने के गहनों को हॉलमार्किंग से{" "}
            <strong>छूट</strong> है।
          </li>
        </ul>

        {/* Reminder */}
        <p className="font-medium text-foreground mb-6">
          अगली बार जब आप सोना या चांदी खरीदें, तो{" "}
          <strong className="text-accent">HUID हॉलमार्क</strong> ज़रूर देखें —
          यही <strong>असली और सुरक्षित निवेश</strong> की पहचान है।
        </p>

        {/* Example Section */}
        <div className="bg-muted border border-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-accent mb-3">
            हॉलमार्क कहाँ देखें:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <figure className="text-center">
              <img
                src="/img/hallmark-sample1.png"
                alt="सोने की चूड़ी पर हॉलमार्क स्थान"
                className="rounded-xl shadow-sm mx-auto transition-transform duration-300 hover:scale-105"
              />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                सोने की चूड़ी पर HUID और BIS मार्क स्थान
              </figcaption>
            </figure>
          </div>
        </div>
       <h2 className="text-2xl font-bold mb-6 text-accent mt-6">अक्सर पूछे जाने वाले प्रश्न (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-theme rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-4 py-3 bg-accent/10 hover:bg-accent/20 transition font-medium"
              >
                {item.q}
              </button>
              <div
                className={`px-4 py-3 transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>      
    </>
  );
}
