export function generateUPIString({
  vpa,
  name,
  amount,
  //orderId,
}: {
  vpa: string;
  name: string;
  amount: number;
  //orderId: string;
}) {
  return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
    name
  )}&am=${amount.toFixed(2)}&cu=INR
  
  `;
  //&tn=${encodeURIComponent(    `Order ${orderId}`  )}
}