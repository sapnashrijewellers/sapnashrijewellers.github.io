import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import TestimonialScroller from "@/components/common/Testimonials";
import { promises, services, certificates, faqs } from "@/data/aboutUs.json";

const title = "Sapna Shri Jewellers Nagda | सपना श्री ज्वेलर्स नागदा";
const description =
  "Sapna Shri Jewellers Nagda - सोने और चांदी के आभूषणों में 35+ वर्षों का अनुभव। BIS 916 हॉलमार्क गोल्ड, सर्टिफाइड डायमंड और पारदर्शी सेवा।";
const baseURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL ;
const imageUrl = `${baseURL}shop.webp`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${baseURL}/about-us/`,
    type: "website",
    images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
  alternates: {
    canonical: `${baseURL}/about-us/`,
  },
};

export default function AboutUsPage() {
  const years = 35;
  const customers = 5000;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JewelryStore",
        "@id": `${baseURL}/#store`,
        name: "Sapna Shri Jewellers",
        alternateName: "सपना श्री ज्वेलर्स",
        url: `${baseURL}/about-us/`,
        image: imageUrl,
        logo: `${baseURL}/logo-wide.png`,
        description,
        telephone: "+91-8234042231",
        priceRange: "₹₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near Railway Station, M G Road",
          addressLocality: "Nagda Junction",
          addressRegion: "Madhya Pradesh",
          postalCode: "456335",
          addressCountry: "IN",
        },
        founder: [
          {
            "@type": "Person",
            name: "Bhawarlal Gang",
            alternateName: "श्री भवरलाल गांग",
          },
        ],
        employee: [
          {
            "@type": "Person",
            name: "Amish Kumar Gang",
            alternateName: "अमीश कुमार गांग",
            jobTitle: "Owner",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <article className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About Us" }]} />

      {/* ===== Header / Hero ===== */}
      <header className="text-center my-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
          सपना श्री ज्वेलर्स नागदा
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          सपना श्री ज्वेलर्स पिछले{" "}
          <strong className="font-semibold">{years}+</strong> वर्षों से विश्वास का प्रतीक रहा है, और{" "}
          <strong className="font-semibold">{customers}+</strong> खुश ग्राहकों का परिवार बन चुका है।
        </p>
      </header>

      {/* ===== Brand Story & Overview ===== */}
      <section aria-labelledby="story-heading" className="max-w-4xl mx-auto space-y-6 text-base md:text-lg leading-relaxed text-justify">
        <h2 id="story-heading" className="sr-only">
          हमारी विरासत और विशेषताएँ
        </h2>

        <p>
          सपना श्री ज्वेलर्स पिछले 35 वर्षों से सोने और चांदी के गहनों के क्षेत्र में अपनी उत्कृष्ट कला, भरोसेमंद सेवा और उच्च गुणवत्ता के लिए जाना जाता है। हमारी पहचान है —{" "}
          <strong className="font-medium">ख़ूबसूरती, विश्वसनीयता और पारदर्शिता।</strong>
        </p>

        <div className="bg-surface border border-theme rounded-2xl p-6 shadow-sm space-y-3">
          <p className="font-semibold">यहाँ आपको मिलेंगे:</p>
          <ul className="space-y-2 list-none pl-1">
            <li className="flex items-center gap-2">
              <span aria-hidden="true">✨</span> शुद्ध 22 कैरेट सोने के गहने (BIS 916 Hallmark)
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">✨</span> आकर्षक एवं प्रामाणिक चांदी के आभूषण
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">✨</span> मनपसंद कस्टम डिज़ाइन – आपकी पसंद अनुसार
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">✨</span> धार्मिक और पारंपरिक डिज़ाइन में आधुनिकता का संगम
            </li>
          </ul>
          <p className="pt-2 font-medium italic text-center">
            💠 सपना श्री ज्वेलर्स – जहां हर गहना एक कहानी कहता है। 💠
          </p>
        </div>

        <p>
          श्री <strong className="font-semibold">भवरलाल गांग</strong> द्वारा स्थापित यह व्यवसाय अब{" "}
          <strong className="font-semibold">अमीश कुमार गांग</strong> के नेतृत्व में 35+ वर्षों की गौरवशाली विरासत को आगे बढ़ा रहा है।
        </p>
      </section>

      {/* ===== Founders / Leadership ===== */}
      <section aria-labelledby="leadership-heading" className="mt-16">
        <h2 id="leadership-heading" className="text-2xl md:text-3xl font-bold text-center mb-8">
          संस्थापक एवं नेतृत्व
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[
            { img: "blgang.webp", name: "श्री भवरलाल गांग", title: "संस्थापक" },
            { img: "amish.webp", name: "अमीश कुमार गांग", title: "स्वामी / उत्तराधिकारी" },
          ].map((owner) => (
            <div key={owner.name} className="text-center">
              <div className="relative w-48 h-64 mx-auto mb-3">
                <Image
                  src={`${baseURL}${owner.img}`}
                  alt={`${owner.name} - ${owner.title}`}
                  fill
                  title={`${owner.name} - ${owner.title}`}
                  sizes="(max-width: 640px) 192px, 192px"
                  className="rounded-2xl shadow-md object-cover border-2 border-theme"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold">{owner.name}</h3>
              <p className="text-muted-foreground">{owner.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Shop Showcase Image ===== */}
      <section aria-labelledby="storefront-heading" className="mt-16 text-center">
        <h2 id="storefront-heading" className="sr-only">
          हमारा स्टोर
        </h2>
        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] overflow-hidden rounded-3xl shadow-xl border-4 border-yellow-500/80">
          <Image
            src={imageUrl}
            alt="Sapna Shri Jewellers Flagship Store in Nagda Junction"
            title="Sapna Shri Jewellers Flagship Store in Nagda Junction"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </section>

      {/* ===== Contact & Map ===== */}
      <section aria-labelledby="contact-heading" className="mt-16">
        <h2 id="contact-heading" className="text-2xl md:text-3xl font-bold text-center mb-8">
          हमसे संपर्क करें (Store Location)
        </h2>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 max-w-4xl mx-auto">
          {/* Hindi Address */}
          <address className="not-italic bg-accent border border-theme rounded-2xl p-6 shadow-sm leading-relaxed">
            <h3 className="text-lg font-bold mb-2">📌 सपना श्री ज्वैलर्स</h3>
            <p>रेलवे स्टेशन मेन रोड, जैन मंदिर के पास,</p>
            <p>नागदा जंक्शन, जिला उज्जैन (म.प्र.)</p>
            <p className="mt-3 font-semibold">
              📞 फ़ोन:{" "}
              <a href="tel:+918234042231" className="hover:underline" aria-label="Call 8234042231" title="Call 8234042231">
                +91 8234042231
              </a>
            </p>
          </address>

          {/* English Address */}
          <address className="not-italic bg-accent border border-theme rounded-2xl p-6 shadow-sm leading-relaxed">
            <h3 className="text-lg font-bold mb-2">📌 Sapna Shri Jewellers</h3>
            <p>Near Railway Station, M G Road,</p>
            <p>Nagda Junction, District: Ujjain (M.P.)</p>
            <p className="mt-3 font-semibold">
              📞 Phone:{" "}
              <a href="tel:+918234042231" className="hover:underline" aria-label="Call 8234042231" title="Call 8234042231">
                +91 8234042231
              </a>
            </p>
          </address>
        </div>

        <div className="mt-8 max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-theme shadow-md">
          <iframe
            title="Sapna Shri Jewellers Google Maps Store Location"
            src="https://www.google.com/maps?q=सपना+श्री+ज्वैलर्स,+रेलवे+स्टेशन+मेन+रोड,+जैन+मंदिर+के+पास+नागदा,+जिला+उज्जैन&output=embed"
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ===== Promises ===== */}
      <section aria-labelledby="promises-heading" className="mt-16 text-center">
        <h2 id="promises-heading" className="text-2xl md:text-3xl font-bold mb-8">
          हमारे वादे (Store Promises)
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {promises.map((p) => (
            <div key={p.title} className="bg-accent border border-theme rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <div className="text-4xl mb-3" aria-hidden="true">{p.icon}</div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Services ===== */}
      <section aria-labelledby="services-heading" className="mt-16 text-center">
        <h2 id="services-heading" className="text-2xl md:text-3xl font-bold mb-8">
          सेवाएँ उपलब्ध हैं (Our Services)
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((srv) => (
            <div key={srv.title} className="bg-accent p-6 rounded-2xl border border-theme shadow-sm text-left">
              <h3 className="text-xl font-bold mb-2">{srv.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{srv.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Certification / HUID ===== */}
      <section aria-labelledby="cert-heading" className="mt-16 text-center max-w-3xl mx-auto">
        <h2 id="cert-heading" className="text-2xl md:text-3xl font-bold mb-4">
          सोने (HUID) का प्रमाणपत्र जाँच
        </h2>
        {certificates.map((cert, i) => (
          <p key={i} className="text-base md:text-lg font-medium leading-relaxed text-muted-foreground">
            {cert.text}
          </p>
        ))}
      </section>

      {/* ===== Testimonials ===== */}
      <div className="mt-16">
        <TestimonialScroller />
      </div>     

      {/* ===== FAQs ===== */}
      <section aria-labelledby="faq-heading" className="mt-16 max-w-4xl mx-auto">
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-center mb-8">
          अक्सर पूछे जाने वाले प्रश्न (FAQ)
        </h2>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <details
              key={f.q}
              open={idx === 0}
              className="group border border-theme rounded-2xl bg-surface shadow-sm p-5 transition-all open:ring-1 open:ring-primary/20"
            >
              <summary className="font-semibold text-lg cursor-pointer select-none flex items-center justify-between list-none">
                <span>{f.q}</span>
                <span className="text-sm font-normal text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed pl-1">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}