import Image from "next/image"
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import TestimonialScroller from "@/components/common/Testimonials";
import popularSearches from "@/data/popularSearches";
import {promises, services, certificates, faqs} from "@/data/aboutUs.json";

const title = `Sapna Shri Jewellers Nagda | सपना श्री ज्वेलर्स नागदा`;
const description = `Sapna Shri Jewellers Nagda - सोने और चांदी के आभूषणों में 35+ वर्षों का अनुभव। BIS 916 हॉलमार्क गोल्ड, सर्टिफाइड डायमंड और पारदर्शी सेवा।`;
const baseURL = process.env.BASE_URL;
const imageUrl = `${baseURL}/static/img/shop.png`;

export async function generateMetadata() {
  return {
    title,
    description,    
    openGraph: {
      title,
      description,
      url: `${baseURL}/about-us`,
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseURL}/about-us`,
    },
  };

}

export default function AboutUsPage() {
  const years = 35;
  const customers = 5000;

  

  return (
    <div className="container mx-auto">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About Us" }]} />

      {/* ===== Heading ===== */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl text-primary mb-4">
          सपना श्री ज्वेलर्स
        </h1>
        <p className="text-lg md:text-xl">
          सपना श्री ज्वेलर्स पिछले{" "}
          <span className="text-primary-dark ">{years}+</span> वर्षों से विश्वास का प्रतीक रहा है,{" "}
          और{" "}
          <span className="text-primary-dark ">{customers}+</span> खुश ग्राहकों का परिवार बन चुका है।
        </p>
      </div>

      {/* ===== Description ===== */}
      <div className="max-w-5xl mx-auto text-justify space-y-4">
        <p>
          सपना श्री ज्वेलर्स पिछले 35 वर्षों से सोने और चांदी के गहनों के क्षेत्र में अपनी उत्कृष्ट कला, भरोसेमंद सेवा और उच्च गुणवत्ता के लिए जाना जाता है। हमारी पहचान है — <span className="text-primary-dark">ख़ूबसूरती, विश्वसनीयता और पारदर्शिता।</span>
        </p>

        <p className="flex gap-2">
          🎁 यहाँ आपको मिलेंगे –
        </p>
        <p>
          ✨ शुद्ध 22 कैरेट सोने के गहने <br />
          ✨ आकर्षक चांदी के आभूषण <br />
          ✨ मनपसंद कस्टम डिज़ाइन – आपकी पसंद के अनुसार बनाए गए <br />
          ✨ धार्मिक और पारंपरिक डिज़ाइन में आधुनिकता का संगम <br />
          💠 सपना श्री ज्वेलर्स – जहां हर गहना एक कहानी कहता है। 💠
        </p>
        <p>
          श्री <span className="text-primary-dark">भवरलाल गांग</span> द्वारा स्थापित यह व्यवसाय अब
          <span className="text-primary-dark"> अमीश कुमार गांग</span> के नेतृत्व में 35+ वर्षों की गौरवशाली विरासत रखता है।
        </p>
      </div>

      {/* ===== Owners ===== */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
        {[
          { img: "/img/blgang.png", name: "श्री भवरलाल गांग", title: "संस्थापक" },
          { img: "/img/amish.png", name: "अमीश कुमार गांग", title: "स्वामी / उत्तराधिकारी" },
        ].map((owner) => (
          <div key={owner.name} className="text-center">
            <Image
              src={`${process.env.BASE_URL}/static/${owner.img}`}
              alt={owner.name}
              className="rounded-2xl shadow-lg h-64 object-cover mx-auto border-2 border-theme"
              width="300"
              height="300"
            />
            <h3 className="mt-3 text-xl text-primary-dark">{owner.name}</h3>
            <p>{owner.title}</p>
          </div>
        ))}
      </div>
      {/* ===== Shop Photo ===== */}
      <div className="text-center mt-12">
        <Image
          src={`${process.env.BASE_URL}/static/img/shop.png`}
          alt="Sapna Shri Jewellers Shop - Nagda"
          className="rounded-3xl shadow-2xl mx-auto border-4 border-yellow-500 w-full max-w-3xl"
          width="300"
          height="300"
        />
      </div>

      {/* ===== MAP ===== */}
      <div className="mt-12">
        <h2 className="au-h2">हमसे संपर्क करें</h2>
        {/* Store Location */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto text-primary">
          {/* Hindi Address */}
          <address className="bg-accent border border-theme rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold">
              📌 सपना श्री ज्वैलर्स,
            </h3>
            रेलवे स्टेशन मेन रोड, जैन मंदिर के पास,<br />
            नागदा जंक्शन, जिला उज्जैन<br />
            📞 8234042231
          </address>
          {/* English Address */}
          <address className="bg-accent border border-theme rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold">
              📌 Sapna Shri Jewellers,
            </h2>
            Near Railway Station, M G Road,<br />
            Nagda Junction, District: Ujjain<br />
            📞 8234042231
          </address>
        </div>
        <div className="m-6 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-theme shadow-lg">
          <iframe
            title="Sapna Shri Jewellers Map"
            src="https://www.google.com/maps?q=सपना+श्री+ज्वैलर्स,+रेलवे+स्टेशन+मेन+रोड,+जैन+मंदिर+के+पास+नागदा,+जिला+उज्जैन&output=embed"
            width="100%"
            height="400"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* ===== Promises ===== */}
      <div className="mt-12 text-center ">
        <h2 className="au-h2">हमारे वादे (Store Promises)</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {promises.map((p) => (
            <div key={p.title} className="bg-accent border border-theme rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="text-xl   mb-2">{p.title}</h3>
              <p className="text-sm ">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Services ===== */}
      <div className="mt-12 text-center">
        <h2 className="au-h2">सेवाएँ उपलब्ध हैं</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((srv) => (
            <div key={srv.title} className="bg-accent p-6 rounded-2xl border border-theme shadow-md">
              <h3 className="text-xl  mb-3">{srv.title}</h3>
              <p className="leading-relaxed ">{srv.text}</p>
            </div>
          ))}
        </div>
      </div>


      {/* ===== CERTIFICATES ===== */}
      <div className="mt-12 text-center">
        <h2 className="au-h2">सोने (HUID) का प्रमाणपत्र जाँच</h2>
        {certificates.map((cert, i) => (
          <div key={i} className="mb-10">
            <p className="mt-4 font-medium leading-relaxed">{cert.text}</p>
          </div>
        ))}
      </div>
      {/* ===== Testimonials ===== */}
      <TestimonialScroller/>

      {/* ===== Popular Searches ===== */}
      <div className="mt-12 text-center">
        <h2 className="au-h2">लोकप्रिय खोजें</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {popularSearches.map((item) => (
            <a
              key={item.search}
              href={`/search/?q=${(item.search)}`}
              className="px-4 py-2 bg-surface border border-theme rounded-full"
            >
              {item.search}
            </a>
          ))}
        </div>
      </div>

      {/* ===== FAQs (Static Expanded) ===== */}
      <div className="mt-12">
        <h2 className="au-h2">अक्सर पूछे जाने वाले प्रश्न (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="border border-theme rounded-2xl bg-surface shadow-md p-5">
              <strong>{f.q}</strong>
              <p className="mt-2 text-sm">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          })
        }}
      />
    </div>
  );
}
