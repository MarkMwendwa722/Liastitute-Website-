import { buildSitemapXml, fetchAllApiProducts } from '@/utils/productFeed';

// ISR — the sitemap rebuilds itself from the API in the background at most
// every 5 minutes, so newly added product pages appear here without a redeploy.
export const revalidate = 300;

export async function GET() {
  const products = await fetchAllApiProducts();
  const xml = buildSitemapXml(products);
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
