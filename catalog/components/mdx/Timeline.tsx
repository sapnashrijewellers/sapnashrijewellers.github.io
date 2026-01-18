type Step = {
  title: string;
  time?: string;
  points: string[];
};

export default function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className="my-10 space-y-6 border-l pl-6">
      {steps.map((step) => (
        <div key={step.title}>
          <h4 className="font-semibold">
            {step.title} {step.time && <span className="text-muted">({step.time})</span>}
          </h4>
          <ul className="mt-2 list-disc pl-4 text-sm">
            {step.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
