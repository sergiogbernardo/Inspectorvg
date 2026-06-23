import type { IocMatches } from '../lib/iocs';

interface Props {
  iocs: IocMatches;
}

function List({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <span className="field-label">
        {label} <span className="text-slate-500">({items.length})</span>
      </span>
      <pre className="max-h-40 overflow-auto rounded-lg border border-emerald-500/10 bg-black/60 p-2 font-mono text-xs leading-relaxed text-slate-300">
        {items.join('\n')}
      </pre>
    </div>
  );
}

export default function IocPanel({ iocs }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title mb-4">Indicadores (IOCs)</h2>

      {iocs.secrets.length > 0 && (
        <div className="mb-4">
          <span className="field-label text-amber-300">
            Possíveis segredos <span className="text-amber-400/70">({iocs.secrets.length})</span>
          </span>
          <div className="space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2">
            {iocs.secrets.map((s, i) => (
              <div key={i} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300/80 sm:w-36 sm:shrink-0">
                  {s.type}
                </span>
                <code className="break-all font-mono text-xs text-amber-100">{s.value}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <List label="URLs" items={iocs.urls} />
        <List label="IPs (v4)" items={iocs.ipv4} />
        <List label="E-mails" items={iocs.emails} />
        <List label="Domínios" items={iocs.domains} />
        <List label="Blocos base64" items={iocs.base64} />
      </div>
    </div>
  );
}
