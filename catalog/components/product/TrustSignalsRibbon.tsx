import { ShieldCheck, Truck, CreditCard, IndianRupee, BadgeCheck, Hammer, Heart, Globe, RefreshCcw } from "lucide-react";
import type { Product } from "./types";

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
      icon: ShieldCheck,
      label: "Certified Purity",
    },
    {
      show: true,
      icon: BadgeCheck,
      label: `${metal === "gold" ? "Gold" : "Silver"} Jewellery`,
    },
    {
      show: true,
      icon: RefreshCcw,
      label: "Easy Returns",
    },
    {
      show: true,
      icon: Hammer,
      label: "Superior Craftsmanship",
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
    },
    {
      show: true,
      icon: CreditCard,
      label: "Online Payments (CC / DC / UPI)",
    },
    {
      show: !isGold,
      icon: IndianRupee,
      label: "Cash on Delivery",
    },
    {
      show: true,
      icon: Truck,
      label: "Secure Shipping",
    },
  ];

  return (
    <section className="bg-surface border border-theme rounded-xl p-4 md:p-6">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {signals
          .filter((s) => s.show)
          .map((item, idx) => {
            const Icon = item.icon;
            return (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-lg p-3 bg-highlight border border-theme"
              >
                <Icon
                  size={22}
                  className="text-primary shrink-0"
                  strokeWidth={1.8}
                />
                <span className="text-sm font-medium text-normal leading-snug">
                  {item.label}
                </span>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
