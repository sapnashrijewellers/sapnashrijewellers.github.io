export default function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-xl border-l-4 p-6">
      <div className="font-medium">{children}</div>
    </div>
  );
}
