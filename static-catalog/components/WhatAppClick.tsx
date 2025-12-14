import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from "@/types/catalog";

// Replace with your actual phone number, including country code (no '+' or leading '00')
const WHATSAPP_NUMBER = '918234042231';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const WhatsappClick = ({ product }: { product: Product }) => {
  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${(
    `Hi, I want more details and discount on ${baseProductUrl}`
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
        <span className="font-semibold text-black text-lg">WhatsApp</span>
        <span className="text-green-600 font-medium text-sm -mt-0.5">
          Click To Chat
        </span>
      </div>
    </a>
  );
};

export default WhatsappClick;