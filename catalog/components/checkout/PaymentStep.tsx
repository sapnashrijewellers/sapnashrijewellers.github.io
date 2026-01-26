import { PaymentMethod} from "@/types/catalog"
import { Trash2, Save, Check, ChevronLeft } from "lucide-react";

export default function PaymentStep({
    method,
    onChange,
    onNext,
    onBack
}: {
    method: PaymentMethod;
    onChange: (value: PaymentMethod) => void; // Standard function signature
    onNext: () => void;
    onBack: () => void;
}) {
    
    

    return (
        <>
            <h2 className="text-xl mb-4">Cart / Payment Method</h2>

            <label>
                <input
                    type="radio"
                    checked={method === "UPI"}
                    onChange={() => onChange("UPI")}
                />
                UPI
            </label>

            <label className="ml-4">
                <input
                    type="radio"
                    checked={method === "COD"}
                    onChange={() => onChange("COD")}
                />
                COD (+₹200)
            </label>
            <div className="flex gap-3 mt-6">
                <button
                    className="ssj-btn-outline w-full"
                    onClick={onBack}
                >
                    <ChevronLeft size={16} strokeWidth={3} />
                    Back
                </button>

                <button
                    className="ssj-btn w-full"
                    onClick={onNext}
                ><Save size={16} strokeWidth={3} />
                    Save & Continue
                </button>
            </div>
        </>
    );
}
