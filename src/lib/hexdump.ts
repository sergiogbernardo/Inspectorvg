import { asciiOrDot, toHex } from './format';

// Classic 16-bytes-per-row hex dump of the first `maxBytes` bytes.
export function hexDump(data: Uint8Array, maxBytes = 512): string {
  const lines: string[] = [];
  const limit = Math.min(data.length, maxBytes);

  for (let i = 0; i < limit; i += 16) {
    const chunk = data.subarray(i, i + 16);
    const hexPart = Array.from(chunk, toHex).join(' ').padEnd(47, ' ');
    const asciiPart = Array.from(chunk, asciiOrDot).join('');
    const offset = i.toString(16).padStart(8, '0');
    lines.push(`${offset}  ${hexPart}  ${asciiPart}`);
  }

  if (data.length > maxBytes) {
    lines.push(`... (${data.length - maxBytes} bytes a mais)`);
  }
  return lines.join('\n');
}
