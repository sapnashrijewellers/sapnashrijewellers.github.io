"use client";

import { useState } from "react";
import { FaWhatsapp, FaPlus, FaMinus } from "react-icons/fa";
import { Product } from "@/types/catalog";

const WHATSAPP_NUMBER = "918234042231";
const baseURL = process.env.BASE_URL;

const BulkEnquiry = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [requirements, setRequirements] = useState("");

  const productUrl = `${baseURL}/product/${product.slug}`;

  const message = `
Hi,

I am interested in a bulk enquiry for the product below:

🔹 Product: ${product.name}
🔹 Product Link: ${productUrl}
🔹 Quantity: ${quantity || "Not specified"}

📝 Additional Requirements:
${requirements || "None"}

Please share best price and delivery timeline.
`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="border border-theme rounded-xl bg-surface">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-primary-dark text-lg">
          Bulk Enquiry
        </span>

        <span className="">
          {open ? <FaMinus /> : <FaPlus />}
        </span>
      </button>

      {/* Collapsible Content */}
      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Quantity */}
          <div>
            <label className="labelClasses">Required Quantity</label>
            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="inputClasses"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="labelClasses">
              Additional Requirements (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Size, customization, delivery date, engraving, etc."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="inputClasses"
            />
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-800 text-white! px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition"
          >
            <FaWhatsapp className="text-2xl" />
            Send Enquiry on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

export default BulkEnquiry;
