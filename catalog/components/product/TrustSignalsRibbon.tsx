import type { Product } from "@/types/catalog";
import Tooltip from "@/components/common/Tooltip";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  IndianRupee,
  Heart,
  Globe,
  RefreshCcw,
  Triangle,
  Sparkles,
  RectangleHorizontal,
} from "lucide-react";

interface TrustSignalsRibbonProps {
  product: Product;
  className?: string;
}

interface TrustSignalItem {
  id: string;
  show: boolean;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  label: string;
  hindiLabel?: string;
  toolTip?: string;
  link?: string;
}

function getMetalType(purity?: string): "gold" | "silver" {
  return (purity || "").toLowerCase().startsWith("gold") ? "gold" : "silver";
}

export default function TrustSignalsRibbon({
  product,
  className = "",
}: TrustSignalsRibbonProps) {
  const metal = getMetalType(product.purity);
  const isGold = metal === "gold";
  const purityString = product.purity || "";
  const weight = product.weight || 0;

  const isHallmarkedGold = purityString.toLowerCase().startsWith("gold") && weight > 2;

  const signals: TrustSignalItem[] = [
    {
      id: "auth-certificate",
      show: true,
      icon: Triangle,
      label: isHallmarkedGold ? "BIS Hallmark Gold" : "Authentication Certificate",
      hindiLabel: isHallmarkedGold ? "BIS हॉलमार्क प्रमाणित" : "प्रमाणित शुद्धता",
      toolTip: isHallmarkedGold
        ? "Government-approved BIS 916 Hallmarked jewellery ensuring genuine gold purity with laser-engraved HUID verification."
        : "Certified pure and authenticated precious metal jewellery from Sapna Shri Jewellers.",
      link: "/policies/warranty/",
    },
    {
      id: "metal-purity",
      show: true,
      icon: RectangleHorizontal,
      label: `${isGold ? "Pure Gold" : "Pure Silver"} Jewellery`,
      hindiLabel: isGold ? "शुद्ध सोने के आभूषण" : "शुद्ध चांदी के आभूषण",
    },
    {
      id: "craftsmanship",
      show: true,
      icon: Sparkles,
      label: "Superior Craftsmanship",
      hindiLabel: "उत्कृष्ट कारीगरी",
    },
    {
      id: "warranty",
      show: true,
      icon: ShieldCheck,
      label: "6 Month Warranty",
      hindiLabel: "6 महीने की वारंटी",
      toolTip:
        "All our products come with a 6-month limited warranty from the date of purchase, applicable under normal use and proper care.",
      link: "/policies/warranty/",
    },
    {
      id: "skin-safe",
      show: true,
      icon: Heart,
      label: "Skin Safe & Hypoallergenic",
      hindiLabel: "त्वचा के लिए सुरक्षित",
    },
    {
      id: "pan-india-delivery",
      show: true,
      icon: Globe,
      label: "All India Delivery",
      hindiLabel: "पूरे भारत में डिलीवरी",
      toolTip:
        "We deliver safely and securely across 19,000+ pin codes in India with insured courier partners.",
      link: "/policies/shipping/",
    },
    {
      id: "cod-available",
      show: !isGold,
      icon: IndianRupee,
      label: "Cash on Delivery",
      hindiLabel: "कैश ऑन डिलीवरी उपलब्ध",
    },
    {
      id: "easy-exchange",
      show: true,
      icon: RefreshCcw,
      label: "Easy Exchange & Returns",
      hindiLabel: "आसान एक्सचेंज पॉलिसी",
      toolTip:
        "Transparent return and exchange policies for your peace of mind. Read our full policy terms.",
      link: "/policies/returns/",
    },
    {
      id: "upi-payments",
      show: true,
      icon: CreditCard,
      label: "UPI & Online Payments",
      hindiLabel: "UPI और डिजिटल भुगतान",
    },
    {
      id: "secure-shipping",
      show: true,
      icon: Truck,
      label: "100% Insured Shipping",
      hindiLabel: "सुरक्षित और बीमित शिपिंग",
      toolTip:
        "Every shipment is fully insured against damage or loss during transit until it reaches your doorstep.",
      link: "/policies/shipping/",
    },
  ];

  const activeSignals = signals.filter((s) => s.show);

  return (
    <section
      aria-labelledby="trust-ribbon-heading"
      className={`relative rounded-2xl p-4 sm:p-6 mb-6 border border-theme/40 bg-surface/90 shadow-sm ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-primary, #b8860b) 10%, transparent),
          color-mix(in srgb, var(--color-primary, #b8860b) 3%, transparent)
        )`,
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-theme/20">
        <h3
          id="trust-ribbon-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary"
        >
          Our Trust Promise &bull; हमारा विश्वास
        </h3>
        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
          100% Certified
        </span>
      </div>

      {/* Screen Reader & LLM Structured Summary */}
      <div className="sr-only">
        Customer assurances for {product.name}: BIS Hallmark certification, 6-month warranty, skin-safe metals, insured delivery across India, and transparent returns.
      </div>

      {/* Semantic Signals Grid */}
      <ul
        role="list"
        aria-label="Trust assurances and purchase benefits"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-5"
      >
        {activeSignals.map((item) => {
          const Icon = item.icon;

          return (
            <li
              key={item.id}
              className="flex items-start gap-2.5 p-1 rounded-xl transition-colors duration-150"
            >
              <div
                className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <Icon className="w-8 h-8 sm:w-8 sm:h-8 text-primary" aria-hidden="true" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug flex items-center gap-1 flex-wrap">
                  <span>{item.label}</span>
                  {item.link && item.toolTip && (
                    <Tooltip
                      text={item.toolTip}
                      href={item.link}
                      label={`Learn more about ${item.label}`}
                    />
                  )}
                </span>
                {item.hindiLabel && (
                  <span className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                    {item.hindiLabel}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}