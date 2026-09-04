// Shared id helper for the static-site generators.
//
// MUST stay in sync with deriveProductId() in src/utils/api.ts so the feed and
// sitemap always point at the exact product page the app renders:
//   - prefer the API's numeric `externalId`
//   - otherwise derive a stable number from the MongoDB `_id` (first 13 hex
//     chars stay within JavaScript's safe-integer range)

export function deriveProductId(product) {
  const ext = Number(product.externalId);
  if (Number.isFinite(ext) && ext > 0) return ext;

  const hex = String(product._id || '')
    .replace(/[^0-9a-f]/gi, '')
    .slice(0, 13);
  if (!hex) return 0;
  return Number.parseInt(hex, 16);
}
