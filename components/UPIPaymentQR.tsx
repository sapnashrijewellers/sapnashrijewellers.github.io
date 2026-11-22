'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { generateUPIString } from '@/utils/cart/generateUPI';
import Image from 'next/image';

export default function UPIPaymentQR({ amount }: { amount: number }) {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    const upiString = generateUPIString({
      vpa: '20251197002044-iservuqrsbrp@cbin',
      name: 'S S JEWELLERS PROP AMISH KUMAR GANG',
      amount,
    });

    QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 256,
    }).then(setQr);
  }, [amount]);

  if (!qr) return null;

  return (
    <div className="mt-4 text-center">
      <p className="mb-2 font-medium">Scan & pay ₹{amount} via UPI</p>

      <Image
        src={qr}
        alt="Central Bank of India UPI Payment QR Code"
        width={192}
        height={192}
        className="mx-auto rounded-lg"
        unoptimized
      />

      <p className="text-muted mt-2 text-sm">After payment, click "I have paid"</p>
    </div>
  );
}
