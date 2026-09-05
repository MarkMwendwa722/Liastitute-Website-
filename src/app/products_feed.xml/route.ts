import { buildProductFeedXml, fetchAllApiProducts } from '@/utils/productFeed';

// ISR — the feed rebuilds itself from the API in the background at most every
// 5 minutes. New products added via the API appear here WITHOUT a redeploy.
// (Google Merchant Center keeps polling this same URL.)
export const revalidate = 300;

export async function GET() {
  const products = await fetchAllApiProducts();
  const xml = buildProductFeedXml(products);
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
