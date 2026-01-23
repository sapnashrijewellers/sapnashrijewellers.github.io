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


export default function CheckoutPage() {
  const rates = useRates();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuth();
  console.log(user);

  const productId = Number(searchParams.get("p"));

  //const productId = useMemo(() => searchParams.get("p"), [searchParams]);
  const variantIndex = Number(searchParams.get("v") ?? 0);

  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
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
        const p = products.find((x: Product) => x.id === 13);

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

    return calculatePrice({
      purity: product.purity,
      variant: product.variants[variantIndex],
      rates,
    });
  }, [product, variantIndex, rates]);

  const finalPrice =(COD_CHARGE > 0) ? SHIPPING + COD_CHARGE : 
    (vPop?.price ?? 0) + SHIPPING + COD_CHARGE;

  /* -------------------------------
     PLACE ORDER
  --------------------------------*/
  async function placeOrder() {
    if (!user || !product || !selectedVariant) return;

    await fetch("/api/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        productId: product.id,
        variantIndex,
        address,
        mobile,
        paymentMethod,
        finalPrice,
      }),
    });

    router.push("/thank-you");
  }

  if (!product || !selectedVariant) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 bg-page">
      <h1 className="text-2xl mb-4">Checkout</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard product={product} />
      </div>
      {/* Address */}
      <div className="bg-surface p-4 rounded-lg border border-theme mt-4">
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
      </div>

      {/* Payment */}
      <div className="bg-surface p-4 rounded-lg border border-theme mt-4">
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

      <UPIPaymentQR
    amount={finalPrice}
    orderId={`SSJ-${product.id}-${Date.now()}`}
  />

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          className="ssj-btn-outline"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </button>

        <button className="ssj-btn" onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
