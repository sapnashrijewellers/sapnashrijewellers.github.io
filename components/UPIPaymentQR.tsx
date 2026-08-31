"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {generateUPIString} from "@/utils/cart/generateUPI";
import Image from "next/image";


export default function UPIPaymentQR({
  amount,
  //orderId,
}: {
  amount: number;
  //orderId: string;
}) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    const upiString = generateUPIString({
      vpa: "mab.037326019610011@axisbank",
      name: "SAPNA SHREE JEWELLERS",
      amount,
      //orderId,
    });

    QRCode.toDataURL(upiString).then(setQr);
  }, [amount]);

  if (!qr) return null;

  return (
    <div className="text-center mt-4">
      <p className="mb-2 font-medium">
        Scan & pay ₹{amount} via UPI
      </p>
      <Image
  src={qr}
  alt="UPI QR Code"
  width={192}
  height={192}
  className="mx-auto rounded-lg"
/>
      <p className="text-sm mt-2 text-muted">
        After payment, click “I have paid”
      </p>
    </div>
  );
}
