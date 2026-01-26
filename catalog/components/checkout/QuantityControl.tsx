import { Minus, Plus, Trash2 } from "lucide-react";
type QuantityControlProps = {
  qty: number;
  onChange: (qty: number) => void;
};
//Must implement delete button

export function QuantityControl({ qty, onChange }: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        className="ssj-btn-outline px-3"
        disabled={qty <= 1}
        onClick={() => onChange(qty - 1)}
      >
        <Minus size={16} strokeWidth={3} />
      </button>

      <span className="min-w-[24px] text-center font-medium">
        {qty}
      </span>

      <button
        className="ssj-btn-outline px-3"
        disabled={qty >= 10}
        onClick={() => onChange(qty + 1)}
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
}
