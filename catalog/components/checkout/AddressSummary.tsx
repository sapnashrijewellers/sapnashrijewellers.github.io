import {Address} from "@/types/catalog";

type AddressSummaryProps = {
  address: Address | undefined;
  onEdit: () => void;
};

export function AddressSummary({ address, onEdit }: AddressSummaryProps) {
  if(!address) return(<p>Address not available</p>);
  return (
    <div className="bg-surface border border-theme rounded-lg p-4 mt-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-yatra">Delivery Address</h3>

        <button
          onClick={onEdit}
          className="text-sm underline text-primary"
        >
          Edit
        </button>
      </div>

      <div className="mt-3 text-sm leading-relaxed text-normal">
        <p className="font-medium">{address.name}</p>
        <p>{address.address}</p>
        <p>
          {address.city} – {address.pin}
        </p>
        <p className="mt-1">📞 {address.mobile}</p>
        <p className="text-muted">{address.email}</p>
      </div>
    </div>
  );
}
