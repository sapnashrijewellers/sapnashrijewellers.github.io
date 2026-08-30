export default function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-xl border-l-4 border-accent bg-accent/5 p-6">
      <div className="font-medium">{children}</div>
    </div>
  );
}
