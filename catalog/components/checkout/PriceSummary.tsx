import { PaymentMethod, PriceSummaryType } from "@/types/catalog";

type PriceSummaryProps = {
  priceSummary: PriceSummaryType,
  paymentMethod: PaymentMethod,
  onEditPayment: () => void;
};

export function PriceSummary({
  priceSummary,
  paymentMethod,
  onEditPayment,
}: PriceSummaryProps) {

  const total = priceSummary.productTotal + priceSummary.shipping + (paymentMethod == "COD" ? priceSummary.cod : 0);
  const payNow = paymentMethod === "COD" ? priceSummary.cod + priceSummary.shipping : total

  return (
    <div className="bg-surface border border-theme rounded-lg p-4 mt-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-yatra">Price Summary</h3>

        <button
          onClick={onEditPayment}
          className="text-sm underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="mt-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Products Total</span>
          <span>₹{priceSummary.productTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{priceSummary.shipping}</span>
        </div>

        {paymentMethod === "COD" && (
          <div className="flex justify-between">
            <span>COD Charges</span>
            <span>₹{priceSummary.cod}</span>
          </div>
        )}

        <div className="border-t border-theme pt-2 mt-2 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <div className="border-t border-theme pt-2 mt-2 flex justify-between font-semibold text-base">
          <span>Pay Now</span>
          <span>₹{payNow}</span>
        </div>
      </div>

      {paymentMethod === "COD" && (
        <p className="text-lg mt-2">
          Product price <b>{priceSummary.productTotal}</b> will be paid at the time of delivery.
        </p>
      )}
    </div>
  );
}
