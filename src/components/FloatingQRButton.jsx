import React from 'react';
import { FaQrcode } from "react-icons/fa";

export const FloatingQrCodeTriggerButton = ({ onClick, className = '' }) => {

    return (
        <button 
            onClick={onClick}
            className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white ${className}`}
            title="Open QR Code To Make Payment"
            aria-label="Open WhatsApp QR Code"
        >
            <FaQrcode size={28} className="text-white" />
        </button>
    );
};


export default FloatingQrCodeTriggerButton;