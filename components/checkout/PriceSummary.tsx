import { PaymentMethod, PriceSummaryType } from '@/types/catalog';

type PriceSummaryProps = {
  priceSummary: PriceSummaryType;
  paymentMethod: PaymentMethod;
  onEditPayment: () => void;
};

export function PriceSummary({ priceSummary, paymentMethod, onEditPayment }: PriceSummaryProps) {
  const total = priceSummary.productTotal + priceSummary.shipping + (paymentMethod == 'COD' ? priceSummary.cod : 0);
  const payNow = paymentMethod === 'COD' ? priceSummary.cod + priceSummary.shipping : total;

  return (
    <div className="bg-surface border-theme mt-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <h3 className="">Price Summary</h3>

        <button onClick={onEditPayment} className="cursor-pointer text-sm underline" aria-label="Edit cart items">
          Edit
        </button>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Products Total</span>
          <span>₹{priceSummary.productTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{priceSummary.shipping}</span>
        </div>

        {paymentMethod === 'COD' && (
          <div className="flex justify-between">
            <span>COD Charges</span>
            <span>₹{priceSummary.cod}</span>
          </div>
        )}

        <div className="border-theme mt-2 flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <div className="border-theme mt-2 flex justify-between border-t pt-2 text-base font-semibold">
          <span>Pay Now</span>
          <span>₹{payNow}</span>
        </div>
      </div>

      {paymentMethod === 'COD' && (
        <p className="mt-2 text-lg">
          Product price <b>{priceSummary.productTotal}</b> will be paid at the time of delivery.
        </p>
      )}
    </div>
  );
}
