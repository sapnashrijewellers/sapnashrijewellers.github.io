import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import products from '@/data/products.json';
import collections from '@/data/collections.json';

const SITE_URL = 'https://sapnashrijewellers.in';
const PAGE_URL = `${SITE_URL}/wholesale-silver-rings/`;

// Add your WhatsApp number in .env.local without + or spaces.
// Example: NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '91XXXXXXXXXX';

const PAGE_TITLE = 'Wholesale Silver Rings – Religious & God Design Rings';

const META_DESCRIPTION =
  'Explore religious silver rings at wholesale prices. Shop Mahadev, Sawariya Seth, Khatu Shyam, Hanuman and Krishna silver rings. Contact us on WhatsApp for bulk order offers.';

export const metadata: Metadata = {
  title: 'Wholesale Silver Rings in India | Religious Silver Rings',
  description: META_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Wholesale Silver Rings in India | Sapna Shri Jewellers',
    description: META_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Sapna Shri Jewellers',
    type: 'website',
  },
};

// Only these five collections are promoted on this page.
const wholesaleCollections = [
  {
    id: 1,
    name: 'Mahadev Silver Rings',
    heading: 'Mahadev Silver Rings',
    description:
      'Explore silver rings featuring Lord Mahadev designs. Suitable for retailers, resellers and bulk buyers looking for religious silver jewellery.',
  },
  {
    id: 3,
    name: 'Sawariya Seth Rings',
    heading: 'Sawariya Seth Silver Rings',
    description:
      'Discover devotional silver rings inspired by Sawariya Seth. Contact us for bulk order requirements and wholesale quotations.',
  },
  {
    id: 8,
    name: 'Khatushyam Silver Rings',
    heading: 'Khatu Shyam Silver Rings',
    description:
      'Browse Khatu Shyam Ji silver ring designs for your jewellery collection. Wholesale offers are available on enquiry.',
  },
  {
    id: 9,
    name: 'Hanuman Silver Rings',
    heading: 'Hanuman Silver Rings',
    description:
      'Explore silver rings featuring Lord Hanuman. Ask us about bulk quantities, design availability and wholesale pricing.',
  },
  {
    id: 15,
    name: 'Krishna Silver Rings',
    heading: 'Krishna Silver Rings',
    description:
      'Find devotional silver rings inspired by Lord Krishna. Get in touch for wholesale enquiries and bulk purchase offers.',
  },
];

const faqs = [
  {
    question: 'Do you offer wholesale prices for silver rings?',
    answer:
      'Yes, you can contact Sapna Shri Jewellers for wholesale silver ring enquiries. Wholesale pricing may vary depending on order quantity, design, silver weight and availability. Contact us on WhatsApp for a personalised quotation.',
  },
  {
    question: 'What is the minimum quantity for a wholesale order?',
    answer:
      'The minimum order quantity may depend on the selected designs and availability. Share your requirements with us on WhatsApp so we can guide you about the available wholesale options.',
  },
  {
    question: 'Which silver ring designs are available for wholesale?',
    answer:
      'Our featured collections include Mahadev, Sawariya Seth, Khatu Shyam, Hanuman and Krishna silver rings. Product availability and designs may change over time.',
  },
  {
    question: 'Why can wholesale prices be different from website prices?',
    answer:
      'Wholesale prices can differ from regular website prices because of order quantity, silver weight, design, craftsmanship, prevailing silver rates and product availability. The final price is confirmed when you enquire about your selected products.',
  },
  {
    question: 'How can I get a wholesale quotation?',
    answer:
      'You can contact us on WhatsApp and share the ring designs, product links and approximate quantities you require. Our team can then help you with the latest wholesale offer.',
  },
  {
    question: 'Can retailers and resellers place bulk orders?',
    answer:
      'Retailers, resellers and other bulk buyers can contact us with their requirements. Wholesale offers and product availability are confirmed individually.',
  },
];

function getCollection(collectionId: number) {
  return collections.find((collection) => Number(collection.id) === collectionId && collection.active);
}

function getFeaturedProduct(collectionName: string) {
  const matchingProducts = products.filter(
    (product) => product.collection === collectionName && product.active && product.metal?.toLowerCase() === 'silver',
  );

  // Prefer an available product, but still show the collection
  // if its products are temporarily unavailable.
  return matchingProducts.find((product) => product.available) ?? matchingProducts[0];
}

function formatPrice(price: number | string) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) return null;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function getWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function CollectionCard({
  collectionId,
  name,
  heading,
  description,
}: {
  collectionId: number;
  name: string;
  heading: string;
  description: string;
}) {
  const collection = getCollection(collectionId);

  // Do not render a collection if it is missing or inactive.
  if (!collection) return null;

  const product = getFeaturedProduct(name);
  const image = product?.images?.[0];

  return (
    <article className="border-border bg-background overflow-hidden rounded-xl border">
      {image && (
        <Link
          href={`/c/${collectionId}/`}
          aria-label={`Explore ${heading}`}
          className="bg-muted relative block aspect-square overflow-hidden"
        >
          <Image
            src={`/collection-cards/${collectionId}.webp`}
            alt={heading}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}

      <div className="p-4">
        <h3 className="text-base font-semibold">{heading}</h3>

        <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>

        {product?.price != null && (
          <p className="mt-3 text-sm font-medium">Starting from {formatPrice(product.price)}</p>
        )}

        <Link
          href={`/c/${collectionId}/`}
          className="text-accent mt-4 inline-flex text-sm font-semibold underline-offset-4 hover:underline"
        >
          Explore Collection →
        </Link>
      </div>
    </article>
  );
}

export default function WholesaleSilverRingsPage() {
  const whatsappMessage =
    'Hello! I am interested in wholesale silver rings. Please share your latest designs, catalogue and wholesale pricing details.';

  const whatsappLink = getWhatsAppLink(whatsappMessage);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: PAGE_TITLE,
        description: META_DESCRIPTION,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${PAGE_URL}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Wholesale Silver Rings',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">
              Wholesale Silver Rings
            </li>
          </ol>
        </nav>

        {/* Hero section */}
        <section className="bg-muted/50 rounded-2xl px-5 py-8 sm:px-8 sm:py-12">
          <p className="text-accent mb-3 text-sm font-semibold tracking-wider uppercase">Sapna Shri Jewellers</p>

          <h1 className="max-w-3xl text-3xl leading-tight font-bold sm:text-4xl">
            Wholesale Silver Rings – Religious &amp; God Design Rings
          </h1>

          <p className="text-muted-foreground mt-5 max-w-3xl text-base leading-7">
            Looking for religious silver rings at wholesale prices? Explore devotional designs featuring Mahadev,
            Sawariya Seth, Khatu Shyam, Hanuman and Lord Krishna.
          </p>

          <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-7">
            Whether you are a jewellery retailer, reseller or planning a bulk purchase, contact us for wholesale
            enquiries. Pricing may vary depending on order quantity, design, silver weight and product availability.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Enquire on WhatsApp
            </a>

            <a
              href="#silver-ring-collections"
              className="border-border hover:bg-background inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition"
            >
              Explore Collections
            </a>
          </div>
        </section>

        {/* Introduction */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Wholesale Religious Silver Rings</h2>

          <p className="text-muted-foreground mt-4 leading-7">
            Religious silver rings are popular among customers who prefer devotional jewellery and traditional designs.
            At Sapna Shri Jewellers, you can explore different silver ring collections inspired by Hindu deities and
            popular religious traditions.
          </p>

          <p className="text-muted-foreground mt-3 leading-7">
            If you are purchasing for your jewellery shop, resale business or bulk requirements, get in touch with us to
            discuss suitable designs and wholesale pricing.
          </p>
        </section>

        {/* Collections */}
        <section id="silver-ring-collections" className="mt-14 scroll-mt-24">
          <div className="mb-7">
            <h2 className="text-2xl font-bold">Explore Wholesale Silver Ring Collections</h2>
            <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
              Browse our religious silver ring collections. Select a design or collection and contact us to enquire
              about bulk pricing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {wholesaleCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collectionId={collection.id}
                name={collection.name}
                heading={collection.heading}
                description={collection.description}
              />
            ))}
          </div>
        </section>

        {/* Wholesale pricing */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">How Are Wholesale Silver Ring Prices Calculated?</h2>

          <p className="text-muted-foreground mt-4 leading-7">
            Wholesale silver ring prices may be different from the regular prices displayed on our website. The final
            quotation depends on several factors, including:
          </p>

          <ul className="text-muted-foreground mt-5 list-disc space-y-2 pl-6 leading-7">
            <li>Total order quantity and number of pieces.</li>
            <li>Silver weight and prevailing silver market rates.</li>
            <li>Ring design, detailing and craftsmanship.</li>
            <li>Availability of the selected designs.</li>
            <li>Specific requirements of your bulk order.</li>
          </ul>

          <p className="text-muted-foreground mt-4 leading-7">
            For this reason, we recommend contacting us directly with your selected designs and approximate quantities.
            We can then help you with the latest applicable wholesale offer.
          </p>
        </section>

        {/* Who can enquire */}
        <section className="border-border mt-14 rounded-2xl border p-5 sm:p-8">
          <h2 className="text-2xl font-bold">Wholesale Enquiries for Retailers &amp; Resellers</h2>

          <p className="text-muted-foreground mt-4 leading-7">
            Are you a jewellery shop owner, reseller or bulk buyer? Share your requirements with us. You can mention the
            collection, product links and approximate quantity you are interested in.
          </p>

          <p className="text-muted-foreground mt-3 leading-7">
            Our team can help you check design availability and provide a wholesale quotation based on your
            requirements.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Get Wholesale Offer on WhatsApp
          </a>
        </section>

        {/* How to order */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">How to Enquire for Wholesale Silver Rings</h2>

          <ol className="text-muted-foreground mt-5 list-decimal space-y-3 pl-6 leading-7">
            <li>Browse the silver ring collections on this page.</li>
            <li>Select the designs you are interested in.</li>
            <li>Share the product links or names on WhatsApp.</li>
            <li>Mention your approximate order quantity.</li>
            <li>Get in touch with our team for a wholesale quotation.</li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Frequently Asked Questions About Wholesale Silver Rings</h2>

          <div className="divide-border border-border mt-6 divide-y border-y">
            {faqs.map((faq, index) => (
              <details key={index} className="group py-4" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground text-xl transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <p className="text-muted-foreground mt-3 pr-6 text-sm leading-7">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-muted/50 mt-14 rounded-2xl px-5 py-8 text-center sm:px-8 sm:py-10">
          <h2 className="text-2xl font-bold">Looking for Wholesale Silver Ring Prices?</h2>

          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl leading-7">
            Share your preferred designs and order quantity with us. Contact Sapna Shri Jewellers on WhatsApp for the
            latest wholesale offers on religious silver rings.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Contact Us on WhatsApp
          </a>
        </section>
      </main>
    </>
  );
}
