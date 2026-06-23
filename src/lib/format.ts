export function formatSize(n: number): string {
  if (n < 1024) return `${n} B`;
  let value = n;
  for (const unit of ['KB', 'MB', 'GB', 'TB']) {
    value /= 1024;
    if (value < 1024) return `${value.toFixed(1)} ${unit}`;
  }
  return `${value.toFixed(1)} PB`;
}

export function toHex(byte: number): string {
  return byte.toString(16).padStart(2, '0');
}

const PRINTABLE_MIN = 32;
const PRINTABLE_MAX = 126;

export function isPrintable(byte: number): boolean {
  return byte >= PRINTABLE_MIN && byte <= PRINTABLE_MAX;
}

export function asciiOrDot(byte: number): string {
  return isPrintable(byte) ? String.fromCharCode(byte) : '.';
}
