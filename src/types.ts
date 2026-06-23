export interface FileHashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
  sha3_256: string;
  blake2b: string;
}

export interface ArchiveInfo {
  type: string;
  fileCount: number;
  files: string[];
  totalSize: number;
}

export interface ImageInfo {
  width: number;
  height: number;
  format: string;
}

import type { IocMatches } from './lib/iocs';

export interface InspectResult {
  filename: string;
  size: number;
  sizeHuman: string;
  mimeType: string | null;
  magic: string | null;
  entropy: number;
  signatureHex: string;
  signatureAscii: string;
  hexDump: string;
  hashes: FileHashes;
  stringsCount: number;
  strings: string[];
  iocs?: IocMatches;
  archive?: ArchiveInfo;
  image?: ImageInfo;
  exif?: Record<string, string>;
  pdf?: Record<string, string | number>;
}
