// /app/qr/page.jsx

import Image from "next/image";

export const metadata = {
  title: "Payment QR Code | Sapna Shri Jewellers",
  description: "Scan the QR code below to make a secure payment to Sapna Shri Jewellers.",
};

export default function QrPage() {
  return (

    <div className="flex justify-center items-center  p-4 w-full">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/static/img/qr/image.png`}
        alt="Payment QR Code"
        width={300}
        height={300}
        className="border-4 border-gray-100 rounded-lg shadow-md"
        priority
      />
    </div>

  );
}
