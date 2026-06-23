import type { InspectResult } from '../types';

// The hex dump and full strings list are intentionally excluded from reports to
// keep them readable; counts are reported instead.
export function toJsonReport(r: InspectResult): string {
  const { hexDump: _hexDump, strings: _strings, ...rest } = r;
  return JSON.stringify({ ...rest, stringsCount: r.stringsCount }, null, 2);
}

export function toMarkdownReport(r: InspectResult): string {
  const lines: string[] = [];
  lines.push(`# Inspectorvg — ${r.filename}`, '');
  lines.push('## Arquivo', '');
  lines.push(`- **Tamanho:** ${r.sizeHuman} (${r.size} bytes)`);
  lines.push(`- **Tipo (magic):** ${r.magic ?? '—'}`);
  lines.push(`- **MIME (navegador):** ${r.mimeType ?? '—'}`);
  lines.push(`- **Entropia:** ${r.entropy.toFixed(4)} bits/byte`);
  lines.push(`- **Assinatura:** \`${r.signatureHex}\``, '');

  lines.push('## Hashes', '');
  lines.push(`- **MD5:** \`${r.hashes.md5}\``);
  lines.push(`- **SHA-1:** \`${r.hashes.sha1}\``);
  lines.push(`- **SHA-256:** \`${r.hashes.sha256}\``);
  lines.push(`- **SHA-512:** \`${r.hashes.sha512}\``);
  lines.push(`- **SHA3-256:** \`${r.hashes.sha3_256}\``);
  lines.push(`- **BLAKE2b:** \`${r.hashes.blake2b}\``, '');

  if (r.iocs) {
    lines.push('## Indicadores (IOCs)', '');
    if (r.iocs.secrets.length > 0) {
      lines.push('### Possíveis segredos', '');
      for (const s of r.iocs.secrets) lines.push(`- **${s.type}:** \`${s.value}\``);
      lines.push('');
    }
    const cats: [string, string[]][] = [
      ['URLs', r.iocs.urls],
      ['IPs', r.iocs.ipv4],
      ['E-mails', r.iocs.emails],
      ['Domínios', r.iocs.domains],
      ['Base64', r.iocs.base64],
    ];
    for (const [label, items] of cats) {
      if (items.length > 0) lines.push(`- **${label}:** ${items.length}`);
    }
    lines.push('');
  }

  if (r.archive) {
    lines.push(`## Compactado (${r.archive.type})`, '');
    lines.push(`- **Itens:** ${r.archive.fileCount}`);
    lines.push(`- **Tamanho descompactado:** ${r.archive.totalSize} bytes`, '');
  }

  if (r.image) {
    lines.push('## Imagem', '');
    lines.push(`- **Dimensões:** ${r.image.width} × ${r.image.height} px`);
    lines.push(`- **Formato:** ${r.image.format}`, '');
  }

  if (r.exif) {
    lines.push('## EXIF', '');
    for (const [k, v] of Object.entries(r.exif)) lines.push(`- **${k}:** ${v}`);
    lines.push('');
  }

  if (r.pdf) {
    lines.push('## PDF', '');
    for (const [k, v] of Object.entries(r.pdf)) lines.push(`- **${k}:** ${v}`);
    lines.push('');
  }

  lines.push(`- **Strings:** ${r.stringsCount} no total`);
  return lines.join('\n');
}

export function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
