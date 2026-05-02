const SITE_URL = 'https://postaustin.com';
const SITE_NAME = 'Darrell Keller';
const DEFAULT_TITLE = 'Darrell Keller - Applied AI Design and Engineering';
const DEFAULT_DESCRIPTION = 'AI design and engineering by Darrell Keller, featuring projects, writing, and PostAustin.com work.';
const DEFAULT_IMAGE = '/NAME LOGO 1.png';

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

export function absoluteUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl, SITE_URL).toString();
  } catch {
    return SITE_URL;
  }
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[-#>*_~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateDescription(text: string, maxLength = 155) {
  const cleanText = text.trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength - 1).trim()}...`;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element?.setAttribute(name, value);
  });
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function upsertJsonLd(jsonLd?: Record<string, unknown>) {
  const id = 'route-json-ld';
  const existing = document.getElementById(id);

  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const element = (existing ?? document.createElement('script')) as HTMLScriptElement;
  element.id = id;
  element.type = 'application/ld+json';
  element.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(element);
  }
}

export function updateSeo(options: SeoOptions = {}) {
  const title = options.title ?? DEFAULT_TITLE;
  const description = truncateDescription(options.description ?? DEFAULT_DESCRIPTION);
  const canonicalUrl = absoluteUrl(options.path ?? window.location.pathname);
  const imageUrl = absoluteUrl(options.image ?? DEFAULT_IMAGE);

  document.title = title;

  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: options.noIndex ? 'noindex, nofollow' : 'index, follow',
  });
  upsertLink('canonical', canonicalUrl);

  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: options.type ?? 'website' });

  if (options.publishedTime) {
    upsertMeta('meta[property="article:published_time"]', {
      property: 'article:published_time',
      content: options.publishedTime,
    });
  }

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

  upsertJsonLd(options.jsonLd);
}

export function defaultSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Darrell Keller',
    url: SITE_URL,
    sameAs: [
      'https://github.com/DarrellKeller',
      'https://www.linkedin.com/in/darrell-keller-640a35134/',
    ],
    description: DEFAULT_DESCRIPTION,
  };
}
