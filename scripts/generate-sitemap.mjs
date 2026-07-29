import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.VITE_SITE_URL || 'https://lijustore.co.ke';
const root = process.cwd();
const outputFile = resolve(root, 'public/sitemap.xml');

/** Try to fetch product IDs from the API. If unavailable, return empty array. */
async function fetchProductIds() {
  try {
    const res = await fetch('https://api.lijustore.co.ke/api/products?limit=100', {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data.map((p) => p.externalId || p.id);
  } catch {
    console.warn('⚠️  Products API unreachable — sitemap will contain static pages only.');
    return [];
  }
}

async function main() {
  const productIds = await fetchProductIds();

const pages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/products', priority: '0.9', changefreq: 'weekly' },
  ...productIds.map((id) => ({ url: `/product/${id}`, priority: '0.7', changefreq: 'weekly' })),
];

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(outputFile, sitemap, 'utf8');
console.log(`Wrote sitemap with ${pages.length} URLs to ${outputFile}`);
}

main().catch((err) => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});

// Note: main() catches API failures gracefully and generates
// a sitemap with static pages only — the process never exits 1
// just because the products API is unreachable.