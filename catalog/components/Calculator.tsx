"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import IndianRupeeRate from "@/components/common/IndianRupeeRate";
import products from "@/data/products.json";
import { Product } from "@/types/catalog";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import WhatsappClick from "@/components/product/WhatAppClick";
import { CalculatorForm, CalcRates } from "@/types/catalog"


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

  const [form, setForm] = useState<CalculatorForm>({
    purity: product ? product.purity : "gold22K",
    weight: product ? product.weight : 10,
    makingCharges: product ? "" : 3.5, // ✅ blank if product-based
    gst: 3,
  });

  /* ----------------------- Handlers ----------------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (lockProductFields && name === "purity") return;

    setForm(prev => ({
      ...prev,
      [name]:
        name === "makingCharges"
          ? value === "" ? "" : Number(value)
          : e.target.type === "number"
            ? Number(value)
            : value,
    }));
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
    if (lockProductFields && form.makingCharges === "") {
      setShowMakingChargeNotice(true);
      return;
    }

    setShowMakingChargeNotice(false);
    setLoading(true);
    setPrice(null);

    const rates = await fetchRates();
    if (!rates) return setLoading(false);

    const rate =
      form.purity === "silverJewellery"
        ? rates.silver * 0.92
        : rates[form.purity as keyof CalcRates];

    if (!rate || form.weight <= 0) {
      alert("कृपया सही वजन चुनें");
      setLoading(false);
      return;
    }

    const makingPercent = Number(form.makingCharges);
    const base = form.weight * rate;
    const making = (makingPercent / 100) * base;
    const subtotal = base + making;
    const gstAmount = (form.gst / 100) * subtotal;

    setPrice(subtotal + gstAmount);
    setLoading(false);
  };


  useEffect(() => {
    if (!product) return;

    setForm({
      purity: product.purity,
      weight: product.weight,
      makingCharges: "", // ✅ blank
      gst: 3,
    });

    setShowMakingChargeNotice(false);
  }, [product]);

  /* ----------------------- UI ----------------------- */

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* ---------------- Calculator Section ---------------- */}
        <div>
          <label className={`labelClasses`}>Purity</label>
          <select
            name="purity"
            value={form.purity}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`inputClasses mb-4`}
          >
            <option value="gold22K">Gold 22K</option>
            <option value="gold24K">Gold 24K</option>
            <option value="gold18K">Gold 18K</option>
            <option value="silver">Silver 99%</option>
            <option value="silverJewellery">Silver Jewellery</option>

          </select>

          <label className={`labelClasses`}>Weight (gm)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            disabled={lockProductFields}
            className={`inputClasses mb-4`}
          />

          <label className={`labelClasses`}>Making Charges (%)</label>
          <input
            type="number"
            name="makingCharges"
            value={form.makingCharges}
            onChange={handleChange}
            placeholder="WhatsApp for charges"
            className="inputClasses mb-4"
            min="0"
            max="100"
          />
          {showMakingChargeNotice && (
            <p className="text-sm text-red-600 mt-2">
              * Please contact on WhatsApp to get exact making changes.
            </p>
          )}
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
            {loading ? "कैलकुलेट हो रहा है..." : "Calculate Final Price"}
          </button>

          {price !== null && !showMakingChargeNotice && (
            <div className="mt-6 p-4 bg-muted rounded-lg text-center">
              <h3 className="font-semibold mb-2">Final Price</h3>
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
