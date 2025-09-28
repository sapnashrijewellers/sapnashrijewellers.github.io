import React, { useState } from "react";

const Calculator = () => {
  // Example rates (₹ per gram) - replace with live rates if available
  const rates = {
    gold: {
      "24K": 6200,
      "22K": 5700,
      "18K": 4700,
    },
    silver: {
      "silver jewellery": 80,
      "silver 99.9": 85,
    },
  };

  const [form, setForm] = useState({
    type: "gold",
    purity: "24K",
    weight: "",
    makingCharges: "",
    gst: "3",
  });

  const [price, setPrice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const calculatePrice = () => {
    const { type, purity, weight, makingCharges, gst } = form;

    if (!weight || isNaN(weight)) {
      alert("Please enter a valid weight");
      return;
    }

    const baseRate = rates[type][purity];
    const basePrice = baseRate * parseFloat(weight);

    const makingChargeAmt =
      (basePrice * (parseFloat(makingCharges) || 0)) / 100;

    const subtotal = basePrice + makingChargeAmt;

    const gstAmt = (subtotal * parseFloat(gst)) / 100;

    const finalPrice = subtotal + gstAmt;

    setPrice(finalPrice.toFixed(2));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Jewellery Price Calculator
      </h2>

      {/* Type */}
      <label className="block mb-2 font-medium">Type</label>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
      </select>

      {/* Purity */}
      <label className="block mb-2 font-medium">Purity</label>
      <select
        name="purity"
        value={form.purity}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        {Object.keys(rates[form.type]).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Weight */}
      <label className="block mb-2 font-medium">Weight (grams)</label>
      <input
        type="number"
        name="weight"
        value={form.weight}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
        placeholder="Enter weight in grams"
      />

      {/* Making Charges */}
      <label className="block mb-2 font-medium">Making Charges (%)</label>
      <input
        type="number"
        name="makingCharges"
        value={form.makingCharges}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
        placeholder="e.g. 10"
      />

      {/* GST */}
      <label className="block mb-2 font-medium">GST (%)</label>
      <select
        name="gst"
        value={form.gst}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="3">3%</option>
        <option value="5">5%</option>
      </select>

      <button
        onClick={calculatePrice}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Calculate
      </button>

      {price && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Final Price</h3>
          <p className="text-2xl font-bold text-green-800">₹ {price}</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
