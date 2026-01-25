import { PriceSummaryType } from "@/types/catalog";

type PriceSummaryProps = {
  priceSummary:PriceSummaryType,
  onEditPayment: () => void;
};

export function PriceSummary({
  priceSummary,
  onEditPayment,
}: PriceSummaryProps) {
  const COD_CHARGE = priceSummary.paymentMethod === "COD" ? 200 : 0;
  const total = priceSummary.productTotal + priceSummary.shipping + COD_CHARGE;

  return (
    <div className="bg-surface border border-theme rounded-lg p-4 mt-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-yatra">Price Summary</h3>

        <button
          onClick={onEditPayment}
          className="text-sm underline text-primary"
        >
          Edit
        </button>
      </div>

      <div className="mt-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Products</span>
          <span>₹{priceSummary.productTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{priceSummary.shipping}</span>
        </div>

        {priceSummary.paymentMethod === "COD" && (
          <div className="flex justify-between">
            <span>COD Charges</span>
            <span>₹200</span>
          </div>
        )}

        <div className="border-t border-theme pt-2 mt-2 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {priceSummary.paymentMethod === "COD" && (
        <p className="text-xs text-muted mt-2">
          Product price will be paid at delivery.
        </p>
      )}
    </div>
  );
}
