# Inspectorvg

Client-side file inspector. Drop any file and get its hashes, entropy, magic
bytes, embedded strings, a hex dump and format metadata — **entirely in the
browser**. No file ever leaves your machine; there is no backend.

It is the GitHub Pages version of the local `file-inspector` project, part of
the [project hub](https://sergiogbernardo.github.io/), alongside
[Bytevg](https://sergiogbernardo.github.io/Bytevg/) and
[Scanvg](https://sergiogbernardo.github.io/Scanvg/).

## Features

- **File info** — size, MIME (from the browser), magic-byte type detection
  (~50 well-known signatures) and the first 16 bytes as hex + ASCII.
- **Hashes** — MD5, SHA-1, SHA-256, SHA-512, SHA3-256 and BLAKE2b.
- **Entropy** — Shannon entropy (bits/byte) with a hint for compressed/encrypted
  data.
- **Strings** — printable ASCII runs (min length 4), searchable.
- **Hex dump** — the first 512 bytes.
- **Archives** — file listing for ZIP, TAR and TAR.GZ.
- **Images** — pixel dimensions and EXIF/GPS metadata when present.
- **PDF** — document info (title, author, producer, …) and page count.

## How it works

Everything runs locally:

- SHA-1/256/512 use the native **Web Crypto API**; MD5, SHA3-256 and BLAKE2b use
  [`hash-wasm`](https://github.com/Daninet/hash-wasm).
- Archive listing uses [`fflate`](https://github.com/101arrowz/fflate); EXIF uses
  [`exifr`](https://github.com/MikeKovarik/exifr).
- Magic-byte detection and the hex/strings/entropy logic are plain TypeScript.

### Limitations (by design, since there is no backend)

- No `libmagic`: type detection relies on the signature table plus the browser
  MIME guess.
- Image frame/animation details are not reported.
- PDF metadata is read with a lightweight parser; encrypted or heavily
  compressed PDFs may expose less.

## Stack

React + TypeScript + Vite + Tailwind. No backend, no tracking.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

The Vite `base` is `/Inspectorvg/` to match GitHub Pages. Deployment is automated
by `.github/workflows/deploy.yml` on every push to `main`.
