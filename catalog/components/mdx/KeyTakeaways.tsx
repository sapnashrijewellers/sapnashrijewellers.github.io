export default function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="my-12 rounded-xl bg-muted p-6">
      <h3 className="mb-4 text-xl font-semibold">Key Takeaways</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}
