
import { Product } from "@/types/catalog";
import { ShoppingCartIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { useRouter } from "next/navigation";

// Replace with your actual phone number, including country code (no '+' or leading '00')

export default function BuyNowButton({ product, activeVariant = 0 }: { product: Product, activeVariant: number }) {

  //const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP;
  //const baseURL = process.env.BASE_URL;

  // const baseProductUrl = `${baseURL}/product/${product.slug}`;
  // const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  //   `Hi Amish, I want to buy ${baseProductUrl}. Size: ${product.variants[activeVariant].size}`
  // )}`;



  const checkoutURL = `/checkout?p=${product.id}&v=${activeVariant}`;

  const user = useAuth();
  const router = useRouter();
  async function ensureLogin() {
    if (!user) {
      await signInWithPopup(auth, googleProvider);
    }
  }

  const handleClick = async () => {
    try {
      // 1️⃣ Ensure authentication
      await ensureLogin();

      // 2️⃣ Redirect to checkout
      router.push(checkoutURL);
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