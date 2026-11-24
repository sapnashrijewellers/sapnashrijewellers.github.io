import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { Product, Collection } from '@/types/catalog';
import products from '@/data/products.json';
import collections from '@/data/collections.json';

import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import JsonLd from '@/components/common/JsonLd';

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');

const pageURL = `${baseURL}/huid/`;
const imageURL = `${baseURL}/static/img/products/optimized/`;

const title = 'HUID Number Kya Hota Hai? Gold Hallmark & HUID Guide';

const description =
  'HUID number kya hota hai? Gold jewellery mein HUID hallmark ka meaning, full form, 6-character code, location aur BIS CARE app se verification kaise karein.';

// --------------------------------------------------
// METADATA
// --------------------------------------------------

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageURL,
  },
  openGraph: {
    type: 'article',
    url: pageURL,
    title,
    description,
    siteName: 'Sapna Shri Jewellers',
    images: [
      {
        url: `${baseURL}/logo.png`,
        width: 512,
        height: 512,
        alt: 'Gold Jewellery HUID Hallmark Guide - Sapna Shri Jewellers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${baseURL}/logo.png`],
  },
};

// --------------------------------------------------
// GOLD COLLECTIONS
// Only these two collections are promoted.
// --------------------------------------------------

const goldSections = [
  {
    id: 22,
    name: 'Religious Gold Rings',
    heading: 'Religious Gold Rings',
    description:
      'Explore traditional religious gold rings featuring devotional designs. Discover gold rings inspired by Indian traditions, spirituality and meaningful occasions.',
  },
  {
    id: 29,
    name: 'Gold Nose Pin',
    heading: 'Gold Nose Pins',
    description:
      'Explore elegant gold nose pins with traditional and contemporary designs. Find everyday gold nose pin styles and jewellery for special occasions.',
  },
];

// --------------------------------------------------
// PRODUCT HELPERS
// --------------------------------------------------

function getCollection(id: number): Collection | undefined {
  return collections.find((c: Collection) => c.id === id && c.active);
}

function getFeaturedProduct(collectionName: string): Product | undefined {
  return products.find(
    (p: Product) => p.collection === collectionName && p.active && p.available && p.metal?.toLowerCase() === 'gold',
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// --------------------------------------------------
// FAQ CONTENT
// Use the same array for visible content and JSON-LD.
// --------------------------------------------------

const faqs = [
  {
    q: 'HUID number kya hota hai?',
    a: 'HUID ka full form Hallmark Unique Identification hai. Yeh ek unique 6-character alphanumeric code hota hai jo BIS hallmarked gold jewellery ke individual article ko identify karta hai. Is code ki help se customer BIS CARE app mein jewellery ke hallmark details verify kar sakta hai.',
  },
  {
    q: 'HUID hallmark kya hota hai?',
    a: 'HUID hallmark BIS hallmarking system ka ek important component hai. Ismein BIS logo, gold purity mark aur unique six-character HUID code hota hai. Yeh hallmarked gold jewellery ki identification aur traceability mein help karta hai.',
  },
  {
    q: 'HUID ka full form kya hai?',
    a: 'HUID ka full form Hallmark Unique Identification hai. Yeh code har individual hallmarked jewellery article ke liye unique hota hai.',
  },
  {
    q: 'HUID number kaisa hota hai?',
    a: 'HUID number 6-character alphanumeric code hota hai. Ismein English letters aur numbers ka combination ho sakta hai. Yeh sirf six numeric digits nahi hote.',
  },
  {
    q: 'Gold jewellery mein HUID number kaha hota hai?',
    a: 'Gold jewellery mein HUID code jewellery ke hallmark wale portion par laser marking ke through hota hai. Ring, nose pin, chain, bangle ya pendant ke design aur available marking space ke according iska exact location alag ho sakta hai. Magnifying glass ki help se hallmark check kar sakte hain.',
  },
  {
    q: 'Gold mein HUID kaise check karein?',
    a: 'Gold jewellery ka HUID verify karne ke liye official BIS CARE mobile app open karein. Verify HUID feature select karein aur jewellery par marked six-character HUID enter karein. App mein available hallmark aur purity details ko jewellery ke markings se compare karein.',
  },
  {
    q: 'Kya gold jewellery par HUID mandatory hai?',
    a: 'Government ke mandatory hallmarking order ke under notified districts mein covered gold jewellery aur artefacts ko BIS hallmark ke saath HUID marking ke saath sell karna hota hai. Kuch exemptions bhi hain, including articles weighing less than 2 grams, eligible jewellers and specified categories. Isliye har gold article par HUID compulsory hai, aisa kehna sahi nahi hoga.',
  },
  {
    q: '22K916, 18K750 aur 14K585 ka kya meaning hai?',
    a: 'Yeh gold purity aur fineness marks hain. 22K916 ka matlab 91.6% gold, 18K750 ka matlab 75% gold aur 14K585 ka matlab 58.5% gold content hai. Yeh marks jewellery ki declared gold purity identify karne mein help karte hain.',
  },
  {
    q: 'Kya HUID aur BIS hallmark same hain?',
    a: 'Nahi. HUID aur BIS hallmark same cheez nahi hain. BIS hallmark mein BIS Standard Mark, gold purity/fineness mark aur unique HUID code shamil hote hain. HUID is hallmark ka ek component hai.',
  },
  {
    q: 'Kya HUID number se gold jewellery ki price pata chalti hai?',
    a: 'Nahi. HUID number jewellery ki identification aur hallmark traceability ke liye hota hai. Isse jewellery ka current market price, making charges ya resale value directly pata nahi chalti.',
  },
  {
    q: 'Kya 24K gold jewellery par bhi HUID hota hai?',
    a: 'BIS hallmarking standards mein 24KS995 grade available hai. Gold jewellery aur artefacts ke applicable hallmarking rules ke according eligible hallmarked articles par BIS mark, purity mark aur HUID hota hai.',
  },
  {
    q: 'Kya gold nose pin par HUID hota hai?',
    a: 'Gold nose pin par HUID marking product ke applicable hallmarking requirements, weight, design aur exemptions par depend karti hai. Hallmarked nose pin par BIS hallmark components check karein aur available HUID ko BIS CARE app se verify karein.',
  },
];

// --------------------------------------------------
// STRUCTURED DATA
// --------------------------------------------------

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${pageURL}#webpage`,
      url: pageURL,
      name: title,
      description,
      inLanguage: 'en-IN',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseURL}/#website`,
        name: 'Sapna Shri Jewellers',
        url: `${baseURL}/`,
      },
      breadcrumb: {
        '@id': `${pageURL}#breadcrumb`,
      },
      mainEntity: {
        '@id': `${pageURL}#article`,
      },
    },
    {
      '@type': 'Article',
      '@id': `${pageURL}#article`,
      headline: 'HUID Number Kya Hota Hai? Gold Hallmark Explained',
      description,
      mainEntityOfPage: pageURL,
      author: {
        '@type': 'Organization',
        name: 'Sapna Shri Jewellers',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Sapna Shri Jewellers',
        url: `${baseURL}/`,
      },
      inLanguage: 'en-IN',
      about: ['Gold HUID', 'BIS Gold Hallmark', 'Gold Jewellery Purity'],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageURL}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseURL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Gold HUID Hallmark Guide',
          item: pageURL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageURL}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
};

// --------------------------------------------------
// GOLD PRODUCT CARD
// --------------------------------------------------

function GoldCollectionCard({ id, name, heading, description }: (typeof goldSections)[number]) {
  const collection = getCollection(id);

  if (!collection || collection.name !== name) {
    return null;
  }

  const product = getFeaturedProduct(name);

  if (!product) return null;

  const image = product.images?.[0];

  return (
    <article className="flex gap-4 border-b py-4 last:border-0 sm:gap-5">
      {image && (
        <Link
          href={`/c/${id}/`}
          className="bg-muted relative block aspect-square w-24 shrink-0 overflow-hidden rounded-md sm:w-32"
          aria-label={`Explore ${heading}`}
        >
          <Image
            src={`${imageURL}${image}`}
            alt={`${product.name} - Gold Jewellery`}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover"
          />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold">
          <Link href={`/c/${id}/`} className="hover:underline">
            {heading}
          </Link>
        </h3>

        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>

        <p className="mt-2 text-sm font-medium">{product.name}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>

          {product.MRP > product.price && (
            <span className="text-muted-foreground text-xs line-through">{formatPrice(product.MRP)}</span>
          )}
        </div>

        <Link href={`/c/${id}/`} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
          Explore Gold Collection →
        </Link>
      </div>
    </article>
  );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function HUIDInfo() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Gold HUID Hallmark Guide' }]} />

      <JsonLd json={jsonLd} />

      {/* PAGE HEADER */}
      <header className="border-accent my-6 border-l-4 pl-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          HUID Number Kya Hota Hai? Gold Jewellery Mein HUID Hallmark Samjhein
        </h1>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
          Gold jewellery purchase karte waqt HUID number aur BIS hallmark samajhna important hai. Lekin HUID number kya
          hota hai, yeh kaisa dikhta hai aur gold jewellery mein kaha hota hai? Is guide mein jaaniye HUID ka full form,
          gold purity marks, BIS hallmark aur HUID verification ka simple process.
        </p>
      </header>

      {/* QUICK ANSWER */}
      <section aria-labelledby="quick-answer" className="my-8 rounded-lg border p-4 sm:p-5">
        <h2 id="quick-answer" className="text-lg font-semibold">
          HUID Number Kya Hota Hai? Quick Answer
        </h2>

        <p className="text-muted-foreground mt-2 text-sm leading-7 sm:text-base">
          HUID ka full form <strong className="text-foreground">Hallmark Unique Identification</strong> hai. Yeh ek
          unique <strong className="text-foreground">6-character alphanumeric code</strong> hota hai jo BIS hallmarked
          gold jewellery ke har individual article ko identify karta hai. Customer is code ko official BIS CARE app ke
          Verify HUID feature se check kar sakta hai.
        </p>
      </section>

      {/* HUID MEANING */}
      <section aria-labelledby="meaning" className="my-9">
        <h2 id="meaning" className="text-xl font-semibold">
          HUID Hallmark Meaning and Full Form
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          HUID ka full form Hallmark Unique Identification hai. Yeh BIS (Bureau of Indian Standards) ke hallmarking
          system ka important part hai. Jab gold jewellery prescribed testing aur hallmarking process se pass hoti hai,
          tab us individual article ke liye unique HUID generate kiya jata hai.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          HUID system ka main purpose hallmarked jewellery ki identification aur traceability improve karna hai. Isse
          consumer ko jewellery ke hallmark details verify karne mein help milti hai.
        </p>

        <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm leading-7 sm:text-base">
          <li>HUID har individual hallmarked article ke liye unique hota hai.</li>
          <li>Code six characters ka alphanumeric combination hota hai.</li>
          <li>HUID jewellery par laser marking ke through mark kiya jata hai.</li>
          <li>Code ko BIS CARE app se verify kiya ja sakta hai.</li>
        </ul>
      </section>

      {/* HUID APPEARANCE */}
      <section aria-labelledby="appearance" className="my-9">
        <h2 id="appearance" className="text-xl font-semibold">
          HUID Number Kaisa Hota Hai?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          HUID number six-character alphanumeric code hota hai. Matlab ismein English alphabets aur numbers ka
          combination ho sakta hai. Yeh sirf 6 numeric digits ka number nahi hota.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Hallmarked gold jewellery par HUID ke saath BIS logo aur purity/fineness mark bhi hota hai. In teeno markings
          ko milakar BIS hallmark identify kiya jata hai.
        </p>

        <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: 'BIS Logo',
              text: 'Bureau of Indian Standards ka official hallmark symbol.',
            },
            {
              title: 'Purity Mark',
              text: 'Gold purity jaise 22K916 ya 18K750.',
            },
            {
              title: 'HUID Code',
              text: 'Unique six-character alphanumeric identification.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-md border p-3">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HALLMARK IMAGE */}
      <section aria-labelledby="visual-guide" className="my-9">
        <h2 id="visual-guide" className="text-xl font-semibold">
          Gold Jewellery Mein HUID Number Kaha Hota Hai?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Gold jewellery mein HUID number usually hallmark marking wale area mein laser engraved hota hai. Ring, chain,
          bangle, pendant aur nose pin ke design ke according marking ki position different ho sakti hai. Small
          jewellery articles mein marking dekhne ke liye magnifying glass ki zaroorat pad sakti hai.
        </p>

        <figure className="mt-5">
          <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
            <Image
              src={`${baseURL}/static/img/hallmark-sample1.webp`}
              alt="Gold jewellery par BIS hallmark aur HUID marking ka example"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>

          <figcaption className="text-muted-foreground mt-2 text-center text-sm">
            Gold jewellery par BIS hallmark aur HUID marking ka illustrative example.
          </figcaption>
        </figure>
      </section>

      {/* GOLD PURITY */}
      <section aria-labelledby="purity" className="my-9">
        <h2 id="purity" className="text-xl font-semibold">
          Gold Purity Marks: 22K916, 18K750, 14K585 Meaning
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Gold jewellery par purity mark bhi hota hai. Yeh mark batata hai ki jewellery mein kitna gold content hai.
          India mein commonly used gold purity grades aur unke fineness marks yeh hain:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Gold Purity</th>
                <th className="p-3">Fineness Mark</th>
                <th className="p-3">Gold Content</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['9K', '375', '37.5%'],
                ['14K', '585', '58.5%'],
                ['18K', '750', '75.0%'],
                ['20K', '833', '83.3%'],
                ['22K', '916', '91.6%'],
                ['23K', '958', '95.8%'],
                ['24KS', '995', '99.5%'],
              ].map(([karat, fineness, content]) => (
                <tr key={karat} className="border-b">
                  <td className="p-3 font-medium">{karat}</td>
                  <td className="p-3">{fineness}</td>
                  <td className="p-3">{content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
          Note: 24KS995 is a recognised hallmarking grade. Gold jewellery and artefacts are subject to applicable BIS
          standards and hallmarking rules.
        </p>
      </section>

      {/* HUID VERIFICATION */}
      <section aria-labelledby="verification" className="my-9">
        <h2 id="verification" className="text-xl font-semibold">
          HUID Number Online Kaise Check Karein?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Gold jewellery ka HUID verify karne ke liye Government of India's official BIS CARE app available hai. Ismein
          Verify HUID feature diya gaya hai.
        </p>

        <ol className="text-muted-foreground mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 sm:text-base">
          <li>Apne smartphone mein official BIS CARE app install karein.</li>
          <li>App open karke Verify HUID option select karein.</li>
          <li>Gold jewellery par engraved six-character HUID code enter karein.</li>
          <li>App mein available hallmark details check karein.</li>
          <li>Purity mark aur jewellery details ko actual product ke markings se match karein.</li>
        </ol>

        <p className="mt-4 text-sm leading-relaxed">
          Official verification information:{' '}
          <a
            href="https://www.bis.gov.in/hallmarking-overview/consumer-protection/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            BIS Consumer Protection – Verify HUID
          </a>
        </p>
      </section>

      {/* MANDATORY HALLMARKING */}
      <section aria-labelledby="mandatory" className="my-9">
        <h2 id="mandatory" className="text-xl font-semibold">
          Is HUID Mandatory for Gold Jewellery in India?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          India mein gold jewellery ki mandatory hallmarking scheme notified districts mein applicable hai. Covered gold
          jewellery aur artefacts ko BIS registered jewellers ke through applicable hallmarking requirements follow
          karke sell kiya jata hai.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Mandatory hallmarking order mein kuch exemptions bhi diye gaye hain. For example, gold articles weighing less
          than 2 grams, specified categories and certain eligible jewellers may be exempt, subject to applicable
          conditions.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Isliye yeh assume nahi karna chahiye ki market mein available har gold jewellery article par HUID hona hi
          chahiye. Jewellery ki applicable category, weight, location and exemption status matter karte hain.
        </p>
      </section>

      {/* GOLD COLLECTIONS */}
      <section aria-labelledby="gold-collections" className="my-10 border-t pt-7">
        <h2 id="gold-collections" className="text-xl font-semibold">
          Explore Gold Jewellery at Sapna Shri Jewellers
        </h2>

        <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
          HUID aur gold hallmark ki information samajhne ke baad explore karein our selected gold jewellery collections.
          Discover traditional religious gold rings and elegant gold nose pins.
        </p>

        <div className="mt-4">
          {goldSections.map((section) => (
            <GoldCollectionCard key={section.id} {...section} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="my-10 border-t pt-7">
        <h2 id="faq" className="text-xl font-semibold">
          Frequently Asked Questions About Gold HUID
        </h2>

        <div className="mt-4 divide-y">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                <span>{item.q}</span>
                <span className="shrink-0 text-xs transition-transform group-open:rotate-180" aria-hidden="true">
                  ▼
                </span>
              </summary>

              <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="my-8 border-t pt-6">
        <h2 className="text-xl font-semibold">Shop Gold Jewellery at Sapna Shri Jewellers</h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Explore our gold jewellery collections featuring religious gold rings and gold nose pins. Choose traditional
          designs and elegant styles for everyday wear and special occasions.
        </p>

        <Link href="/" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
          Visit Sapna Shri Jewellers →
        </Link>
      </section>
    </main>
  );
}
