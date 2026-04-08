export interface RelMeLink {
  label: string;
  url: string;
}

export const DEFAULT_REL_ME_LINKS_RAW = [
  'GitHub|https://github.com/DarrellKeller',
  'LinkedIn|https://www.linkedin.com/in/darrell-keller-640a35134/',
].join('\n');

function deriveLabel(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname.split('.')[0] || 'Profile';
  } catch {
    return 'Profile';
  }
}

export function parseRelMeLinks(rawValue: string | null | undefined): RelMeLink[] {
  if (!rawValue) return [];

  return rawValue
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, urlPart] = line.includes('|')
        ? line.split('|', 2)
        : ['', line];

      const url = urlPart.trim();
      if (!url) return null;

      return {
        label: labelPart.trim() || deriveLabel(url),
        url,
      };
    })
    .filter((link): link is RelMeLink => Boolean(link));
}
