
import { Product } from "@/types/catalog";
import { ShoppingCartIcon } from "lucide-react"

// Replace with your actual phone number, including country code (no '+' or leading '00')
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP;
const baseURL = process.env.BASE_URL;

const BuyNowButton = ({ product,activeVariant = 0 }: { product: Product, activeVariant:number }) => {
  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Amish, I want to buy ${baseProductUrl}. Size: ${product.variants[activeVariant].size}`
  )}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

export default BuyNowButton;