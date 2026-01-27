import { Address, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";
import { AddressSummary } from "./AddressSummary";
import { PriceSummary } from "./PriceSummary";
import CartStep from "@/components/checkout/CartStep"
import PayViaUPIButton from "./PayViaUPIButton";
import PlaceOrderButton from "./PlaceOrderButton";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageCheck } from "lucide-react";

export default function ReviewStep(
  {
    cart,
    address,
    priceSummary,
    paymentMethod,
    onEditAddress,
    onEditPayment,
    onBack,
    onNext }:
    {
      cart: Cart,
      address: Address | undefined,
      paymentMethod: PaymentMethod,
      priceSummary: PriceSummaryType,
      onEditAddress: () => void;
      onEditPayment: () => void;
      onBack: () => void;
      onNext: () => void;
    }) {


  return (
    <>
      <h2 className="text-xl mb-4">Cart / Review & Place Order</h2>
      <CartStep cart={cart} />
      <AddressSummary address={address} onEdit={onEditAddress} />
      <PriceSummary paymentMethod={paymentMethod} priceSummary={priceSummary} onEditPayment={onEditPayment} />
      <PayViaUPIButton finalPrice={paymentMethod == "UPI" ? priceSummary.finalPrice : priceSummary.shipping + priceSummary.cod} />
      <div className="flex gap-3 mt-6">
        <button className="ssj-btn-outline w-full" onClick={onBack}>
          <ChevronLeft size={16} strokeWidth={3} />Back
        </button>
        <button className="ssj-btn-outline w-full bg-amber-600 font-bold" onClick={onNext}>
          <PackageCheck size={16} strokeWidth={3} />Place Order
        </button>
      </div>
      <div className="text-xs p-2 text-right">
        By clicking “Place Order”, you agree to our &nbsp;
        <Link href={`/policies/terms/`} className="underline">Terms</Link>
        &nbsp;and &nbsp;
        <Link href={`/policies/privacy/`} className="underline">Privacy Policy</Link>.
      </div>
    </>
  );
}

