// import { useRates } from "@/hooks/useRates";
// import { Product } from "@/types/catalog";
// import { calculatePrice } from "@/utils/calculatePrice";

// export default function CalculatePrice({ product }: { product: Product }) {
//   const { rates, isLoading } = useRates();

//   if (isLoading || !rates) {
//     return (
//       <div className="text-sm text-muted animate-pulse">
//         Calculating price…
//       </div>
//     );
//   }

//   if (!rates.silverJewelry) return null;

//   const price = calculatePrice({
//     product,
//     rates
//   });

//   return (
//     <div className="text-lg font-semibold text-primary-dark">
//       Estimated Price: ₹{price?.toLocaleString("en-IN")}
//     </div>
//   );
// }
