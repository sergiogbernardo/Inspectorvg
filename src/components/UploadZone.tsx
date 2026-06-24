import { useRef, useState } from 'react';

interface Props {
  onFile: (file: File) => void;
  loading: boolean;
}

export default function UploadZone({ onFile, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (files: FileList | null) => {
    if (files && files.length > 0) onFile(files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
        dragging
          ? 'border-emerald-400/70 bg-emerald-400/5'
          : 'border-emerald-500/20 bg-black/40 hover:border-emerald-400/50'
      }`}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => pick(e.target.files)} />
      <p className="font-display text-lg font-semibold text-slate-200">
        {loading ? 'Analisando…' : 'Solte um arquivo aqui'}
      </p>
      <p className="mt-1 font-mono text-xs text-slate-500">
        {loading ? 'processando no navegador' : 'ou clique para selecionar'}
      </p>
    </div>
  );
}
