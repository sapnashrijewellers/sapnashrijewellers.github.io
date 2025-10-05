import React, { useState, useEffect } from "react";
import IndianRupeeRate from "../components/IndianRupeeRate";
import { useData } from "../context/DataContext";

const Calculator = () => {
  const { rates } = useData();

  const initialProd = {
    category: "gold",
    purity: "gold22K",
    weight: 10,
    makingCharges: 7,
    gst: 3,
  };

  const [form, setForm] = useState(initialProd);
  const [purityOptions, setPurityOptions] = useState([]);
  const [price, setPrice] = useState(null);

  // map for user-friendly labels
  const purityLabels = {    
    gold22K: "सोना (22K)",
    gold24K: "सोना (24K)",
    gold18K: "सोना (18K)",
    silver: "चाँदी (99.9)",
    silverJewellery: "चाँदी (जेवर)",
  };

  // Update purity dropdown when category changes
  useEffect(() => {
    if (!rates) return;

    let options = [];
    if (form.category === "gold") {
      options = ["gold24K", "gold22K", "gold18K"];
    } else {
      options = ["silver", "silverJewellery"];
    }

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
    if (form.purity === "silverJewellery") {
      return rates.silver * 0.92;
    }
    return rates[form.purity] || 0;
  };

  const calculatePrice = () => {
    const weight = parseFloat(form.weight);
    const mcPercent = parseFloat(form.makingCharges);
    const gstPercent = parseFloat(form.gst);
    const rate = getRatePerGram();

    if (!rate || isNaN(weight)) {
      alert("कृपया सही वजन और शुद्धता चुनें");
      return;
    }

    const basePrice = weight * rate;
    const makingCharges = (mcPercent / 100) * basePrice;
    const totalBeforeGst = basePrice + makingCharges;
    const gstAmount = (gstPercent / 100) * totalBeforeGst;
    const finalPrice = totalBeforeGst + gstAmount;

    setPrice(finalPrice); // ✅ keep as number
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        ज्वेलरी प्राइस कैलकुलेटर
      </h2>

      {/* Category */}
      <label className="block mb-2 font-medium">आभूषण का प्रकार</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="bg-white text-black dark:bg-gray-900 dark:text-white w-full border rounded p-2 mb-4"
      >
        <option value="gold">सोना</option>
        <option value="silver">चाँदी</option>
      </select>

      {/* Purity */}
      <label className="block mb-2 font-medium">
        शुद्धता
      </label>
      <select
        name="purity"
        value={form.purity}
        onChange={handleChange}
        className="bg-white text-black dark:bg-gray-900 dark:text-white w-full border rounded p-2 mb-4"
      >
        {purityOptions.map((p) => (
          <option key={p} value={p}>
            {purityLabels[p]}
          </option>
        ))}
      </select>

      {/* Weight */}
      <label className="block mb-2 font-medium">वज़न (grams)</label>
      <input
        type="number"
        name="weight"
        value={form.weight}
        onChange={handleChange}
        className="bg-white text-black dark:bg-gray-900 dark:text-white w-full border rounded p-2 mb-4"
      />

      {/* Making Charges */}
      <label className="block mb-2 font-medium">आभूषण बनाने का शुल्क (%)</label>
      <input
        type="number"
        name="makingCharges"
        value={form.makingCharges}
        onChange={handleChange}
        className="bg-white text-black dark:bg-gray-900 dark:text-white w-full border rounded p-2 mb-4"
      />

      {/* GST */}
      <label className="block mb-2 font-medium">GST (%)</label>
      <select
        name="gst"
        value={form.gst}
        onChange={handleChange}
        className="bg-white text-black dark:bg-gray-900 dark:text-white w-full border rounded p-2 mb-4"
      >
        <option value="3">3%</option>
        <option value="5">5%</option>
      </select>

      <button
        onClick={calculatePrice}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        कैलकुलेट
      </button>

      {price !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-black">कुल कीमत</h3>

          <IndianRupeeRate rate={Number(price)} className="text-2xl font-bold text-green-800" /> {/* ✅ ensure number */}
        </div>
      )}
    </div>
  );
};

export default Calculator;
