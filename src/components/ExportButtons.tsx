import type { InspectResult } from '../types';
import { downloadText, toJsonReport, toMarkdownReport } from '../lib/report';

interface Props {
  data: InspectResult;
}

const BUTTON =
  'rounded-lg border border-emerald-500/20 px-3 py-1.5 font-mono text-xs text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300';

export default function ExportButtons({ data }: Props) {
  const base = data.filename.replace(/\.[^.]+$/, '') || 'report';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={BUTTON}
        onClick={() => downloadText(`${base}.inspect.json`, toJsonReport(data), 'application/json')}
      >
        Exportar JSON
      </button>
      <button
        type="button"
        className={BUTTON}
        onClick={() => downloadText(`${base}.inspect.md`, toMarkdownReport(data), 'text/markdown')}
      >
        Exportar Markdown
      </button>
    </div>
  );
}
