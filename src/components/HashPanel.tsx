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
            <div className="flex items-center justify-between">
              <span className="field-label mb-0">{label}</span>
              <CopyButton value={hashes[key]} />
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
