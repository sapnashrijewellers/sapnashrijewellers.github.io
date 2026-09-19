'use client';

import { Address, Cart, PaymentMethod, PriceSummaryType } from '@/types/catalog';
import { fireConfetti } from '@/components/checkout/FireConfetti';
import { useState } from 'react';
import { PackageCheck, Loader2 } from 'lucide-react';

type Props = {
  cart: Cart;
  address?: Address;
  paymentMethod: PaymentMethod;
  priceSummary: PriceSummaryType;
  clearCart: () => void;
};

export default function PaymentVerificationStep({ cart, address, paymentMethod, priceSummary, clearCart }: Props) {
  const [paymentRef, setPaymentRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart?.items?.length || !address) return null;

  /* ---------------- WhatsApp ---------------- */

  function buildWhatsAppMessage() {
    const productLines = cart.items
      .map((item, i) => {
        return `${i + 1}. ${item.product.name}
Qty: ${item.qty}
Link: ${process.env.NEXT_PUBLIC_BASE_URL}/p/${item.product.id}/`;
      })
      .join('\n\n');

    return `
🛍️ Order Confirmation

👤 ${address?.name}
📞 ${address?.mobile}

📍 Address:
${address?.address}
${address?.city} - ${address?.pin}

💍 Products:
${productLines}

💰 Total: ₹${priceSummary.finalPrice}
💳 Payment: ${paymentMethod}
🧾 Ref ID: ${paymentRef}

🙏 Please confirm & process.
`.trim();
  }

  function openWhatsApp() {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  /* ---------------- Order API ---------------- */

  async function submitOrder() {
    if (!paymentRef.trim()) {
      setError('Payment Reference ID is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WORKER_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          address,
          paymentMethod,
          paymentRef,
          priceSummary,
        }),
      });

      if (!res.ok) throw new Error('Order creation failed');

      fireConfetti();
      clearCart();
      setOrderPlaced(true);

      setTimeout(openWhatsApp, 1200);
    } catch (e) {
      console.log(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-surface border-theme space-y-5 rounded-xl border p-6">
      <h2 className="">Payment Verification</h2>

      <p className="text-muted text-sm">
        To process your order at <b>Sapna Shri Jewellers</b>, please enter your
        <b> Payment Transaction / Reference ID</b>.
      </p>

      <p className="text-muted text-xs italic">* This ID is required for manual payment reconciliation.</p>

      <div>
        <label className="labelClasses">
          Payment Reference ID <span className="text-red-500">*</span>
        </label>
        <input
          value={paymentRef}
          onChange={(e) => setPaymentRef(e.target.value)}
          placeholder="e.g. UPI / Bank Ref No."
          className="inputClasses"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <button
        onClick={submitOrder}
        disabled={submitting}
        className="ssj-btn w-full"
        aria-label="Confirm and place order"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Verifying Payment...
          </>
        ) : (
          <>
            <PackageCheck /> Confirm & Place Order
          </>
        )}
      </button>

      {/* ---------------- Success Modal ---------------- */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border-theme max-w-md space-y-4 rounded-xl border p-8 text-center">
            <h3 className="">🎉 Thank You for Your Order!</h3>

            <p className="text-muted">Your payment details have been received successfully.</p>

            <p className="text-muted text-sm">
              Our team will verify your payment and confirm availability shortly via WhatsApp.
            </p>

            <button className="ssj-btn w-full" onClick={openWhatsApp}>
              Send Order on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
