"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {generateUPIString} from "@/utils/generateUPI";

export default function UPIPaymentQR({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    const upiString = generateUPIString({
      vpa: "mab.037326019610011@axisbank",
      name: "SAPNA SHREE JEWELLERS",
      amount,
      orderId,
    });

    QRCode.toDataURL(upiString).then(setQr);
  }, [amount, orderId]);

  if (!qr) return null;

  return (
    <div className="text-center mt-4">
      <p className="mb-2 font-medium">
        Scan & pay ₹{amount} via UPI
      </p>
      <img src={qr} alt="UPI QR Code" className="mx-auto w-48 h-48" />
      <p className="text-sm mt-2 text-muted">
        After payment, click “I have paid”
      </p>
    </div>
  );
}
