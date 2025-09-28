import React from 'react';
import { FaQrcode } from "react-icons/fa";
// Inline SVG for the QR Code icon
const QrCodeIcon = () => (
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
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M14 16h-2c0 2 1 3 4 3s3 1 3 4" />
        <path d="M14 12v-2c0-2-1-3-4-3s-3-1-3-4" />
        <path d="M8 12h2" />
        <path d="M12 10v2" />
    </svg>
);


export const FloatingQrCodeTriggerButton = ({ onClick, className = '' }) => {

    return (
        <button 
            onClick={onClick}
            className={`p-4 sm:p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white ${className}`}
            title="Open QR Code To Make Payment"
            aria-label="Open WhatsApp QR Code"
        >
            <FaQrcode size={28} className="text-white" />
        </button>
    );
};


export default FloatingQrCodeTriggerButton;