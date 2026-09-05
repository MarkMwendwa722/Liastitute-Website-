// Shared server-side builders for the Google Merchant product feed and the
// XML sitemap. These are consumed by route handlers at
//   src/app/products_feed.xml/route.ts   →  /products_feed.xml
//   src/app/sitemap.xml/route.ts         →  /sitemap.xml
//
// Because the routes use ISR (export const revalidate), the documents are
// regenerated in the background from the API on a schedule — new products
// added via the API appear WITHOUT a redeploy.

import type { ApiProduct, ApiResponse } from '@/types';
import { deriveProductId } from '@/utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.lijustore.co.ke';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lijustore.co.ke';

export function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch EVERY product from the API by walking all pages (pagination metadata
 * comes back from api.lijustore.co.ke). Fetching a single `limit=100` page
 * would silently drop products once the catalog grows past 100 — which is
 * exactly how a newly added product could fail to appear in the feed.
 *
 * Returns whatever could be fetched (possibly []) if the API is unreachable,
 * so callers can always emit a well-formed document.
 */
export async function fetchAllApiProducts(): Promise<ApiProduct[]> {
  const base = `${API_BASE_URL.replace(/\/$/, '')}/api/products?limit=100`;
  const seen = new Set<string>();
  const all: ApiProduct[] = [];

  for (let page = 1; page <= 50; page += 1) {
    let json: ApiResponse;
    try {
      const res = await fetch(`${base}&page=${page}`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) break;
      json = (await res.json()) as ApiResponse;
    } catch {
      break; // API down / timed out — keep whatever pages we already fetched
    }
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) break;

    let added = 0;
    for (const p of json.data) {
      if (p._id && !seen.has(p._id)) {
        seen.add(p._id);
        all.push(p);
        added += 1;
      }
    }

    const total = Number(json.pagination?.total ?? 0);
    const pages = Number(json.pagination?.pages ?? page);
    if (total > 0 && all.length >= total) break;
    if (page >= pages) break;
    if (added === 0) break; // no progress → API probably ignored the page param
  }

  return all;
}

/**
 * Build the Google Merchant RSS feed. Products missing a description, a real
 * Google product category or an image are SKIPPED with a warning — submitting
 * them would send a literal "null" description / wrong default category to
 * Google, which risks misrepresentation. This mirrors the behaviour of the old
 * scripts/generate-feed.mjs.
 */
export function buildProductFeedXml(products: ApiProduct[]): string {
  const items: string[] = [];

  for (const p of products) {
    const id = deriveProductId(p);
    const description = (p.description || '').toString().trim();
    const googleCategory = (p.googleProductCategory || '').trim();
    const imageUrl = p.imageUrl || (Array.isArray(p.images) && p.images[0]) || '';

    if (!id) {
      console.warn(`⚠️  Skipping "${p.name}": no usable id (externalId/_id)`);
      continue;
    }
    if (!googleCategory) {
      console.warn(`⚠️  Skipping "${p.name}": missing googleProductCategory`);
      continue;
    }
    if (!description) {
      console.warn(`⚠️  Skipping "${p.name}": missing description`);
      continue;
    }
    if (!imageUrl) {
      console.warn(`⚠️  Skipping "${p.name}": missing image`);
      continue;
    }

    const priceFormatted = `${Number(p.price).toFixed(2)} KES`;
    const hasSalePrice = p.comparePrice != null;
    const salePriceFormatted = hasSalePrice ? `${Number(p.comparePrice).toFixed(2)} KES` : null;
    const stockNum = Number(p.stock) || 0;

    let item = `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${SITE_URL}/products/${escapeXml(id)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${priceFormatted}</g:price>`;

    if (hasSalePrice) {
      item += `\n      <g:sale_price>${salePriceFormatted}</g:sale_price>`;
    }

    item += `\n      <g:availability>${stockNum > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(p.brand || 'Lijustore')}</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
    </item>`;

    items.push(item);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Lijustore - Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Google Merchant product feed for Lijustore Kenya — home appliances, electronics, furniture, and more.</description>

${items.join('\n\n')}
  </channel>
</rss>
`;
}

/** Build the XML sitemap: static pages + every real product page. */
export function buildSitemapXml(products: ApiProduct[]): string {
  const productIds = products.map(deriveProductId).filter((id) => id > 0);

  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/products', priority: '0.9', changefreq: 'weekly' },
    ...productIds.map((id) => ({ url: `/products/${id}`, priority: '0.7', changefreq: 'weekly' })),
  ];

  const lastmod = new Date().toISOString().slice(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
}
