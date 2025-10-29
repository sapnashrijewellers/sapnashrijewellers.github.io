import React from 'react';
export const QrCodeModal = ({ qrImageUrl, onClose }) => {
    const driveURL = 'https://sapnashrijewellers.github.io/static/img/';
    return (
        // Modal backdrop
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[60] flex items-center justify-center p-1 transition-opacity duration-300"
            onClick={onClose} // Allows closing by clicking outside the box
        >
            {/* Modal content box */}
            <div
                className="bg-white rounded-xl shadow-2xl p-1 w-full max-w-sm transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
                <div className="flex justify-center">                    
                    <img
                        src={`${driveURL}${qrImageUrl}`}
                        alt="Payment QR Code"
                        className="w-max h-max border-4 border-gray-100 rounded-lg shadow-md"
                        // Fallback image source
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/333333?text=QR+Code+Missing" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default QrCodeModal;