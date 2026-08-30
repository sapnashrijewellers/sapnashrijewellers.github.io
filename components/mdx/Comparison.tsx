export default function Comparison({
  before,
  after,
}: {
  before: Record<string, string>;
  after: Record<string, string>;
}) {
  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {[{ title: "Before", data: before }, { title: "After", data: after }].map(
        (block) => (
          <div key={block.title} className="rounded-xl border p-6">
            <h4 className="mb-4 font-semibold">{block.title}</h4>
            <ul className="space-y-2 text-sm">
              {Object.entries(block.data).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
