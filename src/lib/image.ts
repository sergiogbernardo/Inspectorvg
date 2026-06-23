import exifr from 'exifr';
import type { ImageInfo } from '../types';

// Read pixel dimensions by decoding the image in the browser. Works for any
// raster format the browser itself supports (PNG, JPEG, GIF, WebP, BMP, ...).
export async function readImageInfo(blob: Blob, format: string): Promise<ImageInfo | undefined> {
  try {
    const bitmap = await createImageBitmap(blob);
    const info = { width: bitmap.width, height: bitmap.height, format };
    bitmap.close();
    return info;
  } catch {
    return undefined;
  }
}

// EXIF/GPS metadata, when present (mostly JPEG/TIFF/HEIC). Values are stringified
// and truncated to keep the UI readable.
export async function readExif(blob: Blob): Promise<Record<string, string> | undefined> {
  try {
    const raw = await exifr.parse(blob);
    if (!raw || typeof raw !== 'object') return undefined;

    const exif: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value == null) continue;
      exif[key] = String(value).slice(0, 200);
    }
    return Object.keys(exif).length > 0 ? exif : undefined;
  } catch {
    return undefined;
  }
}
