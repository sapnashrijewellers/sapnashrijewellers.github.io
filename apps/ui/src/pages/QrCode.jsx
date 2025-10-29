import React from 'react';
export const QrCode = () => {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-1 w-full max-w-sm transform transition-all duration-300 scale-100">
            <div className="flex justify-center">
                <img
                    src="https://sapnashrijewellers.github.io/static/img/qr/ssj_qr.png"
                    alt="Payment QR Code"
                    className="w-max h-max border-4 border-gray-100 rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};

export default QrCode;