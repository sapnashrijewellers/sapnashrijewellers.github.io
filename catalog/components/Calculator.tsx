"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import IndianRupeeRate from "@/components/common/IndianRupeeRate";
import products from "@/data/products.json";
import { Product } from "@/types/catalog";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import WhatsappClick from "@/components/product/WhatAppClick";
import { CalculatorForm, CalcRates, Purity, MetalCategory } from "@/types/catalog"

/* ----------------------------- Types ----------------------------- */




/* --------------------------- Component --------------------------- */

export default function Calculator() {
  const searchParams = useSearchParams();

  /* -------------------- Product from query -------------------- */

  const productId = Number(searchParams.get("pid"));

  const product: Product | undefined = useMemo(() => {
    if (!productId || Number.isNaN(productId)) return undefined;
    return products.find((p) => p.id === productId);
  }, [productId]);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMakingChargeNotice, setShowMakingChargeNotice] = useState(false);
  const lockProductFields = Boolean(product);

  /* ----------------------- Constants ----------------------- */

  const defaultPurityByCategory: Record<MetalCategory, Purity> = {
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

  const categoryFromPurity = (purity: Purity): MetalCategory =>
    purity.startsWith("gold") ? "gold" : "silver";

  const [form, setForm] = useState<CalculatorForm>({
    
    category: (product && lockProductFields) ? (product.purity.startsWith("चाँदी") ? "silver" : "gold") : "gold",
    purity: (product && lockProductFields) ? productPurityMap[product.purity] : "gold22K",
    weight: (product && lockProductFields) ? product.weight : 10,
    makingCharges: lockProductFields ? 0 : 7,
    gst: 3,
  });  

  const purityOptions: Purity[] =
    form.category === "gold"
      ? ["gold24K", "gold22K", "gold18K"]
      : ["silver", "silverJewellery"];

  const purityLabels: Record<Purity, string> = {
    gold24K: "सोना (24K)",
    gold22K: "सोना (22K)",
    gold18K: "सोना (18K)",
    silver: "चाँदी (99.9)",
    silverJewellery: "चाँदी (जेवर)",
  };

  /* ----------------------- Handlers ----------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    if (lockProductFields && (name === "category" || name === "purity")) {
      return;
    }

    setForm((prev) => {
      if (name === "category") {
        const category = value as MetalCategory;
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

  const fetchRates = async (): Promise<CalcRates | null> => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/rate/rates.json`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load rates");
      return (await res.json()) as CalcRates;
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

    if (lockProductFields && form.makingCharges === 0) {
      setShowMakingChargeNotice(true);
      return;
    } else {
      setShowMakingChargeNotice(false);
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
        : rates[form.purity as keyof CalcRates];

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


  function setFormFields() {
    if (!product) {
      setShowMakingChargeNotice(false);
      return;
    }

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
      makingCharges: lockProductFields ? 0 : 7, // 🔒 forced
      gst: 3,
    });

    // ✅ show notice ONLY for product-based calculator
    setShowMakingChargeNotice(true);
  }

  //setFormFields();

  useEffect(() => {
    setFormFields();
  }, [product]);

  /* ----------------------- UI ----------------------- */

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* ---------------- Calculator Section ---------------- */}
        <div>
          <label className="labelClasses">आभूषण का प्रकार</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`inputClasses mb-4`}
          >
            <option value="gold">सोना</option>
            <option value="silver">चाँदी</option>
          </select>

          <label className={`labelClasses`}>शुद्धता</label>
          <select
            name="purity"
            value={form.purity}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`inputClasses mb-4`}
          >
            {purityOptions.map((p) => (
              <option key={p} value={p}>
                {purityLabels[p]}
              </option>
            ))}
          </select>

          <label className={`labelClasses`}>वज़न (ग्राम)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className={`inputClasses mb-4`}
          />

          <label className={`labelClasses`}>मेकिंग चार्ज (%)</label>
          <input
            type="number"
            name="makingCharges"
            value={form.makingCharges}
            onChange={handleChange}
            className={`inputClasses mb-4`}
          />

          <label className={`labelClasses`}>GST (%)</label>
          <select
            name="gst"
            value={form.gst}
            onChange={handleChange}
            className={`inputClasses mb-6`}
          >
            <option value={3}>3%</option>
          </select>

          <div className="mb-4 p-4 rounded-lg text-sm bg-highlight"
            title="Making charges vary from product to product. Please contact us on WhatsApp for exact making charges.">
            <p className="font-medium mb-1">
              मेकिंग चार्ज हर आभूषण में अलग होता है। यह डिज़ाइन, कारीगरी और वज़न पर निर्भर करता है।
            </p>
            <p className="mb-2">
              सटीक मेकिंग चार्ज जानने के लिए कृपया हमसे WhatsApp पर संपर्क करें।
            </p>
            {product && <WhatsappClick product={product} />}
          </div>

          <button
            onClick={calculatePrice}
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-2 rounded-lg"
          >
            {loading ? "कैलकुलेट हो रहा है..." : "कैलकुलेट करें"}
          </button>

          {price !== null && !showMakingChargeNotice && (
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
            <HighlightsTabs product={product} />
          </div>
        )}
      </div>
    </div>
  );
}
