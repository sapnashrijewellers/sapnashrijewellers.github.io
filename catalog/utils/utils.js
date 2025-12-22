export default function formatPurity(purity) {
  switch (purity) {
    case "silver":
      return "Silver 99.9%";
    case "silverJewellery":
      return "Silver Jewellery";
    case "gold24K":
      return "Gold 24K 999";
    case "gold22K":
      return "Gold 22K 916";
    case "gold18K":
      return "Gold 18K 75%";
    default:
      return purity; // fallback in case new purity is added
  }
}