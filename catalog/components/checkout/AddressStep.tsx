import {Address} from "@/types/catalog"
import { useEffect, useState } from "react";
import { Trash2, Save, Check, ChevronLeft, ChevronRight } from "lucide-react";

type AddressStepProps = {
  address: Address | undefined;
  onSave: (address: Address) => void;
  onNext: () => void;
  onBack: () => void;
};
export default function AddressStep({ address,
  onSave,
  onNext,
  onBack, }:AddressStepProps    
) {
  const [draft, setDraft] = useState<Address>(
    address ?? new Address()
  );
  useEffect(() => {
    setDraft(address ?? new Address());
  }, [address]);

  async function save() {
    // await fetch("/api/address", {
    //   method: "POST",
    //   body: JSON.stringify(draft),
    // });
    onSave(draft);
    onNext();
  }

  return (
    <>
      <h2 className="text-xl mb-4 inline-flex">Cart  / Delivery Address</h2>
     {/* Address */}
      <div className="bg-surface p-4 rounded-lg border border-default mt-4">
        <label className="labelClasses">Delivery Address</label>
        <textarea
          className="inputClasses"
          value={address?.address}
          onChange={(e) => setDraft({ ...draft, address:e.target.value})}
        />

        <label className="labelClasses mt-3">Mobile</label>
        <input
          className="inputClasses"
          value={address?.mobile}
          onChange={(e) => setDraft({ ...draft, mobile:e.target.value})}
        />

        <label className="labelClasses mt-3">City</label>
        <input
          className="inputClasses"
          value={address?.city}
          onChange={(e) => setDraft({ ...draft, city:e.target.value})}
        />

        <label className="labelClasses mt-3">Pin Code</label>
        <input
          className="inputClasses"
          value={address?.pin}
          onChange={(e) => setDraft({ ...draft, pin:e.target.value})}
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button
          className="ssj-btn ssj-btn-outline w-full"
          onClick={onBack}
        >
          <ChevronLeft size={16} strokeWidth={3} />
          Back
        </button>

        <button
          className="ssj-btn  w-full"
          onClick={save}
        >
          <Save size={16} strokeWidth={3} />
          Save & Continue
        </button>
      </div>
    </>
  );
}
