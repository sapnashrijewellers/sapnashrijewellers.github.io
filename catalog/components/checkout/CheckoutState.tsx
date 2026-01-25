"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Cart, Address } from "@/types/catalog";
import { getCart } from "@/utils/cart";
import { useEffect, useState } from "react";
import CartStep from "@/components/checkout/CartStep";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import { PaymentMethod } from "@/types/catalog"

type CheckoutStep =
  | "CART"
  | "ADDRESS"
  | "PAYMENT"
  | "REVIEW";

export default function CheckoutState() {
  const user = useAuth();
  const [step, setStep] = useState<CheckoutStep>("CART");

  const [cart, setCart] = useState<Cart>(() => getCart());
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");

  //useEffect(() => saveCart(cart), [cart]);

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
          onSave={setAddress}
          onNext={() => setStep("PAYMENT")}
          onBack={() => setStep("CART")}
        />
      )}

      {step === "PAYMENT" && (
        <PaymentStep
          method={paymentMethod}
          onChange={setPaymentMethod}
          onNext={() => setStep("REVIEW")}
          onBack={() => setStep("ADDRESS")}
        />
      )}

      {step === "REVIEW" && (


        <ReviewStep
          cart={cart}
          address={address!}
          paymentMethod={paymentMethod}
          onEditAddress={() => setStep("ADDRESS")}
          onEditPayment={() => setStep("PAYMENT")}
        />

      )}
    </div>
  );
}
