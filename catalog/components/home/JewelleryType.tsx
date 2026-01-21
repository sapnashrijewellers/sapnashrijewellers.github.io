import Link from "next/link";
import { Type } from "@/types/catalog"
import types from "@/data/types.json"
import {AppIconMap} from "@/utils/appIcons";

export default function JewelleryTypeBar({ home = true }: { home?: boolean }) {
  return (
    <section className="relative w-full py-1">
      <h2 className={`${!home ? "au-h2" : ""} text-2xl p-2 font-semibold`} id="shop-by-occasion">Jewellery for Every Occasion</h2>
      <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
        {types
          .filter((t: Type) => t.active)
          .sort((a: Type, b: Type) => a.rank - b.rank)
          .map((item: Type) => {            
            const Icon = AppIconMap[item.icon];

            return (
              <Link
                key={item.slug}
                href={`/jewelry-type/${item.slug}/`}
                className="group flex min-w-[96px] flex-col items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 group-hover:bg-amber-100">

                  {Icon && (<Icon size={26} strokeWidth={1.5} />)}
                </div>

                <span className="text-sm font-medium text-gray-800 text-center">
                  {item.type}
                </span>
              </Link>
            );
          })}
      </div>
    </section>
  );
}
