"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsAppButton() {
  const MY_PHONE_NUMBER = "918234042231";
  const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=Hello!%20I%20have%20a%20question%20about%20your%20service.`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-15 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end space-y-3">
      <button
        className="p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white"
        title={`Chat on WhatsApp: +${MY_PHONE_NUMBER}`}
        onClick={handleClick}
      >
        <FaWhatsapp size={30} />
      </button>
    </div>
  );
}
