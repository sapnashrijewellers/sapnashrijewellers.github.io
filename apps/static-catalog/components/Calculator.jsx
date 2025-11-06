"use client"; // ✅ Must be the first line

import { useState } from "react";
import IndianRupeeRate from "@/components/IndianRupeeRate";

export default function Calculator({ rates }) {
  const [form, setForm] = useState({
    category: "gold",
    purity: "gold22K",
    weight: 10,
    makingCharges: 7,
    gst: 3,
  });
  const [price, setPrice] = useState(null);

  const purityLabels = {
    gold24K: "सोना (24K)",
    gold22K: "सोना (22K)",
    gold18K: "सोना (18K)",
    silver: "चाँदी (99.9)",
    silverJewellery: "चाँदी (जेवर)",
  };

  const purityOptions =
    form.category === "gold"
      ? ["gold24K", "gold22K", "gold18K"]
      : ["silver", "silverJewellery"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getRatePerGram = () => {
    if (!rates) return 0;
    return form.purity === "silverJewellery"
      ? rates.silver * 0.92
      : rates[form.purity] || 0;
  };

  const calculatePrice = () => {
    const weight = parseFloat(form.weight);
    const mcPercent = parseFloat(form.makingCharges);
    const gstPercent = parseFloat(form.gst);
    const rate = getRatePerGram();

    if (!rate || isNaN(weight) || weight <= 0) {
      alert("कृपया सही वजन और शुद्धता चुनें");
      return;
    }

    const basePrice = weight * rate;
    const makingCharges = (mcPercent / 100) * basePrice;
    const totalBeforeGst = basePrice + makingCharges;
    const gstAmount = (gstPercent / 100) * totalBeforeGst;
    const finalPrice = totalBeforeGst + gstAmount;

    setPrice(finalPrice);
  };

  const inputClasses =
    "w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:outline-none transition";
  const labelClasses = "block mb-1 font-medium text-muted-foreground";

  return (
    <>
      {/* Category */}
      <label className={labelClasses}>आभूषण का प्रकार</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className={`${inputClasses} mb-4`}
      >
        <option value="gold">सोना</option>
        <option value="silver">चाँदी</option>
      </select>

      {/* Purity */}
      <label className={labelClasses}>शुद्धता</label>
      <select
        name="purity"
        value={form.purity}
        onChange={handleChange}
        className={`${inputClasses} mb-4`}
      >
        {purityOptions.map((p) => (
          <option key={p} value={p}>
            {purityLabels[p]}
          </option>
        ))}
      </select>

      {/* Weight */}
      <label className={labelClasses}>वज़न (ग्राम में)</label>
      <input
        type="number"
        name="weight"
        value={form.weight}
        onChange={handleChange}
        className={`${inputClasses} mb-4`}
      />

      {/* Making Charges */}
      <label className={labelClasses}>आभूषण बनाने का शुल्क (%)</label>
      <input
        type="number"
        name="makingCharges"
        value={form.makingCharges}
        onChange={handleChange}
        className={`${inputClasses} mb-4`}
      />

      {/* GST */}
      <label className={labelClasses}>GST (%)</label>
      <select
        name="gst"
        value={form.gst}
        onChange={handleChange}
        className={`${inputClasses} mb-6`}
      >
        <option value="3">3%</option>
        <option value="5">5%</option>
      </select>

      <button
        onClick={calculatePrice}
        className="w-full bg-accent text-accent-foreground font-semibold py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-accent/90 transition"
      >
        कैलकुलेट करें
      </button>

      {price !== null && (
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">कुल कीमत</h3>
          <IndianRupeeRate
            rate={Number(price)}
            className="text-2xl font-bold text-accent"
          />
        </div>
      )}
    </>
  );
}
