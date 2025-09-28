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

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
                z-50
                bottom-6 right-6                  
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
                className="text-6xl text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"                
            />
        </a>
    );
};

export default FloatingWhatsAppChatButton;