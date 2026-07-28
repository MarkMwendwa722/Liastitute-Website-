import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const API_URL = process.env.VITE_API_BASE_URL || 'https://lijustore.co.ke';
const siteUrl = process.env.VITE_SITE_URL || 'https://lijustore.co.ke';
const root = process.cwd();
const outputFile = resolve(root, 'public/sitemap.xml');

async function main() {
  const url = `${API_URL.replace(/\/$/, '')}/api/products?limit=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error('Unexpected API response shape');
  }

  const uniqueProductIds = json.data.map((p) => p.externalId || p.id);

const pages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/products', priority: '0.9', changefreq: 'weekly' },
  ...uniqueProductIds.map((id) => ({ url: `/product/${id}`, priority: '0.7', changefreq: 'weekly' })),
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