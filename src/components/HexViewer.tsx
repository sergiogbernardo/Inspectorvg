interface Props {
  dump: string;
}

export default function HexViewer({ dump }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title mb-4">Hex dump (primeiros 512 bytes)</h2>
      <pre className="max-h-96 overflow-auto rounded-lg border border-emerald-500/10 bg-black/60 p-3 font-mono text-xs leading-relaxed text-slate-300">
        {dump}
      </pre>
    </div>
  );
}
