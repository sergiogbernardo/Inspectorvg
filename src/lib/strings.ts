import { isPrintable } from './format';

// Extract runs of printable ASCII characters, mirroring the classic `strings`
// utility. Returns every match; the UI is responsible for capping the display.
export function extractStrings(data: Uint8Array, minLen = 4): string[] {
  const result: string[] = [];
  let current: number[] = [];

  for (const byte of data) {
    if (isPrintable(byte)) {
      current.push(byte);
    } else {
      if (current.length >= minLen) result.push(String.fromCharCode(...current));
      current = [];
    }
  }
  if (current.length >= minLen) result.push(String.fromCharCode(...current));

  return result;
}
