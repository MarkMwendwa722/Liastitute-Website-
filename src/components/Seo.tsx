import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
  nofollow?: boolean;
  image?: string;
}

const SITE_NAME = 'Lijustore';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lijustore.co.ke';

export default function Seo({
  title,
  description,
  canonicalPath,
  noindex = false,
  nofollow = false,
  image = '/logo.jpeg',
}: SeoProps) {
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
  }, [canonicalPath, description, image, nofollow, noindex, title]);

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