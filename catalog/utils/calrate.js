/**
 * Returns the rate per gram for a product based on its category and purity.
 * @param {object} product - The product object
 * @param {object} rates - Rates object from DataContext
 * @returns {number} - Rate per gram
 */
function getRatePerGram(product, rates) {
  if (!rates) return 0;

  const category = product.category?.toLowerCase() || "";

  // Gold categories
  if (category.includes("gold")) {
    switch (product.purity) {
      case "24K":
        return rates.gold24K;
      case "22K":
        return rates.gold22K;
      case "18K":
        return rates.gold18K;
      default:
        return rates.gold24K; // fallback
    }
  }

  // Silver categories
  if (category.includes("silver")) {
    switch (product.purity) {
      case "पाठ की चाँदी":
        return rates.silver;
      case "चाँदी जेवर":
        return rates.silver * (0.92);
      default:
        return rates.silver; // fallback
    }
  }

  // Other / imitation items
  return 0;
}

/**
 * Calculates the final price for a product.
 * @param {object} product - The product object
 * @param {object} rates - Rates object from DataContext
 * @returns {number} - Final calculated price
 */
export function calculatePrice(product, rates) {
  if (!rates) return 0;
  
  const rate = getRatePerGram(product, rates);
  
  const basePrice = product.weight * rate;
  
  const mc = basePrice * (product.makingCharges / 100)
  
  const base = basePrice + mc;
  
  const gst = (rates.gstPercent / 100) * base;

  return base + gst;
}
