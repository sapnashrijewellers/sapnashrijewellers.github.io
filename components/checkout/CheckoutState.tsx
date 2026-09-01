"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import {
  Address,
  Cart,
  PaymentMethod,
  PriceSummaryType,
  Product,
} from "@/types/catalog";

import {
  getCart,
  saveCart,
  clearCartStorage,
} from "@/utils/cart/cart";

import { calculateFinal } from "@/utils/cart/calculatePrice";
import { requireAuth } from "@/utils/auth/auth";
import { useAuth } from "@/hooks/useAuth";

import CartStep from "@/components/checkout/CartStep";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import PaymentVerificationStep from "./PaymentVerificationStep";

import productsData from "@/data/products.json";

import { Loader2, LogIn } from "lucide-react";

type CheckoutStep =
  | "CART"
  | "ADDRESS"
  | "PAYMENT"
  | "REVIEW"
  | "VERIFY";

interface CheckoutStateProps {
  className?: string;
}

/**
 * Hydrate cart items with the latest product data from products.json.
 */
function getHydratedInitialCart(): Cart {
  try {
    const rawCart = getCart();

    const productMap = new Map<number, Product>();

    for (const product of productsData as Product[]) {
      productMap.set(Number(product.id), product);
    }

    const populatedItems = (rawCart.items || []).map((item) => ({
      ...item,
      product:
        productMap.get(Number(item.productId)) || item.product,
    }));

    return {
      ...rawCart,
      items: populatedItems,
    };
  } catch (error) {
    console.error(
      "Failed to hydrate initial cart data:",
      error,
    );

    return getCart();
  }
}

export default function CheckoutState({
  className = "",
}: CheckoutStateProps) {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [authPending, setAuthPending] =
    useState(false);

  // --------------------------------------------------
  // Cart
  // --------------------------------------------------

  const [cart, setCart] = useState<Cart>(
    getHydratedInitialCart,
  );

  // --------------------------------------------------
  // Checkout state
  // --------------------------------------------------

  const [step, setStep] =
    useState<CheckoutStep>("CART");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");

  const [address, setAddress] =
    useState<Address>(new Address());

  const [addressLoading, setAddressLoading] =
    useState(false);

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleLogin = useCallback(async () => {
    try {
      setAuthPending(true);

      await requireAuth();
    } catch (error) {
      console.error(
        "Checkout sign-in failed:",
        error,
      );
    } finally {
      setAuthPending(false);
    }
  }, []);

  // --------------------------------------------------
  // Load user address
  // --------------------------------------------------

  useEffect(() => {
    if (!user) {
      return;
    }

    /*
     * Capture the narrowed user.
     *
     * This is important because TypeScript does not
     * preserve the `user !== null` narrowing inside
     * the nested async function.
     */
    const authenticatedUser = user;

    let mounted = true;

    async function loadAddress() {
      setAddressLoading(true);

      try {
        const workerUrl =
          process.env.NEXT_PUBLIC_WORKER_URL || "";

        const response = await fetch(
          `${workerUrl}/address?uid=${encodeURIComponent(
            authenticatedUser.uid,
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          if (mounted && data) {
            setAddress(data);
            return;
          }
        }

        /*
         * No saved address found.
         *
         * AuthUserSnapshot contains:
         * uid
         * displayName
         * email
         * photoURL
         *
         * It does NOT contain phoneNumber.
         *
         * Therefore mobile cannot be populated from
         * the lightweight auth snapshot.
         */
        if (mounted) {
          setAddress((previous) => ({
            ...previous,
            uid: authenticatedUser.uid,
            name:
              previous.name ||
              authenticatedUser.displayName ||
              "",
            email:
              previous.email ||
              authenticatedUser.email ||
              "",
          }));
        }
      } catch (error) {
        console.error(
          "Failed to retrieve stored user address:",
          error,
        );
      } finally {
        if (mounted) {
          setAddressLoading(false);
        }
      }
    }

    void loadAddress();

    return () => {
      mounted = false;
    };
  }, [user]);

  // --------------------------------------------------
  // Save address
  // --------------------------------------------------

  const saveAddress = useCallback(async () => {
    if (!user) {
      return;
    }

    setAddressLoading(true);

    try {
      const workerUrl =
        process.env.NEXT_PUBLIC_WORKER_URL || "";

      await fetch(`${workerUrl}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          uid: user.uid,
        }),
      });

      setStep("PAYMENT");
    } catch (error) {
      console.error(
        "Failed to save address:",
        error,
      );
    } finally {
      setAddressLoading(false);
    }
  }, [address, user]);

  // --------------------------------------------------
  // Pricing
  // --------------------------------------------------

  const priceSummary = useMemo(
    (): PriceSummaryType => {
      const productTotal =
        calculateFinal(cart);

      const shipping = 60;

      const cod =
        paymentMethod === "COD"
          ? 200
          : 0;

      return {
        productTotal,
        shipping,
        cod,
        finalPrice:
          productTotal +
          shipping +
          cod,
      };
    },
    [cart, paymentMethod],
  );

  // --------------------------------------------------
  // Persist cart
  // --------------------------------------------------

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // --------------------------------------------------
  // Clear cart
  // --------------------------------------------------

  const clearCart = useCallback(() => {
    clearCartStorage();

    setCart({
      items: [],
    });

    setStep("CART");
  }, []);

  // --------------------------------------------------
  // Authentication loading
  // --------------------------------------------------

  if (authLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className={`
          max-w-5xl mx-auto
          p-8
          flex flex-col
          items-center
          justify-center
          min-h-[40vh]
          space-y-3
          ${className}
        `}
      >
        <Loader2
          className="w-8 h-8 animate-spin text-primary"
          aria-hidden="true"
        />

        <p className="text-sm text-muted-foreground">
          सुरक्षित चेकआउट लोड हो रहा है...
          <span className="block">
            (Loading secure checkout...)
          </span>
        </p>
      </main>
    );
  }

  // --------------------------------------------------
  // Guest
  // --------------------------------------------------

  if (!user) {
    return (
      <main
        className={`
          max-w-md mx-auto
          px-4 py-16
          text-center
          space-y-5
          ${className}
        `}
      >
        <div
          className="
            p-4
            rounded-full
            bg-primary/10
            text-primary
            w-16 h-16
            mx-auto
            flex items-center
            justify-center
          "
        >
          <LogIn
            className="w-8 h-8"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1.5">
          <h1
            className="
              text-2xl
              font-bold
              text-foreground
              font-yatra
            "
          >
            चेकआउट के लिए साइन इन करें

            <span className="block">
              (Sign In to Checkout)
            </span>
          </h1>

          <p className="text-sm text-muted-foreground">
            Please authenticate with Google to
            attach your delivery address and
            finalize your order.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={authPending}
          aria-label="Sign in with Google to continue checkout"
          className="
            inline-flex
            items-center
            justify-center
            gap-2.5
            px-6 py-3
            rounded-xl
            bg-primary
            text-primary-foreground
            font-semibold
            text-sm sm:text-base
            shadow-sm
            hover:bg-primary/90
            hover:scale-[1.02]
            active:scale-95
            transition-[transform,background-color]
            duration-150
            ease-out
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:ring-offset-2
            disabled:opacity-60
            disabled:pointer-events-none
            cursor-pointer
          "
        >
          {authPending ? (
            <Loader2
              className="w-5 h-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <LogIn
              className="w-5 h-5"
              aria-hidden="true"
            />
          )}

          <span>
            {authPending
              ? "Signing in..."
              : "Sign in with Google"}
          </span>
        </button>
      </main>
    );
  }

  // --------------------------------------------------
  // Checkout
  // --------------------------------------------------

  return (
    <main
      aria-label="Jewellery order checkout funnel"
      className={`
        max-w-5xl
        mx-auto
        p-4 sm:p-6
        bg-page
        space-y-6
        ${className}
      `}
    >
      <div
        className="sr-only"
        aria-live="polite"
      >
        {`Current checkout step: ${step}. Total items in cart: ${
          cart.items?.length || 0
        }. Total payable: ₹${priceSummary.finalPrice}`}
      </div>

      {step === "CART" && (
        <CartStep
          cart={cart}
          setCart={setCart}
          onNext={() => setStep("ADDRESS")}
        />
      )}

      {step === "ADDRESS" && (
        <AddressStep
          value={address}
          loading={addressLoading}
          onChange={setAddress}
          onSubmit={saveAddress}
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
          address={address}
          paymentMethod={paymentMethod}
          priceSummary={priceSummary}
          onEditAddress={() => setStep("ADDRESS")}
          onEditPayment={() => setStep("PAYMENT")}
          onBack={() => setStep("PAYMENT")}
          onNext={() => setStep("VERIFY")}
        />
      )}

      {step === "VERIFY" && (
        <PaymentVerificationStep
          cart={cart}
          address={address}
          paymentMethod={paymentMethod}
          priceSummary={priceSummary}
          clearCart={clearCart}
        />
      )}
    </main>
  );
}
