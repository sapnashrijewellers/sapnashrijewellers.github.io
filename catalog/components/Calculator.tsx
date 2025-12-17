"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import IndianRupeeRate from "@/components/common/IndianRupeeRate";
import products from "@/data/products.json";
import { Product } from "@/types/catalog";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import WhatsappClick from "@/components/product/WhatAppClick";

/* ----------------------------- Types ----------------------------- */

type Category = "gold" | "silver";

type Purity =
  | "gold24K"
  | "gold22K"
  | "gold18K"
  | "silver"
  | "silverJewellery";

interface CalculatorForm {
  category: Category;
  purity: Purity;
  weight: number;
  makingCharges: number;
  gst: number;
}

interface Rates {
  gold24K: number;
  gold22K: number;
  gold18K: number;
  silver: number;
  silverJewellery: number;
}

/* --------------------------- Component --------------------------- */

export default function Calculator() {
  const searchParams = useSearchParams();

  /* -------------------- Product from query -------------------- */

  const productId = Number(searchParams.get("pid"));

  const product: Product | undefined = useMemo(() => {
    if (!productId || Number.isNaN(productId)) return undefined;
    return products.find((p) => p.id === productId);
  }, [productId]);

  /* ----------------------- Form State ----------------------- */

  const [form, setForm] = useState<CalculatorForm>({
    category: "gold",
    purity: "gold22K",
    weight: 10,
    makingCharges: 7,
    gst: 3,
  });

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ----------------------- Constants ----------------------- */
  const lockProductFields = Boolean(product);
  const defaultPurityByCategory: Record<Category, Purity> = {
    gold: "gold22K",
    silver: "silver",
  };
  const productPurityMap: Record<string, Purity> = {
    "22K": "gold22K",
    "24K": "gold24K",
    "18K": "gold18K",
    silver: "silver",
    silverJewellery: "silverJewellery",
  };

  const categoryFromPurity = (purity: Purity): Category =>
    purity.startsWith("gold") ? "gold" : "silver";

  const purityLabels: Record<Purity, string> = {
    gold24K: "सोना (24K)",
    gold22K: "सोना (22K)",
    gold18K: "सोना (18K)",
    silver: "चाँदी (99.9)",
    silverJewellery: "चाँदी (जेवर)",
  };

  const purityOptions: Purity[] =
    form.category === "gold"
      ? ["gold24K", "gold22K", "gold18K"]
      : ["silver", "silverJewellery"];

  /* ----------------------- Handlers ----------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    
    const { name, value } = e.target;
    if (lockProductFields && (name === "category" || name === "purity")) {
      return;
    }

    setForm((prev) => {
      if (name === "category") {
        const category = value as Category;
        return {
          ...prev,
          category,
          purity: defaultPurityByCategory[category],
        };
      }

      if (name === "purity") {
        const purity = value as Purity;
        return {
          ...prev,
          purity,
          category: categoryFromPurity(purity),
        };
      }

      return {
        ...prev,
        [name]:
          e.target.type === "number" ? Number(value) : (value as Purity),
      };
    });
  };

  /* ----------------------- Rates ----------------------- */

  const fetchRates = async (): Promise<Rates | null> => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/rate/rates.json`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load rates");
      return (await res.json()) as Rates;
    } catch (err) {
      console.error(err);
      alert("रेट्स लोड करने में समस्या हुई।");
      return null;
    }
  };

  /* ----------------------- Calculation ----------------------- */

  const calculatePrice = async () => {
    if (!purityOptions.includes(form.purity)) {
      alert("अमान्य शुद्धता चयन");
      return;
    }

    setLoading(true);
    setPrice(null);

    const rates = await fetchRates();
    if (!rates) {
      setLoading(false);
      return;
    }

    const rate =
      form.purity === "silverJewellery"
        ? rates.silver * 0.92
        : rates[form.purity as keyof Rates];

    if (!rate || form.weight <= 0) {
      alert("कृपया सही वजन चुनें");
      setLoading(false);
      return;
    }

    const base = form.weight * rate;
    const making = (form.makingCharges / 100) * base;
    const subtotal = base + making;
    const gstAmount = (form.gst / 100) * subtotal;

    setPrice(subtotal + gstAmount);
    setLoading(false);
  };

  /* ----------------------- Styles ----------------------- */

  const inputClasses =
    "w-full border border-border rounded-lg px-3 py-2 bg-background";
  const labelClasses = "block mb-1 font-medium text-muted-foreground";

  useEffect(() => {
    if (!product ) return;

    const mappedPurity = productPurityMap[product.purity];

    if (!mappedPurity) {
      console.warn("Unsupported product purity:", product.purity);
      return;
    }

    const derivedCategory = categoryFromPurity(mappedPurity);

    setForm({
      category: derivedCategory,
      purity: mappedPurity,
      weight: product.weight,
      makingCharges: product.makingCharges,
      gst: product.gst,
    });
  }, [product]);

  /* ----------------------- UI ----------------------- */

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        

        {/* ---------------- Calculator Section ---------------- */}
        <div>
          <label className={labelClasses}>आभूषण का प्रकार</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`${inputClasses} mb-4`}
          >
            <option value="gold">सोना</option>
            <option value="silver">चाँदी</option>
          </select>

          <label className={labelClasses}>शुद्धता</label>
          <select
            name="purity"
            value={form.purity}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`${inputClasses} mb-4`}
          >
            {purityOptions.map((p) => (
              <option key={p} value={p}>
                {purityLabels[p]}
              </option>
            ))}
          </select>

          <label className={labelClasses}>वज़न (ग्राम)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className={`${inputClasses} mb-4`}
          />

          <label className={labelClasses}>मेकिंग चार्ज (%)</label>
          <input
            type="number"
            name="makingCharges"
            value={form.makingCharges}
            onChange={handleChange}
            className={`${inputClasses} mb-4`}
          />

          <label className={labelClasses}>GST (%)</label>
          <select
            name="gst"
            value={form.gst}
            onChange={handleChange}
            className={`${inputClasses} mb-6`}
          >
            <option value={3}>3%</option>
            <option value={5}>5%</option>
          </select>

          <button
            onClick={calculatePrice}
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-2 rounded-lg"
          >
            {loading ? "कैलकुलेट हो रहा है..." : "कैलकुलेट करें"}
          </button>

          {price !== null && (
            <div className="mt-6 p-4 bg-muted rounded-lg text-center">
              <h3 className="font-semibold mb-2">कुल कीमत</h3>
              <IndianRupeeRate
                rate={price}
                className="text-2xl font-bold text-accent"
              />
            </div>
          )}
        </div>

        {/* ---------------- Product Section ---------------- */}
        {product && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Calculate price of {product.name}</h2>
            <ProductGallery product={product} />
            <WhatsappClick product={product} />
            <HighlightsTabs product={product} />

          </div>
        )}
      </div>
    </div>
  );
}
