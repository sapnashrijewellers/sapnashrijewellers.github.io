import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import JsonLd from "@/components/common/JsonLd";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const imageUrl = `${baseURL}/icons/icon-512x512.png`;

export const metadata: Metadata = {
  title: "HUID Hallmarking Info - Sapna Shri Jewellers Nagda",
  description:
    "जानें HUID हॉलमार्किंग का महत्व। BIS 916 प्रमाणित सोने और चांदी के आभूषण खरीदते समय HUID क्यों ज़रूरी है।",
  openGraph: {
    title: "HUID Hallmarking Info - Sapna Shri Jewellers Nagda",
    description:
      "BIS प्रमाणित HUID हॉलमार्किंग का महत्व जानें। असली और सुरक्षित निवेश के लिए जरूरी जानकारी।",
    url: `${baseURL}/huid`,
    images: [
      {
        url: imageUrl,
        width: 512,
        height: 512,
        alt: "Sapna Shri Jewellers Hallmark Verification",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: `${baseURL}/huid`,
  },
};

export default function HUIDInfo() {
  const faqs = [
    {
      q: "HUID हॉलमार्क क्या है?",
      a: "HUID (Hallmark Unique Identification) एक 6-अंकों का अल्फ़ान्यूमेरिक विशेष कोड है जो हर सोने या चांदी के आभूषण पर अंकित होता है।",
    },
    {
      q: "HUID क्यों जरूरी है?",
      a: "HUID यह सुनिश्चित करता है कि आपका आभूषण BIS द्वारा प्रमाणित और असली है, जिससे नकली या मिलावटी ज्वेलरी से पूरी सुरक्षा मिलती है।",
    },
    {
      q: "क्या सभी सोने के गहनों पर HUID होता है?",
      a: "2 ग्राम से अधिक वज़न वाले सभी सोने के गहनों पर HUID अनिवार्य है। 2 ग्राम से कम वज़न पर नियमानुसार छूट प्राप्त है।",
    },
    {
      q: "HUID को कैसे चेक करें?",
      a: "आप BIS Care App या BIS की आधिकारिक वेबसाइट पर 6-अंकों का HUID नंबर दर्ज कर ज्वेलरी की शुद्धता और केंद्र का विवरण सत्यापित कर सकते हैं।",
    },
    {
      q: "क्या HUID केवल सोने के लिए है?",
      a: "नहीं, HUID प्रमाणित चांदी के आभूषणों पर भी अंकित किया जाता है।",
    },
    {
      q: "HUID देखकर क्या फायदा होता है?",
      a: "HUID से खरीदार को पूरी पारदर्शिता और शुद्धता का भरोसा मिलता है और रीसेल के समय उचित मूल्य सुनिश्चित होता है।",
    },
  ];

  const ldjson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseURL}/huid/#webpage`,
        url: `${baseURL}/huid`,
        name: metadata.title,
        description: metadata.description,
        publisher: {
          "@type": "JewelryStore",
          name: "Sapna Shri Jewellers Nagda",
          url: baseURL,
          logo: imageUrl,
          image: imageUrl,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Railway Station Main Road, Near Jain Mandir",
            addressLocality: "Nagda",
            addressRegion: "Madhya Pradesh",
            postalCode: "456335",
            addressCountry: "IN",
          },
          telephone: "+91-8234042231",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <article className="container mx-auto px-4 py-6 max-w-4xl">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Hallmark", href: "/huid" },
        ]}
      />

      {/* Structured Data */}
      <JsonLd json={ldjson} />

      {/* Page Header */}
      <header className="flex items-center gap-3 my-6 pb-2 border-b border-theme/40">
        <span className="text-3xl text-accent" aria-hidden="true">
          ℹ️
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
          HUID हॉलमार्किंग क्यों ज़रूरी है?
        </h1>
      </header>

      {/* Main Content Section */}
      <section aria-labelledby="overview-heading" className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
        <h2 id="overview-heading" className="sr-only">
          HUID हॉलमार्क विवरण
        </h2>
        <p>
          <strong className="text-foreground">HUID (Hallmark Unique Identification)</strong> एक{" "}
          <strong className="text-foreground">विशेष 6-अंकों का अल्फ़ान्यूमेरिक कोड</strong> होता है, जो प्रत्येक सोने और चांदी के
          आभूषण पर लेज़र द्वारा अंकित किया जाता है। यह कोड प्रमाणित करता है कि आपका आभूषण{" "}
          <strong className="text-primary-dark">BIS (भारतीय मानक ब्यूरो)</strong> के शुद्धता मानकों के अनुरूप प्रमाणित है।
        </p>

        <ul className="list-disc pl-6 space-y-2 pt-2">
          <li>
            हर आभूषण का विशिष्ट <strong>HUID नंबर</strong> होता है — जो ज्वेलरी की व्यक्तिगत पहचान सुनिश्चित करता है।
          </li>
          <li>
            यह डेटा सीधे BIS के केंद्रीय डेटाबेस में सुरक्षित रहता है, जिससे मिलावट या अमान्य हॉलमार्किंग की गुंजाइश खत्म हो जाती है।
          </li>
          <li>
            HUID से खरीदार को पूरी <strong>पारदर्शिता</strong> और <strong>शुद्धता की गारंटी</strong> मिलती है।
          </li>
          <li>
            2 ग्राम से अधिक वज़न वाले सभी सोने के आभूषणों के लिए <strong>हॉलमार्किंग अनिवार्य</strong> है।
          </li>
          <li>
            चांदी के आभूषणों के लिए हॉलमार्किंग स्वैच्छिक है, परंतु प्रामाणिकता के लिए अनुशंसित है।
          </li>
        </ul>

        <p className="font-medium text-foreground pt-4 bg-accent/10 p-4 rounded-xl border border-accent/20">
          अगली बार जब भी आप सोने या चांदी के गहने खरीदें, तो{" "}
          <strong className="text-primary-dark">HUID 6-डिजिट कोड</strong> और{" "}
          <strong className="text-primary-dark">BIS Logo</strong> अवश्य देखें — यही असली और सुरक्षित निवेश का आधार है।
        </p>
      </section>

      {/* Visual Identification / Example */}
      <section aria-labelledby="visual-guide-heading" className="mt-10">        
          <h2 id="visual-guide-heading" className="text-xl font-bold text-accent mb-4">
            हॉलमार्क कहाँ और कैसे देखें:
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <figure className="text-center w-full max-w-md">
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl shadow-sm border border-theme/60 bg-surface">
                <Image
                  src={`${baseURL}/static/img/hallmark-sample1.webp`}
                  alt="सोने की चूड़ी पर 6-डिजिट HUID और BIS हॉलमार्क का उदाहरण"
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-sm font-medium text-muted-foreground">
                सोने के आभूषण पर HUID और BIS मार्क की प्रामाणिक स्थिति
              </figcaption>
            </figure>
          </div>      
      </section>

      {/* FAQ Section */}
      <section aria-labelledby="faq-heading" className="mt-12">
        <h2 id="faq-heading" className="text-2xl font-bold text-primary mb-6">
          अक्सर पूछे जाने वाले प्रश्न (FAQ)
        </h2>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group border border-theme rounded-xl bg-surface p-4 shadow-sm transition-all open:ring-1 open:ring-primary/20"
            >
              <summary className="font-semibold text-base md:text-lg cursor-pointer select-none flex items-center justify-between text-primary list-none">
                <span>{item.q}</span>
                <span
                  className="text-xs text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed pl-1">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}