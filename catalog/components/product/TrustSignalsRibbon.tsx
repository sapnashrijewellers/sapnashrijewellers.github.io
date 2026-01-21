import {
  ShieldCheck, Truck, CreditCard, IndianRupee, Heart, Globe, RefreshCcw,
  Triangle, HandMetal, RectangleHorizontal
} from "lucide-react";
import type { Product } from "@/types/catalog";
import Tooltip from "@/components/common/Tooltip"

interface Props {
  product: Product;
}

function getMetalType(purity: string): "gold" | "silver" {
  return purity.toLowerCase().startsWith("gold") ? "gold" : "silver";
}

export default function TrustSignalsRibbon({ product }: Props) {
  const metal = getMetalType(product.purity);
  const isGold = metal === "gold";

  const signals = [
    {
      show: true,
      icon: Triangle,
      label: product.purity.startsWith("gold") && product.weight > 2 ? "BIS Hallmark Gold" : "Authentication Certificate",

    },
    {
      show: true,
      icon: RectangleHorizontal,
      label: `${metal === "gold" ? "Gold" : "Silver"} Jewellery`,
    },
    {
      show: true,
      icon: HandMetal,
      label: "Superior Craftsmanship",
    },
    {
      show: true,
      icon: ShieldCheck,
      label: "6 Month Warranty",
      toolTip: "All our products come with a **6-month limited warranty** from the date of purchase, applicable under normal use and proper care.",
      link: "/policies/warranty/"
    },
    {
      show: true,
      icon: Heart,
      label: "Skin Safe",
    },
    {
      show: true,
      icon: Globe,
      label: "All India Delivery",
      toolTip: "We are committed to delivering your order in a safe, timely, and transparent manner.",
      link: "/policies/shipping/"
    },
    {
      show: !isGold,
      icon: IndianRupee,
      label: "Cash on Delivery",
    },
    {
      show: true,
      icon: RefreshCcw,
      label: "Easy Exchange",
      toolTip: "We values transparency and customer satisfaction. Please read the following Return, Exchange, and Refund terms carefully...",
      link: "/policies/returns/"
    },
    {
      show: true,
      icon: CreditCard,
      label: "UPI Payments",
    },

    {
      show: true,
      icon: Truck,
      label: "Secure Shipping",
      toolTip: "We are committed to delivering your order in a safe, timely, and transparent manner.",
      link: "/policies/shipping/"
    },
  ];


  return (
    <section
      className="relative rounded-2xl p-5 mb-6"
      style={{
        background: `linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-primary) 12%, transparent),
      color-mix(in srgb, var(--color-primary) 4%, transparent)
    )`,
      }}
    >
      <h3 className="mb-4 uppercase tracking-[0.2em] text-primary-dark">
        Our Trust Promise
      </h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">
        {signals
          .filter((s) => s.show)
          .map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} className="flex items-center gap-3 px-2">
                <Icon
                  size={24}
                  strokeWidth={2}
                  className="font-bold text-primary-dark opacity-70 shrink-0"
                />

                <span className="
              text-sm
              font-medium
              tracking-wide
              text-normal
              leading-snug
            ">
                  {item.label}
                  {item.link && (
                    <Tooltip text={`${item.toolTip}`} href={item.link} key={item.label} />
                  )}
                </span>
              </li>
            );
          })}
      </ul>
    </section>

  );
}
