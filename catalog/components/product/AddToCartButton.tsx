
import { Product } from "@/types/catalog";
import { Link, ShoppingCartIcon } from "lucide-react"

// Replace with your actual phone number, including country code (no '+' or leading '00')
const WHATSAPP_NUMBER = '918234042231';
const baseURL = process.env.BASE_URL;

const AddToCartButton = ({ product }: { product: Product }) => {
  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${(
    `Hi Amish, I want to buy ${baseProductUrl}`
  )}`;
  return (
    <button
      href={whatsappUrl}
      target="_blank"
      className="ssj-btn gap-3 bg-accent px-5 py-2 m-2 font-bold text-xl flex"
    >
      <ShoppingCartIcon /> Add to Cart
    </button>
  );
};

export default AddToCartButton;