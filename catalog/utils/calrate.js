// /**
//  * Returns the rate per gram for a product based on its category and purity.
//  * @param {object} product - The product object
//  * @param {object} rates - Rates object from DataContext
//  * @returns {number} - Rate per gram
//  */
// function getRatePerGram(product, rates) {
//   if (!rates) return 0;

//   const category = product.category?.toLowerCase() || "";

//   // Gold categories
//   if (category.includes("gold")) {
//     return rates.gold; // fallback    
//   }

//   // Silver categories
//   if (category.includes("silver")) {
//     return rates.silver; // fallback    
//   }

//   // Other / imitation items
//   return 0;
// }
