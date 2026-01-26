"use client"
import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
import { fireConfetti } from "@/components/checkout/FireConfetti";
import { useState } from "react";
import Link from "next/link";

export default function PayViaUPIButton({ 
    cart,address,paymentMethod, priceSummary }: { 
        cart: Cart,
    address: Address | undefined,paymentMethod:PaymentMethod, priceSummary: PriceSummaryType }) {
    const product = cart.items[0].product;    
    const selectedVariant = cart.items[0].product.variants[cart.items[0].variantIndex];
    
    if (!priceSummary && !address && !paymentMethod)
        return;
    function buildWhatsAppMessage() {
        if(!address) return;
        return `
🛍️ 

👤 Name: ${address.name || "Customer"}
📞 Mobile: ${address.mobile}

📍 Delivery Address:
${address.address}
City: ${address.city}
Pincode: ${address.pin}

💍 Product:
${product.name}
Variant: ${selectedVariant?.size}

🔗 Product Link:
${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}

💰 Price Summary:
Product: ₹${priceSummary?.productTotal}
Shipping: ₹60
${paymentMethod === "COD" ? "COD Charge: ₹200" : ""}
Total: ₹${priceSummary?.finalPrice}

💳 Payment Method: ${paymentMethod}

🙏 Please confirm availability.
  `.trim();
    }

    function sendWhatsAppMessage() {
        const message = buildWhatsAppMessage();
        const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }

    async function placeOrder() {
        if (!product || !selectedVariant) return;

        fireConfetti();
        setOrderPlaced(true);

        // Optional auto-open WhatsApp after 1s
        setTimeout(sendWhatsAppMessage, 1000);
    }
    const [orderPlaced, setOrderPlaced] = useState(false);

    return (
        <div>
            <button className="ssj-btn m-2" onClick={placeOrder}>
                Place Order
            </button>
            <div className="text-xs p-2 text-right">
                By clicking “Place Order”, you agree to our &nbsp;
                <Link href={`/policies/terms/`} className="underline">Terms</Link>
                &nbsp;and &nbsp;
                <Link href={`/policies/privacy/`} className="underline">Privacy Policy</Link>.
            </div>

            {orderPlaced && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-surface p-8 rounded-xl text-center max-w-md w-full border border-theme">
                        <h2 className="text-2xl mb-2 font-yatra">
                            🎉 Order Placed Successfully!
                        </h2>
                        <p className="text-muted mb-4">
                            Thank you for shopping with Sapna Shri Jewellers
                        </p>

                        <button
                            className="ssj-btn w-full"
                            onClick={sendWhatsAppMessage}
                        >
                            Send Order on WhatsApp
                        </button>

                    </div>
                </div>
            )}
        </div>
    );

}