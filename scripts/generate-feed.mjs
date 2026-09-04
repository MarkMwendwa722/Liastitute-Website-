import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveProductId } from './product-id.mjs';

const siteUrl = process.env.VITE_SITE_URL || 'https://lijustore.co.ke';
const root = process.cwd();
const outputFile = resolve(root, 'public/products_feed.xml');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function main() {
  const url = 'https://api.lijustore.co.ke/api/products?limit=100';

  let items = [];
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error('Unexpected API response shape');
    }

    // Only submit products that are complete enough for Google Merchant. A
    // product missing a description, a real Google category or an image would
    // otherwise be sent with bogus data (a literal "null" description / a
    // wrong default category), which can trigger misrepresentation — so skip
    // those with a clear warning instead.
    for (const p of json.data) {
      const id = deriveProductId(p);
      const description = (p.description || '').toString().trim();
      const googleCategory = (p.googleProductCategory || '').trim();
      const imageUrl = p.imageUrl || (Array.isArray(p.images) && p.images[0]) || '';

      if (!id) { console.warn(`⚠️  Skipping "${p.name}": no usable id (externalId/_id)`); continue; }
      if (!googleCategory) { console.warn(`⚠️  Skipping "${p.name}": missing googleProductCategory`); continue; }
      if (!description) { console.warn(`⚠️  Skipping "${p.name}": missing description`); continue; }
      if (!imageUrl) { console.warn(`⚠️  Skipping "${p.name}": missing image`); continue; }

      const priceFormatted = `${Number(p.price).toFixed(2)} KES`;
      const hasSalePrice = p.comparePrice != null;
      const salePriceFormatted = hasSalePrice ? `${Number(p.comparePrice).toFixed(2)} KES` : null;
      const stockNum = Number(p.stock) || 0;

      let xml = `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${siteUrl}/products/${escapeXml(id)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${priceFormatted}</g:price>`;

      if (hasSalePrice) {
        xml += `\n      <g:sale_price>${salePriceFormatted}</g:sale_price>`;
      }

      xml += `\n      <g:availability>${stockNum > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(p.brand || 'Lijustore')}</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
    </item>`;

      items.push(xml);
    }
  } catch {
    console.warn('⚠️  Products API unreachable — feed will contain no products.');
  }

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Lijustore - Product Feed</title>
    <link>${siteUrl}</link>
    <description>Google Merchant product feed for Lijustore Kenya — home appliances, electronics, furniture, and more.</description>

${items.join('\n\n')}
  </channel>
</rss>
`;

  writeFileSync(outputFile, feed, 'utf8');
  console.log(`Wrote ${items.length} products to ${outputFile}`);
}

main();
