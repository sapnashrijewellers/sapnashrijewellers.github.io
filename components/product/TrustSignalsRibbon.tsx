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
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  label: string;
  hindiLabel?: string;
  toolTip?: string;
  link?: string;
}

export default function TrustSignalsRibbon({
  product,
  className = "",
}: TrustSignalsRibbonProps) {
  const metal = product.metal;
  const isGold = metal === "gold";
  const weight = product.weight || 0;

  const isHallmarkedGold = metal == "gold" && weight > 2;

  const signals: TrustSignalItem[] = [
    {
      id: "auth-certificate",
      show: true,
      icon: Triangle,
      label: isHallmarkedGold
        ? "BIS Hallmark Gold"
        : "Authentication Certificate",
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
    },
    {
      id: "craftsmanship",
      show: true,
      icon: Sparkles,
      label: "Superior Craftsmanship",
    },
    {
      id: "warranty",
      show: true,
      icon: ShieldCheck,
      label: "6 Month Warranty",
      toolTip:
        "All our products come with a 6-month limited warranty from the date of purchase, applicable under normal use and proper care.",
      link: "/policies/warranty/",
    },
    {
      id: "skin-safe",
      show: true,
      icon: Heart,
      label: "Skin Safe & Hypoallergenic",
    },
    {
      id: "pan-india-delivery",
      show: true,
      icon: Globe,
      label: "All India Delivery",
      toolTip:
        "We deliver safely and securely across 19,000+ pin codes in India with insured courier partners.",
      link: "/policies/shipping/",
    },
    {
      id: "cod-available",
      show: !isGold,
      icon: IndianRupee,
      label: "Cash on Delivery",
    },
    {
      id: "easy-exchange",
      show: true,
      icon: RefreshCcw,
      label: "Easy Exchange & Returns",
      toolTip:
        "Transparent return and exchange policies for your peace of mind. Read our full policy terms.",
      link: "/policies/returns/",
    },
    {
      id: "upi-payments",
      show: true,
      icon: CreditCard,
      label: "UPI & Online Payments",
    },
    {
      id: "secure-shipping",
      show: true,
      icon: Truck,
      label: "100% Insured Shipping",
      toolTip:
        "Every shipment is fully insured against damage or loss during transit until it reaches your doorstep.",
      link: "/policies/shipping/",
    },
  ];

  const activeSignals = signals.filter((s) => s.show);

  return (
    <section
      aria-labelledby="trust-ribbon-heading"
      className={`relative rounded-2xl p-2 mb-6  bg-surface/90 shadow-sm ${className}`}
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
        <h2
          id="trust-ribbon-heading"
          className="text-xl font-bold uppercase tracking-[0.18em]"
        >
          Our Trust Promise
        </h2>
        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
          100% Certified
        </span>
      </div>

      {/* Screen Reader & LLM Structured Summary */}
      <div className="sr-only">
        Customer assurances for {product.name}: BIS Hallmark certification,
        6-month warranty, skin-safe metals, insured delivery across India, and
        transparent returns.
      </div>

      {/* Semantic Signals Grid */}
      <ul
        role="list"
        aria-label="Trust assurances and purchase benefits"
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 sm:gap-x-2 sm:gap-y-2"
      >
        {activeSignals.map((item) => {
          const Icon = item.icon;

          return (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl transition-colors duration-150"
            >
              <div
                className="group shrink-0 rounded-full border-2 border-primary/70 p-1.5"
                aria-hidden="true"
              >
                <div className="rounded-full border border-dashed  p-1.5 transition-all duration-500 group-hover:rotate-360 group-hover:border-primary">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 " />
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="leading-snug flex items-center gap-1">
                  <span>{item.label}</span>
                  {item.link && item.toolTip && (
                    <Tooltip
                      text={item.toolTip}
                      href={item.link}
                      label={`Learn more about ${item.label}`}
                    />
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
