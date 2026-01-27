// "use client"
// import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
// import { fireConfetti } from "@/components/checkout/FireConfetti";
// import { useState } from "react";
// import {PackageCheck} from "lucide-react"

// export default function PlaceOrderButton({
//     cart, address, paymentMethod, priceSummary, className }: {
//         cart: Cart,
//         address: Address | undefined,
//         paymentMethod: PaymentMethod,
//         priceSummary: PriceSummaryType,
//         className: string
//     }) {
//     const product = cart.items[0].product;
//     const selectedVariant = cart.items[0].product.variants[cart.items[0].variantIndex];

//     if (!priceSummary && !address && !paymentMethod)
//         return;





//     function buildWhatsAppMessage() {
//   if (!address || !cart?.items?.length) return;

//   const productLines = cart.items
//     .map((item, index) => {
//       const variant = item.product.variants[item.variantIndex];
//       return `
// ${index + 1}. ${item.product.name}
//    Variant: ${variant?.size ?? "-"}
//    Qty: ${item.qty}
//    Link: ${process.env.NEXT_PUBLIC_BASE_URL}/product/${item.product.slug}
//       `.trim();
//     })
//     .join("\n\n");

//   return `
// 🛍️ Order Details

// 👤 Name: ${address.name || "Customer"}
// 📞 Mobile: ${address.mobile}

// 📍 Delivery Address:
// ${address.address}
// City: ${address.city}
// Pin Code: ${address.pin}

// 💍 Products:
// ${productLines}

// 💰 Price Summary:
// Products Total: ₹${priceSummary?.productTotal}
// Shipping: ₹${priceSummary?.shipping ?? 0}
// ${paymentMethod === "COD" && priceSummary?.cod
//   ? `COD Charge: ₹${priceSummary.cod}`
//   : ""}
// Total: ₹${priceSummary?.finalPrice}

// 💳 Payment Method: ${paymentMethod}

// 🙏 Please confirm availability.
//   `.trim();
// }



//     function sendWhatsAppMessage() {
//         const message = buildWhatsAppMessage();
//         const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
//         window.open(url, "_blank");
//     }

//     async function placeOrder() {
//         if (!product || !selectedVariant) return;

//         fireConfetti();
//         setOrderPlaced(true);

//         // Optional auto-open WhatsApp after 1s
//         setTimeout(sendWhatsAppMessage, 1000);
//     }
//     const [orderPlaced, setOrderPlaced] = useState(false);

//     return (
//         <div className="w-full">
//             <button className={`ssj-btn bg-amber-500 ${className}`} onClick={placeOrder}>
//                 <PackageCheck size={40}/>
//                 Place Order
//             </button>


//             {orderPlaced && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//                     <div className="bg-surface p-8 rounded-xl text-center max-w-md w-full border border-theme">
//                         <h2 className="text-2xl mb-2 font-yatra">
//                             🎉 Order Placed Successfully!
//                         </h2>
//                         <p className="text-muted mb-4">
//                             Thank you for shopping with Sapna Shri Jewellers
//                         </p>

//                         <button
//                             className="ssj-btn w-full"
//                             onClick={sendWhatsAppMessage}
//                         >

//                             Send Order on WhatsApp
//                         </button>

//                     </div>
//                 </div>
//             )}
//         </div>
//     );

// }