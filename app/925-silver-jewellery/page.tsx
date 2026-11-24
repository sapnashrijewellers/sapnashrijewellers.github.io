import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { Product, Collection } from '@/types/catalog';
import products from '@/data/products.json';
import collections from '@/data/collections.json';

import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import JsonLd from '@/components/common/JsonLd';

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');

const imageURL = `${baseURL}/static/img/products/optimized/`;
const pageURL = `${baseURL}/925-silver-jewellery/`;

const title = '925 Silver Jewellery Online in India | Handmade Silver Jewellery';

const description =
  'Explore 925 silver jewellery at Sapna Shri Jewellers. Learn about 925 sterling silver purity, BIS hallmark and HUID, handmade silver jewellery, and shop silver chains, rings, earrings, pendants, payal and bracelets.';

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
    type: 'website',
    url: pageURL,
    title,
    description,
    siteName: 'Sapna Shri Jewellers',
    images: [
      {
        url: `${baseURL}/icon-512x512.png`,
        width: 512,
        height: 512,
        alt: '925 Silver Jewellery - Sapna Shri Jewellers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${baseURL}/icon-512x512.png`],
  },
};

// --------------------------------------------------
// COLLECTION CONFIGURATION
// Collection IDs are resolved dynamically.
// This avoids hardcoding category IDs.
// --------------------------------------------------

interface ShopSection {
  collection: string;
  heading: string;
  description: string;
  keywords?: string[];
  maxPrice?: number;
}

const shopSections: ShopSection[] = [
  {
    collection: 'Silver Chain',
    heading: '925 Silver Chains for Men',
    description:
      'Discover classic and everyday 925 silver chains for men. Explore different chain patterns, styles and weights for daily wear and gifting.',
    keywords: ['chain'],
  },
  {
    collection: 'Silver Bali Earrings',
    heading: '925 Silver Bali Earrings for Men and Women',
    description:
      'Shop traditional and contemporary 925 silver bali earrings. Find lightweight designs and everyday silver earrings for different styles.',
    keywords: ['bali', 'hoop'],
  },
  {
    collection: 'Silver Stud Earrings',
    heading: '925 Silver Earrings Under ₹500',
    description:
      'Explore affordable 925 silver earrings, including elegant stud designs for everyday wear. Check individual product prices for options under ₹500.',
    maxPrice: 500,
  },
  {
    collection: 'Silver Rings for Men',
    heading: '925 Silver Rings for Men',
    description:
      'Discover stylish 925 silver rings for men, from traditional designs to contemporary silver bands. Explore everyday rings and statement jewellery.',
  },
  {
    collection: 'Personalised Silver Rings',
    heading: 'Custom 925 Silver Rings',
    description:
      'Make your jewellery personal with customised 925 silver rings. Explore personalised name rings and meaningful silver gifts.',
    keywords: ['name', 'personal'],
  },
  {
    collection: 'Krishna Silver Pendants',
    heading: '925 Silver Krishna Pendants',
    description: 'Explore devotional Krishna silver pendants crafted for spiritual expression and meaningful gifting.',
  },
  {
    collection: 'Hanuman Silver Pendants',
    heading: '925 Silver Hanuman Pendants',
    description: 'Discover Hanuman silver pendants in traditional devotional designs for everyday wear and gifting.',
  },
  {
    collection: 'Silver Bracelets',
    heading: '925 Silver Bracelets Under ₹1000',
    description:
      'Explore 925 silver bracelets in different styles. Compare product weights, designs and prices to find options within your budget.',
    maxPrice: 1000,
  },
  {
    collection: 'Buy Silver Rakhi',
    heading: '925 Silver Rakhi for Brother',
    description:
      'Celebrate Raksha Bandhan with meaningful silver rakhis. Explore silver rakhi designs as memorable gifts for your brother.',
    maxPrice: 500,
  },
  {
    collection: 'Silver Payal',
    heading: '925 Silver Payal for Women',
    description:
      'Explore traditional and contemporary silver payal designs. Compare styles, weights and prices before choosing your anklet.',
  },
  {
    collection: 'Silver Couple Rings',
    heading: '925 Silver Couple Rings',
    description:
      'Celebrate your relationship with matching 925 silver couple rings, designed for anniversaries, special occasions and everyday memories.',
  },
  {
    collection: 'Silver Rudraksha Mala',
    heading: '925 Silver Rudraksha Mala',
    description: 'Explore spiritual jewellery featuring silver craftsmanship and Rudraksha-inspired designs.',
  },
  {
    collection: 'Silver Mangalsutra Bracelet',
    heading: 'Silver Mangalsutra Jewellery',
    description:
      'Discover contemporary silver mangalsutra jewellery that blends traditional symbolism with modern styling.',
  },
  {
    collection: 'Baby Silver Payal',
    heading: 'Silver Payal for Babies',
    description: 'Explore traditional silver payal designs for babies and meaningful gifting occasions.',
  },
];

// --------------------------------------------------
// PRODUCT HELPERS
// --------------------------------------------------

function getFeaturedProduct(section: ShopSection): Product | undefined {
  const collection = collections.find((c: Collection) => c.name === section.collection && c.active);

  if (!collection) return undefined;

  const matchingProducts = products.filter(
    (p: Product) =>
      p.collection === section.collection &&
      p.active &&
      p.available &&
      p.metal?.toLowerCase() === 'silver' &&
      (!section.maxPrice || p.price <= section.maxPrice),
  );

  if (!matchingProducts.length) return undefined;

  const keywords = section.keywords?.map((k) => k.toLowerCase());

  const selected = keywords?.length
    ? matchingProducts.find((p) => {
        const name = p.name.toLowerCase();
        return keywords.some((keyword) => name.includes(keyword));
      })
    : matchingProducts[0];

  return selected || matchingProducts[0];
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
// Keep visible FAQs and structured data synchronized.
// --------------------------------------------------

const faqs = [
  {
    question: 'What is 925 silver jewellery?',
    answer:
      '925 silver, also known as sterling silver, contains 92.5% pure silver and 7.5% other metals, commonly copper. This combination provides better strength and durability for everyday jewellery compared with pure silver.',
  },
  {
    question: 'Is 925 silver real silver?',
    answer:
      'Yes. 925 silver is genuine silver containing 92.5% silver by weight. The 925 mark indicates its fineness, provided the article is genuine and correctly marked.',
  },
  {
    question: 'What is HUID in 925 silver jewellery?',
    answer:
      'HUID stands for Hallmark Unique Identification. It is a unique six-character alphanumeric code assigned to each silver article hallmarked under the BIS scheme. Since 1 September 2025, HUID has been mandatory for hallmarked silver articles in India.',
  },
  {
    question: 'Is hallmarking compulsory for silver jewellery in India?',
    answer:
      'No. BIS silver hallmarking remains voluntary in India. However, silver articles that are hallmarked under the BIS scheme must carry the applicable HUID-based hallmark.',
  },
  {
    question: 'How can I check the HUID of silver jewellery?',
    answer:
      'You can use the Verify HUID feature in the official BIS CARE app to check the details of a hallmarked silver article, including its purity and other available hallmarking information.',
  },
  {
    question: 'Why is 925 silver used instead of pure silver?',
    answer:
      'Pure silver is relatively soft and can bend or deform more easily. Adding other metals to create 925 sterling silver improves its strength and makes it more suitable for rings, chains, earrings, bracelets and other jewellery.',
  },
  {
    question: 'What determines the price of 925 silver jewellery?',
    answer:
      'The price depends on the silver rate, product weight, design complexity, making charges, stones or other materials, and applicable taxes. Different jewellery designs can therefore have different prices even when made from 925 silver.',
  },
  {
    question: 'Does 925 silver jewellery tarnish?',
    answer:
      'Yes. Sterling silver can naturally tarnish when exposed to air, moisture, sulphur compounds, perfumes and chemicals. Regular cleaning and proper storage help maintain its appearance.',
  },
  {
    question: 'Is 925 silver jewellery suitable for daily wear?',
    answer:
      '925 sterling silver is commonly used for daily-wear jewellery because it offers a balance of silver purity and durability. However, care should be taken to avoid harsh chemicals, excessive moisture and physical damage.',
  },
  {
    question: 'What is handmade 925 silver jewellery?',
    answer:
      'Handmade 925 silver jewellery involves skilled craftsmanship in shaping, assembling, detailing and finishing silver designs. Traditional techniques and careful finishing can give each design its own character.',
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
      headline: '925 Silver Jewellery: Purity, BIS Hallmark, HUID and Buying Guide',
      description,
      mainEntityOfPage: `${pageURL}`,
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
          name: '925 Silver Jewellery',
          item: pageURL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageURL}#faq`,
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

// --------------------------------------------------
// PRODUCT COLLECTION CARD
// --------------------------------------------------

function ProductCollectionCard({ section }: { section: ShopSection }) {
  const product = getFeaturedProduct(section);

  const collection = collections.find((c: Collection) => c.name === section.collection && c.active);

  if (!product || !collection) return null;

  const image = product.images?.[0];

  return (
    <article className="flex gap-4 border-b py-4 last:border-0 sm:gap-5">
      {image && (
        <Link
          href={`/c/${collection.id}/`}
          className="bg-muted relative block aspect-square w-24 shrink-0 overflow-hidden rounded-md sm:w-32"
          aria-label={`Explore ${section.collection}`}
        >
          <Image
            src={`${imageURL}${image}`}
            alt={`${product.name} - 925 silver jewellery`}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover"
          />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-snug font-semibold">
          <Link href={`/c/${collection.id}/`} className="hover:underline">
            {section.heading}
          </Link>
        </h3>

        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{section.description}</p>

        <p className="mt-2 text-sm font-medium">{product.name}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>

          {product.MRP > product.price && (
            <span className="text-muted-foreground text-xs line-through">{formatPrice(product.MRP)}</span>
          )}

          {product.HUID === true && <span className="text-xs text-green-700">HUID marked</span>}
        </div>

        <Link
          href={`/c/${collection.id}/`}
          className="mt-2 inline-block text-sm font-medium underline underline-offset-4"
        >
          Explore collection →
        </Link>
      </div>
    </article>
  );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function Silver925Page() {
  const availableSections = shopSections.filter((section) => getFeaturedProduct(section));

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: '925 Silver Jewellery' }]} />

      <JsonLd json={jsonLd} />

      {/* INTRODUCTION */}
      <header className="my-6 border-l-4 pl-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          925 Silver Jewellery – Purity, HUID & Handmade Designs
        </h1>

        <p className="text-muted-foreground mt-3 max-w-4xl text-sm leading-relaxed sm:text-base">
          Discover the beauty of genuine sterling silver jewellery at Sapna Shri Jewellers. Whether you are looking for
          925 silver earrings, men's silver chains, silver rings, bracelets or traditional pendants, understanding
          silver purity and hallmarking helps you make an informed choice. Explore our silver jewellery collections and
          learn about 925 silver, BIS hallmarking, HUID identification and traditional handmade silver craftsmanship.
        </p>
      </header>

      {/* WHAT IS 925 SILVER */}
      <section aria-labelledby="what-is-925" className="my-8">
        <h2 id="what-is-925" className="text-xl font-semibold">
          What Is 925 Silver?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          925 silver, commonly known as sterling silver, is an alloy containing 92.5% pure silver and 7.5% other metals,
          usually copper. The number 925 represents the silver fineness in parts per thousand. In simple terms, every
          1,000 parts of genuine 925 sterling silver contain 925 parts of pure silver.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Pure silver is naturally soft, which makes it less suitable for jewellery that needs to retain its shape
          during everyday use. The addition of other metals improves the strength and durability of sterling silver
          while retaining its characteristic silver appearance. This makes 925 silver a popular choice for silver rings,
          chains, earrings, bracelets, payal and pendants.
        </p>

        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['92.5%', 'Pure silver content'],
            ['7.5%', 'Other metals'],
            ['925', 'Fineness grade'],
            ['Sterling', 'Common name'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-md border p-3">
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-muted-foreground mt-1 text-xs">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-sm leading-7 sm:text-base">
          When shopping for 925 silver jewellery online in India, check the product's declared metal purity, weight,
          product description and hallmarking details before making a purchase.
        </p>
      </section>

      {/* SHOP BY CATEGORY */}
      <section aria-labelledby="shop-925" className="my-10">
        <h2 id="shop-925" className="text-xl font-semibold">
          Explore Our 925 Silver Jewellery Collections
        </h2>

        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          From everyday silver jewellery to traditional Indian designs, explore different styles of sterling silver
          jewellery for men, women and children.
        </p>

        <div className="mt-3">
          {availableSections.map((section) => (
            <ProductCollectionCard key={section.collection} section={section} />
          ))}
        </div>
      </section>

      {/* HALLMARK AND HUID */}
      <section aria-labelledby="huid" className="my-10">
        <h2 id="huid" className="text-xl font-semibold">
          BIS Hallmark and HUID in 925 Silver Jewellery
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Hallmarking is a system of testing and certifying the purity of precious metal articles. In India, the Bureau
          of Indian Standards (BIS) operates the hallmarking framework for silver jewellery and artefacts.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Silver hallmarking in India is voluntary. However, from 1 September 2025, every silver article hallmarked
          under the BIS scheme must carry a HUID-based hallmark. This is an important distinction: not every silver
          jewellery item in the market is necessarily BIS-hallmarked.
        </p>

        <h3 className="mt-5 text-base font-semibold">What are the marks on hallmarked silver?</h3>

        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-2 text-sm leading-7 sm:text-base">
          <li>
            <strong className="text-foreground">BIS Standard Mark:</strong> Identifies the BIS hallmarking mark along
            with the word SILVER.
          </li>
          <li>
            <strong className="text-foreground">Purity Mark:</strong> Indicates the fineness of the silver, such as 925.
          </li>
          <li>
            <strong className="text-foreground">HUID:</strong> A unique six-character alphanumeric identification code
            assigned to an individual hallmarked article.
          </li>
        </ul>

        <h3 className="mt-5 text-base font-semibold">How to check a silver HUID?</h3>

        <p className="text-muted-foreground mt-2 text-sm leading-7 sm:text-base">
          Consumers can verify the HUID of hallmarked silver jewellery through the official BIS CARE mobile app. The
          Verify HUID feature helps consumers check available details such as the article's purity, type and hallmarking
          information.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Always distinguish between a manufacturer's 925 stamp and a complete BIS hallmark. A 925 stamp alone should
          not be represented as proof of BIS HUID hallmarking.
        </p>

        <p className="mt-3 text-sm">
          Official information:{' '}
          <a
            href="https://www.bis.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Bureau of Indian Standards (BIS)
          </a>
          {' · '}
          <a
            href="https://www.bis.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            BIS hallmarking information
          </a>
        </p>
      </section>

      {/* HANDMADE JEWELLERY */}
      <section aria-labelledby="handmade" className="my-10">
        <h2 id="handmade" className="text-xl font-semibold">
          Handmade 925 Silver Jewellery and Traditional Craftsmanship
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Handmade silver jewellery combines precious metal with the skill and creativity of jewellery artisans. From
          shaping silver components and assembling intricate designs to polishing and finishing, craftsmanship plays an
          important role in the final appearance of a piece.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Indian silver jewellery has a rich tradition of decorative patterns, religious motifs and everyday ornaments.
          Contemporary handmade-inspired designs combine these traditional influences with modern styling, making silver
          jewellery suitable for both daily wear and special occasions.
        </p>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          At Sapna Shri Jewellers, explore silver jewellery designs across traditional rings, devotional pendants, bali
          earrings, chains, bracelets and other collections. Refer to individual product descriptions for specific
          craftsmanship and material details.
        </p>
      </section>

      {/* PRICE GUIDE */}
      <section aria-labelledby="price" className="my-10">
        <h2 id="price" className="text-xl font-semibold">
          925 Silver Price in India – What Determines the Cost?
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          The price of 925 silver jewellery depends on more than just the market price of silver. Each jewellery piece
          has a different weight, design and making process. Therefore, the price of a 925 silver chain, ring, bali,
          bracelet or payal can vary considerably.
        </p>

        <h3 className="mt-4 text-base font-semibold">Factors affecting 925 silver jewellery prices</h3>

        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-2 text-sm leading-7 sm:text-base">
          <li>
            <strong className="text-foreground">Silver rate:</strong> The prevailing silver market rate affects the
            underlying metal value.
          </li>
          <li>
            <strong className="text-foreground">Product weight:</strong> Heavier jewellery generally requires more
            silver.
          </li>
          <li>
            <strong className="text-foreground">Making charges:</strong> Design complexity and craftsmanship influence
            the making cost.
          </li>
          <li>
            <strong className="text-foreground">Additional materials:</strong> Stones, beads, clasps and decorative
            components can affect the final price.
          </li>
          <li>
            <strong className="text-foreground">Taxes and other charges:</strong> Applicable taxes and other charges may
            contribute to the final selling price.
          </li>
        </ul>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          If you are looking for 925 silver earrings under ₹500, a silver bracelet under ₹1000 or a 925 silver chain for
          men under ₹2000, compare individual product specifications, weight and price rather than relying only on the
          product photograph.
        </p>
      </section>

      {/* BUYING GUIDE */}
      <section aria-labelledby="buying-guide" className="my-10">
        <h2 id="buying-guide" className="text-xl font-semibold">
          How to Choose the Right 925 Silver Jewellery
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Before purchasing sterling silver jewellery, consider the following points:
        </p>

        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-2 text-sm leading-7 sm:text-base">
          <li>Check the declared 925 silver purity.</li>
          <li>Review the product weight and dimensions.</li>
          <li>Check whether the article is BIS hallmarked and has HUID, if claimed.</li>
          <li>Compare the product price and making charges.</li>
          <li>Choose a design appropriate for daily wear or special occasions.</li>
          <li>Read the product-specific care and maintenance instructions.</li>
        </ul>
      </section>

      {/* CARE GUIDE */}
      <section aria-labelledby="care" className="my-10">
        <h2 id="care" className="text-xl font-semibold">
          How to Care for 925 Sterling Silver Jewellery
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Sterling silver can naturally tarnish over time due to exposure to moisture, air, perfumes and chemicals. A
          few simple habits can help preserve its shine.
        </p>

        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-2 text-sm leading-7 sm:text-base">
          <li>Store jewellery in a dry, airtight pouch or box.</li>
          <li>Avoid direct contact with perfumes and harsh chemicals.</li>
          <li>Remove jewellery before swimming or bathing.</li>
          <li>Clean gently using a suitable silver polishing cloth.</li>
          <li>Follow the individual product's care instructions.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="my-10">
        <h2 id="faq" className="text-xl font-semibold">
          Frequently Asked Questions About 925 Silver Jewellery
        </h2>

        <div className="mt-4 divide-y">
          {faqs.map((faq) => (
            <article key={faq.question} className="py-4">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-7 sm:text-base">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="my-10 border-t pt-6">
        <h2 className="text-xl font-semibold">Explore 925 Silver Jewellery at Sapna Shri Jewellers</h2>

        <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
          Discover silver jewellery for men, women and children, including sterling silver chains, rings, earrings,
          pendants, bracelets, payal and traditional designs. Explore our collections and find jewellery for everyday
          styling, religious occasions and meaningful gifting.
        </p>

        <Link href="/" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
          Explore Sapna Shri Jewellers →
        </Link>
      </section>
    </main>
  );
}
