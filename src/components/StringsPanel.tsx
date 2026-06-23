import { useMemo, useState } from 'react';

interface Props {
  strings: string[];
  count: number;
}

export default function StringsPanel({ strings, count }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter) return strings;
    const needle = filter.toLowerCase();
    return strings.filter((s) => s.toLowerCase().includes(needle));
  }, [strings, filter]);

  return (
    <div className="panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="panel-title mb-0">
          Strings <span className="ml-1 text-slate-500">({count} no total)</span>
        </h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="filtrar…"
          className="w-40 rounded-lg border border-emerald-500/15 bg-black/60 px-3 py-1.5 font-mono text-xs text-slate-100 outline-none transition focus:border-emerald-400/60"
        />
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg border border-emerald-500/10 bg-black/60 p-3 font-mono text-xs leading-relaxed text-slate-300">
        {filtered.length > 0 ? filtered.join('\n') : 'nenhuma string encontrada'}
      </pre>
      {count > strings.length && (
        <p className="mt-2 font-mono text-[11px] text-slate-500">
          mostrando as primeiras {strings.length} de {count}
        </p>
      )}
    </div>
  );
}
