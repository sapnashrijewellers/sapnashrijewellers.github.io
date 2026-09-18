import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import TestimonialScroller from '@/components/common/Testimonials';
import { hero, story, specialties, promises, services, certificates, faqs } from '@/data/aboutUs.json';
import buildBusinessJsonLd from '@/utils/json-ld/buildBusinessJsonLd';

import {
  Award,
  Crown,
  Users,
  ShieldCheck,
  Scale,
  Sparkles,
  RefreshCw,
  Coins,
  Gem,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const title = 'Sapna Shri Jewellers Nagda | Sapna Shri Jewellers';
const description =
  'Sapna Shri Jewellers Nagda - 35+ years of trust, craftsmanship and transparent jewellery service, with 5,000+ happy customers. Explore gold, silver, devotional and personalised jewellery.';

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');

const imageUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${baseURL}/about-us/`,
    type: 'website',
    images: [
      {
        url: `${imageUrl}shop.webp`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${imageUrl}shop.webp`],
  },
  alternates: {
    canonical: `${baseURL}/about-us/`,
  },
};

const iconMap = {
  Award,
  Crown,
  Users,
  ShieldCheck,
  Scale,
  Sparkles,
  RefreshCw,
  Coins,
  Gem,
  MapPin,
};

function getIcon(name: string, className = 'w-6 h-6') {
  const Icon = iconMap[name as keyof typeof iconMap];

  if (!Icon) return null;

  return <Icon className={className} aria-hidden="true" />;
}

export default function AboutUsPage() {
  // Keep JSON-LD exactly as the existing implementation.
  const jsonLd = buildBusinessJsonLd();

  return (
    <article className="container mx-auto max-w-7xl px-4 py-6">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'About Us' }]} />

      {/* =========================================================
          HERO
      ========================================================== */}
      <header className="mx-auto my-10 max-w-4xl text-center md:my-14">
        <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">{hero.eyebrow}</p>

        <h2 className="mb-5">{hero.title}</h2>

        <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">{hero.description}</p>
      </header>

      {/* =========================================================
          TRUST STATS
      ========================================================== */}
      <section aria-labelledby="trust-heading" className="mx-auto mb-16 max-w-6xl">
        <h2 id="trust-heading" className="sr-only">
          Sapna Shri Jewellers Trust Highlights
        </h2>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {hero.stats.map((stat, index) => (
            <div
              key={`${stat.value}-${index}`}
              className={`bg-accent border-theme rounded-2xl border p-5 text-center md:p-7 ${
                index < 2 ? 'shadow-sm' : ''
              }`}
            >
              <div
                className={`mb-2 leading-none font-bold text-amber-500 ${index < 2 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}
              >
                {stat.value}
              </div>

              <h3 className="mb-2 text-base font-semibold md:text-lg">{stat.label}</h3>

              <p className="text-muted-foreground text-sm leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          OUR STORY + OWNER PHOTOS
      ========================================================== */}
      <section aria-labelledby="story-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Story */}
          <div className="lg:col-span-7">
            <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">{story.eyebrow}</p>

            <h2 id="story-heading" className="mb-6">
              {story.title}
            </h2>

            <div className="space-y-5 text-base leading-relaxed md:text-lg">
              {story.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="border-theme text-muted-foreground mt-7 border-l-4 py-2 pl-5 text-base italic md:text-lg">
              “{story.quote}”
            </blockquote>
          </div>

          {/* Leadership */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="text-center">
                <div className="border-theme relative aspect-[3/4] overflow-hidden rounded-2xl border shadow-sm">
                  <Image
                    src={`${imageUrl}blgang.webp`}
                    alt="Shri Bhanwarlal Gang, Founder of Sapna Shri Jewellers"
                    title="Shri Bhanwarlal Gang - Founder"
                    fill
                    sizes="(max-width: 1024px) 40vw, 240px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h3 className="mt-3 text-base font-bold md:text-lg">Shri Bhanwarlal Gang</h3>

                <p className="text-muted-foreground text-sm">Founder</p>
              </div>

              <div className="text-center">
                <div className="border-theme relative aspect-[3/4] overflow-hidden rounded-2xl border shadow-sm">
                  <Image
                    src={`${imageUrl}amish.webp`}
                    alt="Amish Kumar Gang, continuing the family legacy at Sapna Shri Jewellers"
                    title="Amish Kumar Gang"
                    fill
                    sizes="(max-width: 1024px) 40vw, 240px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h3 className="mt-3 text-base font-bold md:text-lg">Amish Kumar Gang</h3>

                <p className="text-muted-foreground text-sm">Continuing the Family Legacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          THE SAPNA SHRI STANDARD
      ========================================================== */}
      <section aria-labelledby="standard-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="border-theme rounded-3xl border p-7 md:p-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
              What We Stand For
            </p>

            <h2 id="standard-heading">Trust Built on Craftsmanship, Purity & Transparency</h2>

            <p className="text-muted-foreground mt-3 leading-relaxed">
              Our approach combines the personal relationship of a family jeweller with the clarity customers expect
              from a modern jewellery business.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {specialties.map((item) => (
              <div key={item.title} className="bg-accent border-theme rounded-2xl border p-6">
                <div className="border-theme mb-4 flex h-11 w-11 items-center justify-center rounded-xl border text-amber-500">
                  {getIcon(item.icon)}
                </div>

                <h3 className="mb-2 text-lg font-bold md:text-xl">{item.title}</h3>

                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SHOP IMAGE
      ========================================================== */}
      <section aria-labelledby="store-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="mb-7 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">Visit Us</p>

          <h2 id="store-heading">Our Store in Nagda</h2>
        </div>

        <div className="border-theme relative aspect-[16/7] w-full overflow-hidden rounded-3xl border shadow-md md:aspect-[16/6]">
          <Image
            src={`${imageUrl}shop.webp`}
            alt="Sapna Shri Jewellers store in Nagda Junction"
            title="Sapna Shri Jewellers Store in Nagda Junction"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      </section>

      {/* =========================================================
          STORE LOCATION
      ========================================================== */}
      <section aria-labelledby="location-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">Find Us</p>

          <h2 id="location-heading">Visit Sapna Shri Jewellers</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <address className="bg-accent border-theme rounded-2xl border p-6 leading-relaxed not-italic md:p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />

              <div>
                <h3 className="mb-3 text-lg font-bold">Sapna Shri Jewellers</h3>

                <p>Near Railway Station, M G Road,</p>

                <p>Nagda Junction, District: Ujjain, Madhya Pradesh</p>

                <p className="mt-4 font-semibold">
                  Phone:{' '}
                  <a
                    href="tel:+918234042231"
                    className="hover:underline"
                    aria-label="Call Sapna Shri Jewellers"
                    title="Call Sapna Shri Jewellers"
                  >
                    +91 8234042231
                  </a>
                </p>
              </div>
            </div>
          </address>

          <div className="bg-accent border-theme rounded-2xl border p-6 md:p-8">
            <h3 className="mb-4 text-lg font-bold">Serving Customers Beyond Nagda</h3>

            <p className="text-muted-foreground leading-relaxed">
              Our physical showroom is located in Nagda, while our online jewellery catalogue allows customers across
              India to explore selected collections from Sapna Shri Jewellers.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              Pan-India service
            </div>
          </div>
        </div>

        <div className="border-theme mt-6 overflow-hidden rounded-2xl border shadow-sm">
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

      {/* =========================================================
          PROMISES
      ========================================================== */}
      <section aria-labelledby="promises-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">Our Promise</p>

          <h2 id="promises-heading">A Jewellery Experience Built on Trust</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div key={promise.title} className="border-theme rounded-2xl border p-6 text-center">
              <div className="border-theme mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border text-amber-500">
                {getIcon(promise.icon)}
              </div>

              <h3 className="mb-2 text-lg font-bold">{promise.title}</h3>

              <p className="text-muted-foreground text-sm leading-relaxed">{promise.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================== */}
      <section aria-labelledby="services-heading" className="mx-auto mb-16 max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
            Jewellery Services
          </p>

          <h2 id="services-heading">Services for Your Jewellery</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} className="bg-surface border-theme rounded-2xl border p-6">
              <div className="mb-4 text-amber-600">{getIcon(service.icon)}</div>

              <h3 className="mb-2 text-lg font-bold">{service.title}</h3>

              <p className="text-muted-foreground text-sm leading-relaxed">{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          HUID / CERTIFICATION
      ========================================================== */}
      <section aria-labelledby="cert-heading" className="mx-auto mb-16 max-w-4xl text-center">
        <div className="bg-accent border-theme rounded-2xl border p-7 md:p-9">
          <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-amber-500" aria-hidden="true" />

          <h2 id="cert-heading">Gold Hallmark & HUID Verification</h2>

          <div className="mt-4 space-y-3">
            {certificates.map((certificate, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {certificate.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================== */}
      <section aria-label="Customer testimonials" className="mb-16">
        <TestimonialScroller />
      </section>

      {/* =========================================================
          FAQ
      ========================================================== */}
      <section aria-labelledby="faq-heading" className="mx-auto mb-10 max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">FAQ</p>

          <h2 id="faq-heading">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.q}
              open={index === 0}
              className="group border-theme bg-surface open:ring-primary/20 rounded-2xl border p-5 shadow-sm transition-all open:ring-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold select-none">
                <span>{faq.q}</span>

                <span
                  className="text-muted-foreground text-sm font-normal transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </summary>

              <p className="text-muted-foreground mt-3 text-base leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
