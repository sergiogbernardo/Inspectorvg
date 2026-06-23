import type { ImageInfo } from '../types';

interface Props {
  info: ImageInfo;
}

export default function ImagePanel({ info }: Props) {
  return (
    <div className="panel">
      <h2 className="panel-title mb-4">Imagem</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="field-label">Dimensões</span>
          <span className="font-mono text-sm text-slate-200">
            {info.width} × {info.height} px
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="field-label">Formato</span>
          <span className="font-mono text-sm text-slate-200">{info.format}</span>
        </div>
      </div>
    </div>
  );
}
