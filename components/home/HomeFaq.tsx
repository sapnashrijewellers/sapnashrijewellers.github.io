"use client";

import React, { useState, useMemo } from "react";
import { 
  ChevronDown, 
  HelpCircle, 
  PhoneCall, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Flame, 
  Gift 
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
}

const FAQ_CATEGORIES: Category[] = [
  {
    id: "general-purity",
    label: "Purity & Services",
    icon: <ShieldCheck className="w-4 h-4" />,
    faqs: [
      {
        question: "Are all gold and silver items at Sapna Shri Jewellers hallmarked and certified?",
        answer: "Yes. Every gold ornament above 2 grams features certified BIS 916 hallmarking along with an authentic 6-digit Hallmark Unique Identification (HUID) code, verifiable via the official BIS Care app. Our silver jewelry, chains, coins, and devotional articles are crafted from authentic 925 sterling silver (92.5% pure silver alloyed for strength) and stamped with the 925 hallmark."
      },
      {
        question: "How does the Old Gold & Silver Exchange policy work?",
        answer: "We offer transparent, computerized exchange based on exact weight and daily live bullion rates. There are zero hidden administrative charges or arbitrary melting deductions. You receive full, accurate value when trading in your gold or upgrading silver jewelry."
      },
      {
        question: "Do you offer physical gold and silver bullion coins for investment?",
        answer: "Yes. We stock minted 24 Karat (99.9% purity) and 22 Karat investment gold coins, as well as 99.9% fine silver coins and bars in assorted denominations. All coins arrive securely packaged with purity certification for gifting and long-term investment."
      },
      {
        question: "How do I track my online order from Nagda or verify store availability?",
        answer: "Every item on our online catalog (sapnashrijewellers.in) is backed by our flagship showroom in Nagda, Madhya Pradesh. For live order tracking or custom commissions, contact our customer desk via WhatsApp or phone at +91 8234042231."
      }
    ]
  },
  {
    id: "custom-rings",
    label: "Custom & Couple Rings",
    icon: <Sparkles className="w-4 h-4" />,
    faqs: [
      {
        question: "What customization options are available for personalized silver rings?",
        answer: "You can engrave full names, nicknames, initials, significant dates (anniversaries/birthdays), zodiac symbols, simple icons (hearts, infinity), and even fingerprints or signatures on selected models. We offer both English and Devanagari/Hindi script engraving, with options for engraving on the outer surface, inner band, or both."
      },
      {
        question: "Will custom engraving fade, peel, or affect the ring's durability?",
        answer: "No. Our precision engraving is laser-cut and hand-detailed directly into solid 925 sterling silver—not superficial surface printing. It does not weaken the band profile and remains permanent and sharp with normal daily wear."
      },
      {
        question: "Are silver couple rings sold as sets, and can we order different sizes?",
        answer: "Yes. Our 925 silver couple rings and commitment bands can be ordered with independent Indian ring sizes for him and her. We offer both fixed-size bands and comfort-fit adjustable bands, packed in a premium presentation gift box."
      },
      {
        question: "How long does custom personalized jewelry take to craft and ship?",
        answer: "Custom personalized rings, nameplate jewelry, and bespoke orders are crafted only after confirmation. Production takes 2–4 business days before being carefully inspected and dispatched via insured pan-India delivery."
      }
    ]
  },
  {
    id: "devotional",
    label: "Devotional & Spiritual",
    icon: <Flame className="w-4 h-4" />,
    faqs: [
      {
        question: "What devotional collections do you specialize in?",
        answer: "Our karigars craft authentic spiritual jewelry including Lord Shiva/Mahakal/Mahadev rings and Trishul pendants, Sawariya Seth rings, Khatu Shyam Ji rings, Lord Krishna flute (Bansuri) & enameled Mor Pankh pendants, Lord Ganesha pendants, and Hanuman Ji Gada/Pawanputra designs in solid 925 silver and hallmarked gold."
      },
      {
        question: "Can I wear devotional silver pendants, rings, and malas during daily prayers (Puja)?",
        answer: "Yes. All our devotional jewelry is made from authentic 925 sterling silver—a revered, auspicious metal in Indian tradition. The smooth, skin-friendly contours make them comfortable for daily meditation, puja rituals, temple visits, and everyday office wear."
      },
      {
        question: "What materials are used in your Rudraksha silver malas and bracelets?",
        answer: "Our Rudraksha jewelry combines hand-selected genuine Rudraksha beads with pure 925 sterling silver bead caps, textured links, Damru/Trishul accents, or Om symbols. They are crafted in both high-polish silver and traditional antique oxidized finishes."
      },
      {
        question: "Can silver Rakhis (Shiv, Ganesha, Ram, Bhai, Shyam) be reused after Raksha Bandhan?",
        answer: "Yes. Our 925 sterling silver Rakhis are designed as multipurpose keepsake jewelry. Brothers can detach the traditional Mauli thread and wear the silver charm as an everyday bracelet or pendant long after the festival."
      }
    ]
  },
  {
    id: "chains-earrings",
    label: "Chains, Bali & Daily Silver",
    icon: <Heart className="w-4 h-4" />,
    faqs: [
      {
        question: "What styles of 925 silver chains do you offer for men and women?",
        answer: "We carry classic Cuban link chains, flat Curb chains, Italian-inspired Figaro patterns, and sleek minimalist daily chains in standard lengths (18, 20, 22, and 24 inches). All chains feature sturdy lobster or spring-ring clasps and 925 hallmark stamps."
      },
      {
        question: "Are silver Bali hoop earrings suitable for sensitive ears and daily wear?",
        answer: "Yes. Our 925 sterling silver Bali earrings are 100% nickel-free, hypoallergenic, and lightweight. We have plain hoops, engraved patterns, and Rudraksha charms designed for men, women, teenagers, and children."
      },
      {
        question: "Do silver pendant sets include the chain, and are stones securely set?",
        answer: "Yes. Our silver chain pendant sets come complete with a coordinated, adjustable sterling silver chain and matching earrings where indicated. Premium zircon stones and baroque pearls are secured using micro-prong and pavé settings to prevent stones from falling out."
      },
      {
        question: "Will 925 sterling silver tarnish, and how should I maintain it?",
        answer: "Natural silver reacts with ambient sulfur and moisture over time, resulting in a mild tarnish. Because it is solid 925 silver and not cheap electroplating, its mirror brilliance can be restored in seconds with a soft microfiber silver polishing cloth. Avoid spraying perfumes directly on jewelry and store pieces in an airtight pouch."
      }
    ]
  },
  {
    id: "baby-gifting",
    label: "Baby Jewelry & Gifting",
    icon: <Gift className="w-4 h-4" />,
    faqs: [
      {
        question: "Is your silver baby jewelry safe for newborns and infants?",
        answer: "Yes. Our baby Nazariya bracelets (featuring black beads, silver evil eye, Rudraksha, and cute enamel teddy charms) are crafted with smooth, rounded edges, lightweight construction, and expandable/adjustable sizing without sharp pinches."
      },
      {
        question: "Are sleek 925 silver payals (anklets) suitable for office and daily wear?",
        answer: "Yes. Our modern silver payals feature delicate, non-bulky, lightweight links that won't snag on sarees, salwar suits, or western trousers, providing subtle traditional charm for daily college and office styling."
      },
      {
        question: "Does your jewelry arrive in gift-ready packaging?",
        answer: "Every piece of jewelry from Sapna Shri Jewellers is shipped in a protective, luxury presentation box along with authenticity cards, making it immediately ready for gifting on birthdays, anniversaries, baby showers, and festive occasions."
      }
    ]
  }
];

export default function HomeFaq() {
  const [activeTab, setActiveTab] = useState<string>("general-purity");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Flatten all FAQs for Google's FAQPage JSON-LD schema
  const faqSchema = useMemo(() => {
    const allFaqs = FAQ_CATEGORIES.flatMap((category) => category.faqs);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }, []);

  const currentCategory = FAQ_CATEGORIES.find((cat) => cat.id === activeTab) || FAQ_CATEGORIES[0];

  const handleToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-stone-50/70 border-t border-stone-200">
      {/* Comprehensive Google Rich Results FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4" />
            Knowledge Base & Buying Guide
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-stone-600 text-base">
            Expert answers regarding our 100% BIS 916 gold, 925 sterling silver purity, custom engravings, devotional motifs, and jewellery care.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveTab(category.id);
                  setOpenFaqIndex(0); // Reset to first item on category switch
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-900 text-amber-50 shadow-sm"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {currentCategory.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden transition-all duration-200 hover:border-amber-300/80"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-semibold text-stone-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support & Custom Inquiry Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="font-serif font-semibold text-lg sm:text-xl text-white">
              Have questions about a bespoke ring or live gold rates?
            </h3>
            <p className="text-sm text-stone-300 mt-1 max-w-md">
              Our master karigars and support team in Nagda are available to assist with custom sizing, design previews, and hallmark authentication.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:+918234042231"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-sm rounded-lg transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/918234042231"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}