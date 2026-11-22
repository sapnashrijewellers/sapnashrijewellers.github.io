'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { generateUPIString } from '@/utils/cart/generateUPI';
import Image from 'next/image';

export default function UPIPaymentQR({ amount }: { amount: number }) {
  const [qr, setQr] = useState('');

  useEffect(() => {
    let cancelled = false;

    const upiString = generateUPIString({
      vpa: '20251197002044-iservuqrsbrp@cbin',
      name: 'S S JEWELLERS PROP AMISH KUMAR GANG',
      amount,
    });

    QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'M',
      margin: 4,
      width: 400,
      type: 'image/png',
    })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [amount]);

  if (!qr) return null;

  return (
    <div className="mt-4 text-center">
      <p className="mb-3 font-medium">Scan & pay ₹{amount.toFixed(2)} via UPI</p>

      <Image
        src={qr}
        alt="Sapna Shri Jewellers UPI Payment QR"
        width={280}
        height={280}
        className="mx-auto"
        unoptimized
      />

      <p className="text-muted mt-3 text-sm">After payment, save your transaction reference number.</p>
    </div>
  );
}
