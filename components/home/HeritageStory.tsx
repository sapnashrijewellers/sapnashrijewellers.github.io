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
  CheckCircle2,
  MapPin
} from "lucide-react";

export default function HeritageStory() {
  const milestoneStats = [
    {
      value: "35+",
      unit: "Years",
      title: "Generations of Craftsmanship",
      desc: "Upholding time-tested values of purity, integrity, and ethical jewellery trading since foundation."
    },
    {
      value: "5,000+",
      unit: "Families",
      title: "Trusted Customer Base",
      desc: "Generations of families across Nagda, Ujjain, and pan-India trust us for their milestone bridal & festive jewellery."
    },
    {
      value: "100%",
      unit: "BIS 916",
      title: "HUID Certified Hallmarked Gold",
      desc: "Every ornament exceeding 2 grams carries a unique, tamper-proof 6-digit HUID code verifiable on the BIS Care app."
    },
    {
      value: "92.5%",
      unit: "Sterling",
      title: "Certified Pure Silver",
      desc: "Certified purity across modern lightweight silverware, designer daily-wear ornaments, and sacred devotional iconography."
    }
  ];

  const specialtyPillars = [
    {
      icon: <Award className="w-6 h-6 text-amber-700" />,
      title: "Government-Accredited BIS 916 & HUID Verification",
      description:
        "Every single gold ornament over 2 grams undergoes rigorous testing at certified Assaying and Hallmarking Centres (AHC). The laser-etched Hallmark Unique Identification (HUID) code offers complete traceability, guaranteeing alloy purity and fair buyback values."
    },
    {
      icon: <Gem className="w-6 h-6 text-amber-700" />,
      title: "92.5 Authentic Sterling Silver Artistry",
      description:
        "From delicate daily-wear payals and minimal zircon pendants to heavy ornate silverware, every piece is handcrafted in pure 925 sterling silver, ensuring hypoallergenic, nickel-free comfort that withstands daily life."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-700" />,
      title: "Bespoke Custom Jewellery Atelier",
      description:
        "Collaborate with our master karigars to customize your dream bridal necklaces, couple commitment rings, nameplate jewelry, and heritage heirlooms tailored to your precise aesthetic, metal weight, and budget."
    },
    {
      icon: <Crown className="w-6 h-6 text-amber-700" />,
      title: "Devotional Heritage & Rajwadi Collections",
      description:
        "Celebrating Central India's rich spiritual culture with dedicated, finely detailed iconography—including sacred Mahadev Trishul and Damru motifs, Sanwaliya Seth rings, Khatu Shyam Ji keepsakes, and royal Rajasthani Rajwadi patterns."
    }
  ];

  const coreServices = [
    {
      icon: <RefreshCw className="w-5 h-5 text-amber-600 shrink-0" />,
      title: "Transparent Old Gold & Silver Exchange",
      desc: "Accurate computerised purity testing and exact digital weighing against real-time live market rates with zero arbitrary melting deductions."
    },
    {
      icon: <Scale className="w-5 h-5 text-amber-600 shrink-0" />,
      title: "Clear Weight & Live Price Billing",
      desc: "Complete transparency with clear tax invoices itemizing gross weight, net metal weight, stone weight, making charges, and prevailing market rates."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />,
      title: "Restorative Jewellery Spa & Polishing",
      desc: "Advanced ultrasonic cleaning, rhodium re-plating, and prong-tightening services that breathe showroom brilliance back into legacy ornaments."
    },
    {
      icon: <Coins className="w-5 h-5 text-amber-600 shrink-0" />,
      title: "24K & 22K Investment Bullion Coins & Bars",
      desc: "Government-inspected 99.9% fine 24K gold coins and 999 fine silver bullion bars available in verified weights for wealth preservation and auspicious gifting."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-stone-100/70 via-stone-50 to-white text-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Pill Badge & Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200">
            <Crown className="w-4 h-4 text-amber-800" />
            Sapna Shri Heritage & Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
            35+ Years of Purity, Craftsmanship & Trust in Nagda
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg leading-relaxed">
            Representing the golden standard of trust in Madhya Pradesh. Blending traditional Indian
            karigari with cutting-edge assaying standards to serve over 5,000 satisfied families.
          </p>
        </div>

        {/* Milestone Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {milestoneStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative group"
            >
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-900 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
                  {stat.unit}
                </span>
              </div>
              <h3 className="font-serif font-semibold text-stone-900 text-base mb-2 group-hover:text-amber-800 transition-colors">
                {stat.title}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Founder & Leadership Narrative Block (E-E-A-T) */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 lg:p-16 mb-20 shadow-xl relative overflow-hidden">
          {/* Subtle Background Gold Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                <Users className="w-4 h-4" />
                The Story Behind Sapna Shri Jewellers
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-snug">
                From Humble Foundations to Nagda’s Trusted Fine Jewellery Destination
              </h3>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                The foundation of Sapna Shri Jewellers was laid by <strong>Shri Bhanwarlal Ji Gang</strong>, 
                anchored in an unwavering code of ethical dealing, certified metal purity, and warm community
                relationships. Over three and a half decades, this dedication transformed a local atelier into a
                revered household name across the Malwa region.
              </p>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                Today, this proud family legacy is led forward by <strong>Amish Kumar Gang</strong>. Blending the
                foundational values of traditional Indian hospitality with modern transparent practices, Amish Kumar
                has introduced real-time live market pricing, computerized purity checks, digital weight billing,
                and an online portal bringing Nagda’s finest artisanal jewelry to patrons across India.
              </p>

              <blockquote className="border-l-4 border-amber-500 pl-4 sm:pl-6 py-2 text-amber-200/90 italic font-serif text-base sm:text-xl">
                “Where every jewel is not merely an ornament of precious metal, but a sacred story preserving your
                family’s deepest faith, heritage, and milestones.”
              </blockquote>
            </div>

            <div className="lg:col-span-5 bg-stone-800/80 p-6 sm:p-8 rounded-2xl border border-stone-700 backdrop-blur-sm">
              <h4 className="font-serif font-bold text-lg text-amber-300 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                The Sapna Shri Integrity Standard
              </h4>
              <ul className="space-y-3.5 text-stone-300 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Purity Guesswork:</strong> Every gold ornament over 2g is laser-etched with the government-backed 6-digit HUID code.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>True 925 Sterling Silver:</strong> Exact 92.5% pure silver with anti-tarnish protective coatings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>No Hidden Deductions:</strong> Guaranteed transparent calculations during buybacks and old gold exchanges.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Artisan Sourcing:</strong> Supporting indigenous local karigars specializing in authentic Rajwadi & devotional jewellery.</span>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-stone-700 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" /> Flagship Store: Nagda, M.P.
                </span>
                <span className="text-amber-300/90 font-medium">Serving Pan-India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us: 4 Specialty Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Artistry Rooted in Proven Purity
            </h3>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              Why discerning families and jewellery enthusiasts choose Sapna Shri Jewellers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialtyPillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif font-bold text-stone-900 text-xl mb-3">
                    {pillar.title}
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-Store & Digital Services Grid */}
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Full-Spectrum Fine Jewellery Services
            </h3>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              We offer comprehensive jewellery care, valuation, and financial convenience directly from our Nagda showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map((service, sIndex) => (
              <div key={sIndex} className="bg-white p-6 rounded-xl border border-stone-200/80 flex flex-col justify-start">
                <div className="mb-3">{service.icon}</div>
                <h4 className="font-serif font-semibold text-stone-900 text-base mb-2">
                  {service.title}
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}