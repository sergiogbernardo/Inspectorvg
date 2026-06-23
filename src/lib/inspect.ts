import type { InspectResult } from '../types';
import { asciiOrDot, formatSize, toHex } from './format';
import { computeEntropy } from './entropy';
import { computeHashes } from './hashes';
import { detectMagic } from './magic';
import { extractStrings } from './strings';
import { hexDump } from './hexdump';
import { inspectArchive } from './archive';
import { readExif, readImageInfo } from './image';
import { inspectPdf } from './pdf';

const MAX_STRINGS = 500;
const SIGNATURE_BYTES = 16;

function isImageMagic(magic: string | null): boolean {
  return magic != null && /image/i.test(magic);
}

// Runs the full analysis on a file entirely in the browser. Nothing is uploaded.
export async function inspectFile(file: File): Promise<InspectResult> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);

  const magic = detectMagic(data);
  const sig = data.subarray(0, SIGNATURE_BYTES);
  const allStrings = extractStrings(data);

  const result: InspectResult = {
    filename: file.name,
    size: data.length,
    sizeHuman: formatSize(data.length),
    mimeType: file.type || null,
    magic,
    entropy: computeEntropy(data),
    signatureHex: Array.from(sig, toHex).join(' '),
    signatureAscii: Array.from(sig, asciiOrDot).join(''),
    hexDump: hexDump(data),
    hashes: await computeHashes(data),
    stringsCount: allStrings.length,
    strings: allStrings.slice(0, MAX_STRINGS),
  };

  const archive = inspectArchive(data);
  if (archive) result.archive = archive;

  if (isImageMagic(magic)) {
    const image = await readImageInfo(file, magic ?? 'image');
    if (image) result.image = image;
    const exif = await readExif(file);
    if (exif) result.exif = exif;
  }

  if (magic === 'PDF document' || file.name.toLowerCase().endsWith('.pdf')) {
    const pdf = inspectPdf(data);
    if (pdf) result.pdf = pdf;
  }

  return result;
}
