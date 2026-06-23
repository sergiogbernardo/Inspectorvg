// Shannon entropy in bits per byte (0–8). High values (~8) suggest compressed
// or encrypted data; low values suggest plain text or padding.
export function computeEntropy(data: Uint8Array): number {
  if (data.length === 0) return 0;

  const freq = new Array<number>(256).fill(0);
  for (const byte of data) freq[byte]++;

  let entropy = 0;
  for (const count of freq) {
    if (count === 0) continue;
    const p = count / data.length;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 10000) / 10000;
}
