import { Address } from "@/types/catalog";
import { Save, ChevronLeft, Loader2 } from "lucide-react";

type AddressStepProps = {
  value: Address;
  loading?: boolean;
  onChange: (a: Address) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function AddressStep({
  value,
  loading = false,
  onChange,
  onSubmit,
  onBack,
}: AddressStepProps) {
  function update<K extends keyof Address>(key: K, val: Address[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <>
      <h2 className="text-xl mb-4">Cart / Delivery Address</h2>

      <div className="bg-surface p-4 rounded-lg border relative">
        {loading && (
          <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <label className="labelClasses">Delivery Address</label>
        <textarea
          className="inputClasses"
          value={value.address ?? ""}
          onChange={(e) => update("address", e.target.value)}
        />

        <label className="labelClasses mt-3">Mobile</label>
        <input
          className="inputClasses"
          value={value.mobile ?? ""}
          onChange={(e) => update("mobile", e.target.value)}
        />

        <label className="labelClasses mt-3">City</label>
        <input
          className="inputClasses"
          value={value.city ?? ""}
          onChange={(e) => update("city", e.target.value)}
        />

        <label className="labelClasses mt-3">Pin Code</label>
        <input
          className="inputClasses"
          value={value.pin ?? ""}
          onChange={(e) => update("pin", e.target.value)}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button className="ssj-btn ssj-btn-outline w-full" onClick={onBack}>
          <ChevronLeft size={16} strokeWidth={3} />
          Back
        </button>

        <button
          className="ssj-btn w-full"
          onClick={onSubmit}
          disabled={loading}
        >
          <Save size={16} strokeWidth={3} />
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </>
  );
}
