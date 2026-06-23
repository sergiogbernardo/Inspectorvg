import type { InspectResult } from '../types';

interface Props {
  data: InspectResult;
}

function entropyHint(entropy: number): { label: string; color: string } {
  if (entropy >= 7.5) return { label: 'alta — comprimido/cifrado', color: 'text-amber-300' };
  if (entropy >= 5) return { label: 'média', color: 'text-emerald-300' };
  return { label: 'baixa — texto/estruturado', color: 'text-slate-300' };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="field-label">{label}</span>
      <span className="break-all font-mono text-sm text-slate-200">{children}</span>
    </div>
  );
}

export default function FileInfo({ data }: Props) {
  const hint = entropyHint(data.entropy);

  return (
    <div className="panel">
      <h2 className="panel-title mb-4">Arquivo</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Row label="Nome">{data.filename}</Row>
        <Row label="Tamanho">
          {data.sizeHuman} <span className="text-slate-500">({data.size} bytes)</span>
        </Row>
        <Row label="Tipo (magic bytes)">{data.magic ?? '—'}</Row>
        <Row label="MIME (navegador)">{data.mimeType ?? '—'}</Row>
        <Row label="Entropia">
          {data.entropy.toFixed(4)} <span className={hint.color}>· {hint.label}</span>
        </Row>
        <Row label="Assinatura (16 bytes)">
          <span className="text-slate-300">{data.signatureHex}</span>
          <span className="ml-2 text-slate-500">{data.signatureAscii}</span>
        </Row>
      </div>
    </div>
  );
}
