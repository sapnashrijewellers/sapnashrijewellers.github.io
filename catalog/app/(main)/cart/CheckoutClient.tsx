"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/catalog"
import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import UPIPaymentQR from "@/components/UPIPaymentQR"
import Link from "next/link";
import confetti from "canvas-confetti";
const [step, setStep] = useState<CheckoutStep>("CART");


export default function CheckoutPage() {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const rates = useRates();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuth();
  console.log(user);

  const productId = Number(searchParams.get("p"));
  const variantIndex = Number(searchParams.get("v"));
  const [product, setProduct] = useState<Product | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"UPI" | "COD">("UPI");

  /* -------------------------------
     AUTH GUARD (SINGLE SOURCE)
  --------------------------------*/
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        await signInWithPopup(auth, googleProvider);
      }
    });
    return () => unsub();
  }, []);

  /* -------------------------------
     FETCH PRODUCT
  --------------------------------*/
  useEffect(() => {
    console.log(productId);
    if (!productId) return;

    fetch("/data/products.json")
      .then((r) => r.json())
      .then((products) => {
        const p = products.find((x: Product) => x.id === productId);

        if (!p) {
          router.replace("/");
          return;
        }

        // ✅ Validate variant index
        if (
          Number.isNaN(variantIndex) ||
          variantIndex < 0 ||
          variantIndex >= p.variants.length
        ) {
          router.replace("/");
          return;
        }

        setProduct(p);
      });
  }, [productId, variantIndex, router]);

  /* -------------------------------
     DERIVED VARIANT (SAFE)
  --------------------------------*/
  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return product.variants[variantIndex];
  }, [product, variantIndex]);

  /* -------------------------------
     PRICE
  --------------------------------*/
  const SHIPPING = 60;
  const COD_CHARGE = paymentMethod === "COD" ? 200 : 0;
  const vPop = useMemo(() => {
    if (!product) return null;
    if (!product.variants?.[variantIndex]) return null;
    if (!rates) return null;
    console.log('varient: ', product.variants?.[variantIndex]);
    return calculatePrice({
      purity: product.purity,
      variant: product.variants?.[variantIndex],
      rates,
    });
  }, [product, variantIndex, rates]);

  const finalPrice = (COD_CHARGE > 0) ? SHIPPING + COD_CHARGE :
    (vPop?.price ?? 0) + SHIPPING + COD_CHARGE;

  /* -------------------------------
     PLACE ORDER
  --------------------------------*/
  async function placeOrder() {
    if (!user || !product || !selectedVariant) return;

    fireConfetti();
    setOrderPlaced(true);

    // Optional auto-open WhatsApp after 1s
    setTimeout(sendWhatsAppMessage, 1000);
  }

  if (!product || !selectedVariant) return null;

  function sendWhatsAppMessage() {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  function openUPI() {
    const amount = finalPrice.toFixed(2);

    const upiUrl = `upi://pay?pa=mab.037326019610011@axisbank&pn=Sapna%20Shri%20Jewellers&am=${amount}&cu=INR&tn=Order-${product?.id}`;

    window.location.href = upiUrl;
  }

  function buildWhatsAppMessage() {
    return `
🛍️ 

👤 Name: ${user?.displayName || "Customer"}
📞 Mobile: ${mobile}

📍 Delivery Address:
${address}
City: ${city}
Pincode: ${pin}

💍 Product:
${product?.name}
Variant: ${selectedVariant?.size}

🔗 Product Link:
${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}

💰 Price Summary:
Product: ₹${vPop?.price}
Shipping: ₹60
${paymentMethod === "COD" ? "COD Charge: ₹200" : ""}
Total: ₹${finalPrice}

💳 Payment Method: ${paymentMethod}

🙏 Please confirm availability.
  `.trim();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 bg-page">
      <h1 className="text-2xl mb-4">Checkout</h1>
      <div className="grid grid-cols-1 ">
        <ProductCard product={product} variant={variantIndex} />
      </div>
      {/* Address */}
      <div className="bg-surface p-4 rounded-lg border border-default mt-4">
        <label className="labelClasses">Delivery Address</label>
        <textarea
          className="inputClasses"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="labelClasses mt-3">Mobile</label>
        <input
          className="inputClasses"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <label className="labelClasses mt-3">City</label>
        <input
          className="inputClasses"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label className="labelClasses mt-3">Pin Code</label>
        <input
          className="inputClasses"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="bg-surface p-4 rounded-lg border border-default mt-4">
        <label className="labelClasses mt-3">Choose Payment Method</label>
        <label className="flex gap-2">
          <input
            type="radio"
            checked={paymentMethod === "UPI"}
            onChange={() => setPaymentMethod("UPI")}
          />
          UPI
        </label>

        <label className="flex gap-2 mt-2">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          COD (+₹200)
        </label>
      </div>
      {paymentMethod === "COD" && (
        <div className="mt-3 rounded-md border border-primary bg-surface p-3 text-sm text-normal">
          <strong>Cash on Delivery Selected</strong>
          <p className="mt-1">
            You will pay <strong>₹{SHIPPING + COD_CHARGE}</strong> now for shipping and COD charges.
            <br />
            <strong>Product price will be paid at the time of delivery.</strong>
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 text-right">
        <p>Shipping: ₹60</p>
        {paymentMethod === "COD" && <p>COD: ₹200</p>}
        <p className="font-bold text-lg">
          Total: ₹{finalPrice}
        </p>
      </div>

      <button className="ssj-btn w-full" onClick={openUPI}>
        Pay ₹{finalPrice} via UPI
      </button>

      <UPIPaymentQR
        amount={finalPrice}
        orderId={`SSJ-${product.id}-${Date.now()}`}
      />



      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          className="border border-default rounded-xl p-2 cursor-pointer m-2"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </button>

        <button className="ssj-btn m-2" onClick={placeOrder}>
          Place Order
        </button>
      </div>
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


function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });

  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { x: 0.2, y: 0.4 },
    });
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { x: 0.8, y: 0.4 },
    });
  }, 300);
}

