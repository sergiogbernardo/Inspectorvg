import { gunzipSync, unzipSync } from 'fflate';
import type { ArchiveInfo } from '../types';

const MAX_LISTED = 100;
// Guard against decompressing very large archives entirely in memory.
const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024;

function isZip(data: Uint8Array): boolean {
  return data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04;
}

function isGzip(data: Uint8Array): boolean {
  return data[0] === 0x1f && data[1] === 0x8b && data[2] === 0x08;
}

function hasUstarMagic(data: Uint8Array): boolean {
  // "ustar" at offset 257
  const m = [0x75, 0x73, 0x74, 0x61, 0x72];
  if (data.length < 257 + m.length) return false;
  return m.every((b, i) => data[257 + i] === b);
}

function readZip(data: Uint8Array): ArchiveInfo {
  const entries = unzipSync(data);
  const names = Object.keys(entries);
  const totalSize = names.reduce((sum, n) => sum + entries[n].length, 0);
  return { type: 'ZIP', fileCount: names.length, files: names.slice(0, MAX_LISTED), totalSize };
}

// Minimal ustar TAR walker: 512-byte header blocks with an octal size field.
function readTar(data: Uint8Array, type: string): ArchiveInfo {
  const decoder = new TextDecoder();
  const files: string[] = [];
  let totalSize = 0;
  let fileCount = 0;
  let offset = 0;

  while (offset + 512 <= data.length) {
    const header = data.subarray(offset, offset + 512);
    // Two consecutive zero blocks mark the end of the archive.
    if (header.every((b) => b === 0)) break;

    const name = decoder.decode(header.subarray(0, 100)).split('\0')[0];
    const sizeStr = decoder.decode(header.subarray(124, 136)).replace(/[^0-7]/g, '');
    const size = sizeStr ? parseInt(sizeStr, 8) : 0;

    if (name) {
      fileCount++;
      totalSize += size;
      if (files.length < MAX_LISTED) files.push(name);
    }

    // Advance past the header plus the file content rounded up to 512 bytes.
    offset += 512 + Math.ceil(size / 512) * 512;
  }

  return { type, fileCount, files, totalSize };
}

export function inspectArchive(data: Uint8Array): ArchiveInfo | undefined {
  if (data.length > MAX_ARCHIVE_BYTES) return undefined;

  try {
    if (isZip(data)) return readZip(data);

    if (isGzip(data)) {
      const inflated = gunzipSync(data);
      if (hasUstarMagic(inflated)) return readTar(inflated, 'TAR.GZ');
      // Plain gzip of a single file — no member listing available.
      return undefined;
    }

    if (hasUstarMagic(data)) return readTar(data, 'TAR');
  } catch {
    // Corrupt or unsupported archive — skip the panel rather than fail.
  }
  return undefined;
}
