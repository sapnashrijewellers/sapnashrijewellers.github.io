import Link from "next/link";
import { Type } from "@/types/catalog";
import types from "@/data/types.json";
import { AppIconMap } from "@/utils/appIcons";

export default function JewelleryTypeBar({ home = true }: { home?: boolean }) {
  return (
    <section className="relative w-full py-1">
      <h2
        className={`${!home ? "au-h2" : ""} p-2 text-2xl font-semibold`}
        id="shop-by-occasion"
      >
        Jewellery for Every Occasion
      </h2>

      <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
        {types
          .filter((t: Type) => t.active)
          .sort((a: Type, b: Type) => a.rank - b.rank)
          .map((item: Type) => {
            const Icon = AppIconMap[item.icon];
            const Icon1 = item.icon1 ? AppIconMap[item.icon1] : null;

            return (
              <Link
                key={item.slug}
                href={`/jewelry-type/${item.slug}/`}
                className="
                  group relative flex min-w-[104px] flex-col items-center
                  gap-2 rounded-2xl bg-white px-4 py-3
                  shadow-sm transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                {/* Icon Badge */}
                <div
                  className="
                    relative flex h-[62px] w-[62px] items-center justify-center
                    rounded-full bg-gradient-to-br from-amber-50 to-orange-50
                    text-amber-700
                    ring-1 ring-amber-100
                    transition-all duration-300
                    group-hover:from-amber-100
                    group-hover:to-orange-100
                    group-hover:ring-amber-200
                  "
                >
                  {/* Decorative glow */}
                  <span
                    className="
                      absolute inset-1 rounded-full
                      border border-dashed border-amber-200/70
                      transition-transform duration-500
                      group-hover:rotate-12
                    "
                  />

                  {/* Main icon */}
                  {Icon && (
                    <Icon
                      size={42}
                      strokeWidth={1.5}
                      className="
                        relative z-10
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    />
                  )}

                  {/* Secondary icon */}
                  {Icon1 && (
                    <span
                      className="
                        absolute -right-1 -bottom-1 z-20
                        flex h-7 w-7 items-center justify-center
                        rounded-full bg-white
                        text-amber-700
                        shadow-md ring-1 ring-amber-100
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:rotate-6
                      "
                    >
                      <Icon1 size={18} strokeWidth={1.8} />
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="
                    text-center text-sm font-medium leading-tight
                    text-gray-800 transition-colors
                    group-hover:text-amber-700
                  "
                >
                  {item.type}
                </span>
              </Link>
            );
          })}
      </div>
    </section>
  );
}