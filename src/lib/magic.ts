// Magic-number signatures, ported and curated from the original Python
// `_SIG_DB`. Bogus/duplicate entries from the source were dropped; what remains
// are well-known file signatures. Each entry is matched at a fixed byte offset.
interface Signature {
  hex: string; // space-free lowercase hex of the magic bytes
  offset: number;
  name: string;
}

const SIGNATURES: Signature[] = [
  { hex: '89504e470d0a1a0a', offset: 0, name: 'PNG image' },
  { hex: 'ffd8ff', offset: 0, name: 'JPEG image' },
  { hex: '47494638', offset: 0, name: 'GIF image' },
  { hex: '424d', offset: 0, name: 'BMP image' },
  { hex: '25504446', offset: 0, name: 'PDF document' },
  { hex: '504b0304', offset: 0, name: 'ZIP archive (or OOXML/JAR/APK)' },
  { hex: '504b0506', offset: 0, name: 'ZIP archive (empty)' },
  { hex: '504b0708', offset: 0, name: 'ZIP archive (spanned)' },
  { hex: '526172211a07', offset: 0, name: 'RAR archive' },
  { hex: '1f8b08', offset: 0, name: 'GZIP compressed' },
  { hex: '425a68', offset: 0, name: 'BZip2 compressed' },
  { hex: 'fd377a585a00', offset: 0, name: 'XZ compressed' },
  { hex: '7573746172', offset: 257, name: 'TAR archive (ustar)' },
  { hex: '04224d18', offset: 0, name: 'LZ4 compressed' },
  { hex: '28b52ffd', offset: 0, name: 'Zstandard compressed' },
  { hex: '377abcaf271c', offset: 0, name: '7z archive' },
  { hex: '4d534346', offset: 0, name: 'Microsoft Cabinet' },
  { hex: '494433', offset: 0, name: 'MP3 (ID3)' },
  { hex: 'fffb', offset: 0, name: 'MP3' },
  { hex: '494953', offset: 0, name: 'TIFF' },
  { hex: '49492a00', offset: 0, name: 'TIFF (little-endian)' },
  { hex: '4d4d002a', offset: 0, name: 'TIFF (big-endian)' },
  { hex: 'cafebabe', offset: 0, name: 'Java class file' },
  { hex: 'cffaedfe', offset: 0, name: 'Mach-O (32-bit)' },
  { hex: 'cefaedfe', offset: 0, name: 'Mach-O (reverse 32-bit)' },
  { hex: 'feedface', offset: 0, name: 'Mach-O (64-bit)' },
  { hex: 'feedfacf', offset: 0, name: 'Mach-O (reverse 64-bit)' },
  { hex: '7f454c46', offset: 0, name: 'ELF binary' },
  { hex: '4d5a', offset: 0, name: 'PE / DOS executable' },
  { hex: '4f54544f', offset: 0, name: 'OpenType font' },
  { hex: '0001000000', offset: 0, name: 'TrueType font' },
  { hex: '774f4646', offset: 0, name: 'WOFF font' },
  { hex: '774f4632', offset: 0, name: 'WOFF2 font' },
  { hex: '3c3f786d6c', offset: 0, name: 'XML document' },
  { hex: '3c737667', offset: 0, name: 'SVG image' },
  { hex: '52494646', offset: 0, name: 'RIFF (AVI/WAV/WebP)' },
  { hex: '1a45dfa3', offset: 0, name: 'Matroska (MKV/WebM)' },
  { hex: '66747970', offset: 4, name: 'ISO Base Media (MP4/MOV/3GP)' },
  { hex: '4f676753', offset: 0, name: 'OGG container' },
  { hex: '664c6143', offset: 0, name: 'FLAC audio' },
  { hex: '4d546864', offset: 0, name: 'MIDI' },
  { hex: '3026b2758e66cf11', offset: 0, name: 'ASF (WMV/WMA)' },
  { hex: '53514c69746520666f726d6174203300', offset: 0, name: 'SQLite database' },
  { hex: '7b5c727466', offset: 0, name: 'RTF document' },
  { hex: '2321', offset: 0, name: 'Script (shebang)' },
  { hex: '3c3f706870', offset: 0, name: 'PHP script' },
  { hex: '25215053', offset: 0, name: 'PostScript' },
  { hex: '213c617263683e0a', offset: 0, name: 'ar archive / .deb' },
  { hex: 'efbbbf', offset: 0, name: 'UTF-8 text (BOM)' },
  { hex: 'fffe', offset: 0, name: 'UTF-16 LE text (BOM)' },
  { hex: 'feff', offset: 0, name: 'UTF-16 BE text (BOM)' },
];

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

const COMPILED = SIGNATURES.map((s) => ({ ...s, bytes: hexToBytes(s.hex) }));

export function detectMagic(data: Uint8Array): string | null {
  for (const { bytes, offset, name } of COMPILED) {
    if (data.length < offset + bytes.length) continue;
    let match = true;
    for (let i = 0; i < bytes.length; i++) {
      if (data[offset + i] !== bytes[i]) {
        match = false;
        break;
      }
    }
    if (match) return name;
  }
  return null;
}
