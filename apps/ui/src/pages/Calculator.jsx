import React, { useState, useEffect } from "react";
import IndianRupeeRate from "../components/IndianRupeeRate";
import { useData } from "../context/DataContext";
import { renderSEOTags } from "../utils/SEO";

// ✅ Dynamic Open Graph + Twitter meta tags

const title = `ज्वेलरी प्राइस कैलकुलेटर`;
const description = `ज्वेलरी प्राइस कैलकुलेटर | Jewellery Price Calculator | Sapna Shri Jewellers`;
const baseURL = "https://sapnashrijewellers.github.io";  
const imageUrl = `${baseURL}/logo.png`;


export default function Calculator() {
  const { rates } = useData();

  const initialState = {
    category: "gold",
    purity: "gold22K",
    weight: 10,
    makingCharges: 7,
    gst: 3,
  };

  const [form, setForm] = useState(initialState);
  const [purityOptions, setPurityOptions] = useState([]);
  const [price, setPrice] = useState(null);

  // user-friendly purity labels
  const purityLabels = {
    gold24K: "सोना (24K)",
    gold22K: "सोना (22K)",
    gold18K: "सोना (18K)",
    silver: "चाँदी (99.9)",
    silverJewellery: "चाँदी (जेवर)",
  };

  // dynamically update purity options on category change
  useEffect(() => {
    if (!rates) return;

    const options =
      form.category === "gold"
        ? ["gold24K", "gold22K", "gold18K"]
        : ["silver", "silverJewellery"];

    setPurityOptions(options);

    if (!options.includes(form.purity)) {
      setForm((prev) => ({ ...prev, purity: options[0] }));
    }
  }, [form.category, rates]);

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
      {renderSEOTags(
        title,
        description,
        imageUrl,
        `${baseURL}/about-us`,
        baseURL,
        null
      )}
    <div className="max-w-lg mx-auto p-6 bg-card text-card-foreground shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-accent">
        ज्वेलरी प्राइस कैलकुलेटर
      </h2>

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

      {/* Calculate Button */}
      <button
        onClick={calculatePrice}
        className="
          w-full bg-accent text-accent-foreground font-semibold
          py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-accent/90
          transition
        "
      >
        कैलकुलेट करें
      </button>

      {/* Result Section */}
      {price !== null && (
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">कुल कीमत</h3>
          <IndianRupeeRate
            rate={Number(price)}
            className="text-2xl font-bold text-accent"
          />
        </div>
      )}
    </div>
    </>
  );
}
