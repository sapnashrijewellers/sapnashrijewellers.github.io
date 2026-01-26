import UPIPaymentQR from "../UPIPaymentQR";


export default function PayViaUPIButton({ finalPrice }: { finalPrice: number }) {
    function openUPI() {
        const amount = finalPrice.toFixed(2);

        const upiUrl = `upi://pay?pa=mab.037326019610011@axisbank&pn=Sapna%20Shri%20Jewellers&am=${amount}&cu=INR&`;

        window.location.href = upiUrl;
    }



    return (
        <div className="m-2">
            <button className="ssj-btn w-full " onClick={openUPI}>
                Pay ₹{finalPrice} via UPI
            </button>

            <UPIPaymentQR
                amount={finalPrice}
                // orderId={`SSJ-${product.id}-${Date.now()}`}
            />
        </div>
    );

}