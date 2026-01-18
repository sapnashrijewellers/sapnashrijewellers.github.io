type Metric = { label: string; value: string };

export default function Metrics({ items }: { items: Metric[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
      {items.map((m) => (
        <div
          key={m.label}
          className="rounded-xl bg-muted p-6 text-center shadow-sm"
        >
          <div className="text-2xl font-bold text-accent">{m.value}</div>
          <div className="text-sm text-muted">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
