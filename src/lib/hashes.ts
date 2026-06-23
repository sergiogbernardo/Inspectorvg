import { blake2b, md5, sha3 } from 'hash-wasm';
import type { FileHashes } from '../types';

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function webCryptoHash(algorithm: AlgorithmIdentifier, data: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, data as BufferSource);
  return bufferToHex(digest);
}

// SHA-1/256/512 come from the native Web Crypto API; MD5, SHA3-256 and BLAKE2b
// are not available there, so hash-wasm (WASM) covers them — same approach as
// the Bytevg sibling project.
export async function computeHashes(data: Uint8Array): Promise<FileHashes> {
  const [sha1, sha256, sha512, md5Hex, sha3Hex, blake2bHex] = await Promise.all([
    webCryptoHash('SHA-1', data),
    webCryptoHash('SHA-256', data),
    webCryptoHash('SHA-512', data),
    md5(data),
    sha3(data, 256),
    blake2b(data, 512),
  ]);

  return { md5: md5Hex, sha1, sha256, sha512, sha3_256: sha3Hex, blake2b: blake2bHex };
}
