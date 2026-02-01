
import { Product } from "@/types/catalog";
import { ShoppingCartIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { addToCart } from "@/utils/cart"
import { useRef } from "react";

export default function BuyNowButton({ product, activeVariant = 0 }: { product: Product, activeVariant: number }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const hasRequestedAuth = useRef(false);
  async function ensureLogin() {
    if (!authLoading && !user && !hasRequestedAuth.current) {
      hasRequestedAuth.current = true; // Prevents the second trigger
      signInWithPopup(auth, googleProvider).catch(err => {
        hasRequestedAuth.current = false; // Reset if they closed it/errored
        console.error("Auth failed", err);
      });
    }
  }

  const handleClick = async () => {
    try {
      await ensureLogin();
      addToCart({ productId: product.id, variantIndex: activeVariant, qty: 1, product: product, variant: product.variants[activeVariant].size });
      router.push("/cart");


    } catch (err) {
      console.error("Buy Now failed:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ssj-btn gap-3 bg-accent px-5 py-2 m-2 font-bold text-xl flex items-center"
    >
      <ShoppingCartIcon /> Buy Now
    </button>
  );
};