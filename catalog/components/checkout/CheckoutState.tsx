"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
import { getCart, saveCart } from "@/utils/cart";
import { useEffect, useMemo, useState } from "react";
import CartStep from "@/components/checkout/CartStep";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import { useRates } from "@/context/RateContext"
import { calculateFinal } from "@/utils/calculatePrice";


type CheckoutStep =
  | "CART"
  | "ADDRESS"
  | "PAYMENT"
  | "REVIEW";
export default function CheckoutState() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Cart>(() => getCart());
  const rates = useRates();
  const user = useAuth();
  const [step, setStep] = useState<CheckoutStep>("CART");
  const [address, setAddress] = useState<Address>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");



  useEffect(() => {
    async function hydrateCart() {
      try {
        // 1. Fetch the master product list
        const response = await fetch("/data/products.json");
        const allProducts = await response.json();

        // 2. Map existing cart items to full product objects
        const populatedItems = cart.items.map(item => {
          const fullProduct = allProducts.find((p: any) => p.id === item.productId);
          return { ...item, product: fullProduct };
        });

        // 3. Calculate initial totals
        // We use a functional update to ensure we have the latest state
        setCart(prev => {
          const updatedCart = {
            ...prev,
            items: populatedItems,
            priceSummary: {
              productTotal: 0, // Will update below
              shipping: 60.00,
              paymentMethod: "UPI",
            }
          };
          if (!rates) return;

          // Calculate final price using your utility
          updatedCart.priceSummary.productTotal = calculateFinal(updatedCart, rates);
          return updatedCart;
        });
      } catch (error) {
        console.error("Failed to hydrate cart:", error);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateCart();
  }, [rates]); // Re-run if rates change to keep pricing accurate

  /* ---------- DERIVED PRICING ---------- */
  const priceSummary = useMemo((): PriceSummaryType => {
    const productTotal = calculateFinal(cart, rates);
    const shipping = 60;
    const cod = paymentMethod === "COD" ? 200 : 0;

    // We return the object directly to satisfy the PriceSummaryType
    return {
      productTotal,
      shipping,
      cod:cod,
      finalPrice: productTotal + shipping + cod,
    };
  }, [cart, paymentMethod, rates]); // Specific dependencies are better than the whole 'cart'

  useEffect(() => saveCart(cart), [cart]);

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

  if (isLoading) {
  return (
    <div className="p-6 text-center text-muted">
      Loading your cart…
    </div>
  );
}

  if (!user) return null; // auth guard already exists

  return (
    <div className="max-w-5xl mx-auto p-4 bg-page">
      {step === "CART" && (
        <CartStep
          cart={cart}
          setCart={setCart}
          onNext={() => setStep("ADDRESS")}
        />
      )}

      {step === "ADDRESS" && (
        <AddressStep
          address={address}
          onSave={(addr) => setAddress(addr)}
          onNext={() => setStep("PAYMENT")}
          onBack={() => setStep("CART")}
        />
      )}

      {step === "PAYMENT" && (
        <PaymentStep
          method={paymentMethod}
          onChange={(m) => setPaymentMethod(m)}
          onNext={() => setStep("REVIEW")}
          onBack={() => setStep("ADDRESS")}
        />
      )}

      {step === "REVIEW" && (
        <ReviewStep
          cart={cart}
          address={address}
          paymentMethod={paymentMethod}
          priceSummary={priceSummary}
          onEditAddress={() => setStep("ADDRESS")}
          onEditPayment={() => setStep("PAYMENT")}
          onBack={() => setStep("PAYMENT")}
        />
      )}
    </div>
  );
}
