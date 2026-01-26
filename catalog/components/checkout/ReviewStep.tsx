import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
import { AddressSummary } from "./AddressSummary";
import { PriceSummary } from "./PriceSummary";
import CartStep from "@/components/checkout/CartStep"
import PayViaUPIButton from "./PayViaUPIButton";
import PlaceOrderButton from "./PlaceOrderButton";

export default function ReviewStep(
  {
    cart,
    address,
    priceSummary,
    paymentMethod,
    onEditAddress,
    onEditPayment, }:
    {
      cart: Cart,
      address: Address | undefined,
      paymentMethod: PaymentMethod,
      priceSummary: PriceSummaryType,
      onEditAddress: () => void;
      onEditPayment: () => void;
    }) {


  return (
    <>
      <h2 className="text-xl mb-4">Review & Place Order</h2>
      <CartStep cart={cart} />
      <AddressSummary address={address} onEdit={onEditAddress} />
      <PriceSummary priceSummary={priceSummary} onEditPayment={onEditPayment} />
      <PayViaUPIButton finalPrice={priceSummary.finalPrice} />
      <PlaceOrderButton cart={cart} 
      address={address}
      paymentMethod={paymentMethod}      
      priceSummary={priceSummary}  />
    </>
  );
}

