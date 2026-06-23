import type { ArchiveInfo } from '../types';
import { formatSize } from '../lib/format';

interface Props {
  info: ArchiveInfo;
}

export default function ArchivePanel({ info }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title mb-4">
        Arquivo compactado <span className="ml-1 text-emerald-300/70">{info.type}</span>
      </h2>
      <p className="mb-3 font-mono text-xs text-slate-400">
        {info.fileCount} itens · {formatSize(info.totalSize)} descompactado
      </p>
      <pre className="max-h-72 overflow-auto rounded-lg border border-emerald-500/10 bg-black/60 p-3 font-mono text-xs leading-relaxed text-slate-300">
        {info.files.join('\n')}
        {info.fileCount > info.files.length && `\n… (+${info.fileCount - info.files.length})`}
      </pre>
    </div>
  );
}
