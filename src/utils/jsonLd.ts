import type { Product } from '../types';

export const SITE_NAME = 'Lijustore';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lijustore.co.ke';

/** Resolve a product image to an absolute URL for structured data. */
function absoluteImage(image: string): string {
  if (!image) return `${SITE_URL}/logo.jpeg`;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

/** Convert an app Product into a schema.org Product node. */
export function productToJsonLd(product: Product, position?: number): Record<string, unknown> {
  const url = `${SITE_URL}/products/${product.id}`;
  const schema: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
    url,
    image: absoluteImage(product.image),
    description: product.description || product.name,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'KES',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  if (product.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    };
  }

  if (position !== undefined) {
    schema.position = position;
  }

  return schema;
}

/** Build an ItemList of products (for collection/listing pages). */
export function productListJsonLd(products: Product[], name = 'Products'): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => productToJsonLd(p, i + 1)),
  };
}

/** Organization schema describing the store. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpeg`,
    image: `${SITE_URL}/logo.jpeg`,
    description:
      'Lijustore Kenya — shop practical home appliances, electronics, kitchen equipment, furniture, tools, and daily essentials.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['en', 'sw'],
    },
    areaServed: 'KE',
  };
}

/** WebSite schema with site search. */
export function webSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${SITE_NAME} Kenya`,
    url: SITE_URL,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList for the products listing page. */
export function productListingBreadcrumbJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
    ],
  };
}
