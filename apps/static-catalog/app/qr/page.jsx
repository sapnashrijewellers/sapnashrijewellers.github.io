// /app/qr/page.jsx

import Image from "next/image";

export const metadata = {
  title: "Payment QR Code | Sapna Shri Jewellers",
  description: "Scan the QR code below to make a secure payment to Sapna Shri Jewellers.",
};

export default function QrPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="rounded-xl shadow-2xl p-4 w-full max-w-sm transform transition-all duration-300 scale-100 bg-white">
        <div className="flex justify-center">
          <Image
            src="/img/qr/image.png"
            alt="Payment QR Code"
            width={300}
            height={300}
            className="border-4 border-gray-100 rounded-lg shadow-md"
            priority
          />
        </div>
      </div>
    </div>
  );
}
