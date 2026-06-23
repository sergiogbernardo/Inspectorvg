// Lightweight PDF metadata extraction without a full parser. Reads the document
// Info dictionary fields and counts page objects. Good enough for a quick look;
// encrypted or heavily compressed PDFs may expose less.
const INFO_FIELDS = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'];

export function inspectPdf(data: Uint8Array): Record<string, string | number> | undefined {
  // Decode as latin1 so byte values map 1:1 to characters for regex scanning.
  const text = new TextDecoder('latin1').decode(data);
  const meta: Record<string, string | number> = {};

  for (const field of INFO_FIELDS) {
    // Matches `/Title (value)` style entries in the Info dictionary.
    const match = new RegExp(`/${field}\\s*\\(([^)]*)\\)`).exec(text);
    if (match && match[1].trim()) meta[field.toLowerCase()] = match[1].trim().slice(0, 200);
  }

  // Count page objects (avoid matching `/Pages`, the tree root).
  const pageMatches = text.match(/\/Type\s*\/Page(?![s])/g);
  if (pageMatches) meta.pages = pageMatches.length;

  return Object.keys(meta).length > 0 ? meta : undefined;
}
