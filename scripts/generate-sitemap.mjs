import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.VITE_SITE_URL || 'https://lijustore.co.ke';
const root = process.cwd();
const productsFile = resolve(root, 'src/utils/api.ts');
const outputFile = resolve(root, 'public/sitemap.xml');

const source = readFileSync(productsFile, 'utf8');
const productIds = [...source.matchAll(/\bid:\s*(\d+)/g)].map((match) => match[1]);
const uniqueProductIds = [...new Set(productIds)];

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