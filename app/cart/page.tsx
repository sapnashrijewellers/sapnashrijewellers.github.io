import { Suspense } from "react";
import CheckoutState  from  "@/components/checkout/CheckoutState"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout…</div>}>      
      <CheckoutState />
    </Suspense>
  );
}
