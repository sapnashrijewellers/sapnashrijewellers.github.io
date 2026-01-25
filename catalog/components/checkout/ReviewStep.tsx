import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
import { AddressSummary } from "./AddressSummary";
import { PriceSummary } from "./PriceSummary";
import { calculateFinal } from "@/utils/calculatePrice";
import { useRates } from "@/context/RateContext"
import CartStep from "@/components/checkout/CartStep"

export default function ReviewStep(
  { cart,
    address,
    paymentMethod,
    onEditAddress,
    onEditPayment, }:
    {
      cart: Cart,
      address: Address,
      paymentMethod: PaymentMethod,
      onEditAddress: () => void;
      onEditPayment: () => void;
    }) {
  const rates = useRates();
  const pTotal = calculateFinal(cart, paymentMethod, rates);

  const summary: PriceSummaryType = {
    productTotal: pTotal,
    shipping: 60.00,
    paymentMethod: paymentMethod
  };

  return (
    <>
      <h2 className="text-xl mb-4">Review & Place Order</h2>
      <CartStep cart={cart} />
      <AddressSummary address={address} onEdit={onEditAddress} />
      <PriceSummary priceSummary={summary} onEditPayment={onEditPayment} />

      <button className="ssj-btn w-full mt-6">
        Place Order
      </button>
    </>
  );
}

