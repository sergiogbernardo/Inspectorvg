interface Props {
  title: string;
  entries: Record<string, string | number>;
}

export default function MetadataPanel({ title, entries }: Props) {
  const rows = Object.entries(entries);
  if (rows.length === 0) return null;

  return (
    <div className="panel">
      <h2 className="panel-title mb-4">{title}</h2>
      <dl className="space-y-2">
        {rows.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 sm:w-40 sm:shrink-0">
              {key}
            </dt>
            <dd className="break-all font-mono text-sm text-slate-200">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
