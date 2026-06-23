import { useState } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import FileInfo from './components/FileInfo';
import HashPanel from './components/HashPanel';
import HexViewer from './components/HexViewer';
import StringsPanel from './components/StringsPanel';
import ArchivePanel from './components/ArchivePanel';
import ImagePanel from './components/ImagePanel';
import MetadataPanel from './components/MetadataPanel';
import { inspectFile } from './lib/inspect';
import type { InspectResult } from './types';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InspectResult | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setData(null);
    setLoading(true);
    try {
      setData(await inspectFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao analisar o arquivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid-glow">
      <TopBar />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
        <Hero />
        <UploadZone onFile={handleFile} loading={loading} />

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-8 space-y-4">
            <FileInfo data={data} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <HashPanel hashes={data.hashes} />
              <div className="space-y-4">
                {data.image && <ImagePanel info={data.image} />}
                {data.archive && <ArchivePanel info={data.archive} />}
                {data.exif && <MetadataPanel title="EXIF" entries={data.exif} />}
                {data.pdf && <MetadataPanel title="PDF" entries={data.pdf} />}
              </div>
            </div>

            <HexViewer dump={data.hexDump} />
            <StringsPanel strings={data.strings} count={data.stringsCount} />
          </div>
        )}
      </main>

      <footer className="border-t border-emerald-500/10 py-6 text-center font-mono text-xs text-slate-600">
        Inspectorvg · análise 100% no navegador ·{' '}
        <a href="https://sergiogbernardo.github.io/" className="hover:text-emerald-400">
          hub
        </a>
      </footer>
    </div>
  );
}
