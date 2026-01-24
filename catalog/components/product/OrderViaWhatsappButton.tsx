import { FaWhatsapp } from 'react-icons/fa';
import { Product } from "@/types/catalog";

// Replace with your actual phone number, including country code (no '+' or leading '00')
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const OrderViaWhatsappButton = ({ product, title = "", activeVariant = 0 }: { product: Product, title?: string, activeVariant?: number }) => {
  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${(
    `Hi, I want more details and discount on ${baseProductUrl} SIZE: ${product.variants[activeVariant].size}`
  )}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-white px-5 py-2 m-2 rounded-full shadow-lg  hover:shadow-xl transition-all"
    >
      {/* WhatsApp Icon */}

      <FaWhatsapp className="text-green-500 text-4xl" />


      {/* Text Block */}
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-black text-lg">
          {title.length > 0 ? title : 'WhatsApp'}

        </span>
        {title.length <= 0 && (
          <span className="text-green-600 font-medium text-sm -mt-0.5">
            Click to get discounts & offers
          </span>
        )}
      </div>
    </a>
  );
};

export default OrderViaWhatsappButton;