export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-10 rounded-xl border bg-background p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}
