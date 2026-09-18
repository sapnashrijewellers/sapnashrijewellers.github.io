import { Address } from '@/types/catalog';

type AddressSummaryProps = {
  address: Address | undefined;
  onEdit: () => void;
};

export function AddressSummary({ address, onEdit }: AddressSummaryProps) {
  if (!address) return <p>Address not available</p>;
  return (
    <div className="bg-surface border-theme mt-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <h3 className="">Delivery Address</h3>

        <button onClick={onEdit} className="cursor-pointer text-sm underline">
          Edit
        </button>
      </div>

      <div className="mt-3 text-sm leading-relaxed">
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
