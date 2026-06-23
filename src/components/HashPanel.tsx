import type { FileHashes } from '../types';
import CopyButton from './CopyButton';

interface Props {
  hashes: FileHashes;
}

const LABELS: { key: keyof FileHashes; label: string }[] = [
  { key: 'md5', label: 'MD5' },
  { key: 'sha1', label: 'SHA-1' },
  { key: 'sha256', label: 'SHA-256' },
  { key: 'sha512', label: 'SHA-512' },
  { key: 'sha3_256', label: 'SHA3-256' },
  { key: 'blake2b', label: 'BLAKE2b' },
];

export default function HashPanel({ hashes }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title mb-4">Hashes</h2>
      <div className="space-y-3">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="field-label mb-0">{label}</span>
              <div className="flex items-center gap-2">
                {key === 'sha256' && (
                  <a
                    href={`https://www.virustotal.com/gui/file/${hashes.sha256}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Consultar este hash no VirusTotal (só o hash é enviado)"
                    className="rounded-md border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 transition hover:border-emerald-400/50 hover:text-emerald-300"
                  >
                    VirusTotal
                  </a>
                )}
                <CopyButton value={hashes[key]} />
              </div>
            </div>
            <code className="block break-all rounded-lg border border-emerald-500/10 bg-black/60 px-3 py-2 font-mono text-xs text-emerald-200/90">
              {hashes[key]}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
