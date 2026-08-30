export default function Testimonial({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role?: string;
}) {
  return (
    <blockquote className="my-10 rounded-xl border p-6 bg-background shadow">
      <p className="italic mb-4">“{quote}”</p>
      <footer className="text-sm font-medium">
        {author}
        {role && <span className="text-muted"> — {role}</span>}
      </footer>
    </blockquote>
  );
}
