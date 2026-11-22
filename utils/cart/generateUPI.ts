export function generateUPIString({ vpa, name, amount }: { vpa: string; name: string; amount: number }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toFixed(2),
    cu: 'INR',
  });

  return `upi://pay?${params.toString()}`;
}
