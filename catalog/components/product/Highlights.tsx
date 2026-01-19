"use client";

import { useState } from "react";
import { Product } from "@/types/catalog";


export function HighlightsTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("hindi");

  const hasHindi = product.highlights?.length > 0;
  const hasEnglish = product.englishHighlights?.length > 0;

  if (!hasHindi && !hasEnglish) return null;

  return (
    <div className="mt-4">
      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b border-theme mb-3">
        {hasHindi && (
          <button
            onClick={() => setActiveTab("hindi")}
            className={`ssj-btn pb-2 transition-all font-medium ${
              activeTab === "hindi"
                ? "border-b-2 border-primary bg-accent rounded-br-none rounded-bl-none"
                : "text-normal bg-page"
            }`}
          > 
            Hindi
          </button>
        )}

        {hasEnglish && (
          <button
            onClick={() => setActiveTab("english")}
            className={`ssj-btn pb-2 transition-all font-medium ${
              activeTab === "english"
                ? "border-b-2 border-primary bg-accent rounded-br-none rounded-bl-none"
                : "text-normal bg-page"
            }`}
          >
            English
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "hindi" && hasHindi && (
        <ul className="list-disc space-y-1 text-sm mb-4 px-4">
          {product.highlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}

      {activeTab === "english" && hasEnglish && (
        <ul className="list-disc space-y-1 text-sm mb-4 px-4">
          {product.englishHighlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
