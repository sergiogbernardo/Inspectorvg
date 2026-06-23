// Indicator-of-compromise and secret extraction over already-extracted strings.
// Pure regex/string work — reusable beyond Inspectorvg (e.g. the loghive sibling).

export interface SecretMatch {
  type: string;
  value: string;
}

export interface IocMatches {
  urls: string[];
  ipv4: string[];
  emails: string[];
  domains: string[];
  base64: string[];
  secrets: SecretMatch[];
}

const PATTERNS = {
  url: /\bhttps?:\/\/[^\s"'<>)]+/gi,
  ipv4: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  domain: /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi,
  base64: /\b[A-Za-z0-9+/]{40,}={0,2}\b/g,
};

// High-signal secret patterns only, to avoid noisy false positives.
const SECRET_PATTERNS: { type: string; re: RegExp }[] = [
  { type: 'AWS Access Key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { type: 'GitHub Token', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b/g },
  { type: 'GitHub PAT', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { type: 'Google API Key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { type: 'Slack Token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { type: 'JWT', re: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  { type: 'Private Key', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },
];

const MAX_PER_CATEGORY = 100;

function collect(text: string, re: RegExp): string[] {
  const seen = new Set<string>();
  for (const match of text.matchAll(re)) {
    seen.add(match[0]);
    if (seen.size >= MAX_PER_CATEGORY) break;
  }
  return [...seen];
}

export function extractIocs(strings: string[]): IocMatches {
  const text = strings.join('\n');

  const urls = collect(text, PATTERNS.url);
  const emails = collect(text, PATTERNS.email);

  // Drop domains already covered by a URL or email to reduce duplication noise.
  const covered = new Set([...urls, ...emails].join(' ').toLowerCase().match(PATTERNS.domain) ?? []);
  const domains = collect(text, PATTERNS.domain).filter((d) => !covered.has(d.toLowerCase()));

  const secrets: SecretMatch[] = [];
  const secretSeen = new Set<string>();
  for (const { type, re } of SECRET_PATTERNS) {
    for (const value of collect(text, re)) {
      if (secretSeen.has(value)) continue;
      secretSeen.add(value);
      secrets.push({ type, value });
    }
  }

  return {
    urls,
    ipv4: collect(text, PATTERNS.ipv4),
    emails,
    domains,
    base64: collect(text, PATTERNS.base64),
    secrets,
  };
}

export function hasIocs(iocs: IocMatches): boolean {
  return (
    iocs.urls.length > 0 ||
    iocs.ipv4.length > 0 ||
    iocs.emails.length > 0 ||
    iocs.domains.length > 0 ||
    iocs.base64.length > 0 ||
    iocs.secrets.length > 0
  );
}
