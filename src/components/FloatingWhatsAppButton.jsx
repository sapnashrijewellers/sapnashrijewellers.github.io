import React from 'react';
import { FaWhatsapp } from "react-icons/fa";

/**
 * FloatingWhatsAppButton Component
 * Renders a fixed, always-on-top button in the bottom-right corner
 * that links directly to the specified WhatsApp number.
 */
const FloatingWhatsAppChatButton = ({ phoneNumber = '919424932197', className = '' }) => {
    // Hardcoded number provided by the user. We assume '91' is the country code.
    // Create the direct link to the WhatsApp API with a pre-filled message.
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello!%20I%20have%20a%20question%20about%20your%20service.`;

    // Inline SVG for the WhatsApp icon (A simple message/phone icon).
    const WhatsAppIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
        >
            {/* A chat bubble icon */}
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 15.19 15.19 0 0 1-2.6 3.4c-1.2 1.4-2.2 2.4-3.5 3.5-.9.9-2 1.4-3.5 1.4s-2.6-.5-3.5-1.4c-1.3-1.1-2.3-2.1-3.5-3.5a15.19 15.19 0 0 1-2.6-3.4 8.38 8.38 0 0 1-.9-3.8A9 9 0 0 1 12 3a9 9 0 0 1 9 8.5z" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    );

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
                z-50
                bottom-6 right-6 sm:bottom-10 sm:right-10                 
                text-white
                p-1 sm:p-1
                rounded-full
                shadow-2xl
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                flex items-center justify-center
            "
            title={`Chat on WhatsApp: +${phoneNumber}`}
        >
            <FaWhatsapp
                title={`Chat on WhatsApp: +${phoneNumber}`}
                className="text-7xl text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"
                onClick={() => window.open(whatsappUrl, "_blank")}
            />
        </a>
    );
};

export default FloatingWhatsAppChatButton;