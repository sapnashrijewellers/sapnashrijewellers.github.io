import { Suspense } from "react";
//import CheckoutClient from "./CheckoutClient";
import CheckoutState  from  "@/components/checkout/CheckoutState"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout…</div>}>
      {/* <CheckoutClient /> */}
      <CheckoutState />
    </Suspense>
  );
}
