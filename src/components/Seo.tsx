'use client'

import { useEffect, useMemo } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
  nofollow?: boolean;
  image?: string;
  jsonLd?: object | object[];
}

const SITE_NAME = 'Lijustore';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lijustore.co.ke';

export default function Seo({
  title,
  description,
  canonicalPath,
  noindex = false,
  nofollow = false,
  image = '/logo.jpeg',
  jsonLd,
}: SeoProps) {
  // Serialize JSON-LD to a stable key so the effect only re-runs when the
  // actual structured data content changes (not on every render).
  const jsonLdKey = useMemo(() => JSON.stringify(jsonLd ?? null), [jsonLd]);

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
    const imageUrl = new URL(image, SITE_URL).toString();
    const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

    document.title = fullTitle;
    setMeta('description', description);
    setMeta('robots', robotsContent);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', imageUrl, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);
    setCanonical(canonicalUrl);

    // JSON-LD structured data.
    // NOTE: when `jsonLd` is not passed, jsonLdKey is the string "null"
    // (JSON.stringify(null)), which is truthy — so guard against parsing null
    // and normalize a single object to an array before calling .map().
    const parsed = jsonLdKey && jsonLdKey !== 'null' ? JSON.parse(jsonLdKey) : null;
    const schemas: object[] = parsed == null ? [] : Array.isArray(parsed) ? parsed : [parsed];

    const scripts = schemas.map((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => script.remove());
    };
  }, [canonicalPath, description, image, jsonLdKey, nofollow, noindex, title]);

  return null;
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}