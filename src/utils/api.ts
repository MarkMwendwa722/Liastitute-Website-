// Utility to get the API base URL dynamically
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lijustore.co.ke';

// Public category groups shown throughout the storefront.
export const CATEGORIES = [
  'All',
  'Home Appliances Kenya',
  'Kitchen & Commercial Equipment',
  'Fitness, Outdoor & Kids',
  'Electronics & Entertainment',
  'Furniture & Home Essentials',
  'Home Office Equipment',
  'Security & Safety Equipment',
  'Tools, Electrical & Automotive',
];

const CATEGORY_GROUPS: Record<string, string[]> = {
  'Home Appliances Kenya': ['Home Appliances', 'Home & Living'],
  'Kitchen & Commercial Equipment': ['Kitchen Appliances'],
  'Fitness, Outdoor & Kids': ['Fitness Equipment', 'Kids & Baby', "Toys & Kids' Gifts"],
  'Electronics & Entertainment': ['Electronics', 'Lighting', 'Networking & Communication'],
  'Furniture & Home Essentials': ['Furniture', 'Bathroom Organizers'],
  'Home Office Equipment': ['Office Equipment'],
  'Security & Safety Equipment': ['Security Cameras & Surveillance Systems'],
  'Tools, Electrical & Automotive': ['Automotive Accessories', 'Solar & Power Backup', 'Tools', 'Electrical'],
};

export function getDisplayCategory(category: string) {
  return Object.entries(CATEGORY_GROUPS).find(([, productCategories]) =>
    productCategories.includes(category),
  )?.[0] ?? category;
}

export function productMatchesCategory(productCategory: string, selectedCategory: string) {
  if (selectedCategory === 'All') return true;
  return selectedCategory === productCategory || getDisplayCategory(productCategory) === selectedCategory;
}

// ── Google Product Category → internal category mapping ──────────────────
const GOOGLE_TO_INTERNAL_CATEGORY: Record<string, string> = {
  'Home & Garden > Household Appliances': 'Home Appliances',
  'Home & Garden > Kitchen & Dining > Kitchen Appliances': 'Kitchen Appliances',
  'Home & Garden > Lawn & Garden > Garden Tools': 'Tools',
  'Office Supplies > Office Equipment': 'Office Equipment',
  'Electronics > Communications > Telecommunications': 'Networking & Communication',
  'Electronics > Security & Surveillance': 'Security Cameras & Surveillance Systems',
  'Home & Garden > Lighting': 'Lighting',
  'Sports & Outdoors > Cycling > Bikes': 'Kids & Baby',
  'Electronics > Electrical': 'Electrical',
  'Electronics': 'Electronics',
  'Vehicles & Parts > Automotive Parts & Accessories > Automotive Accessories': 'Automotive Accessories',
  'Home & Garden > Furniture': 'Furniture',
  'Home & Garden > Bathroom': 'Bathroom Organizers',
  'Sports & Outdoors > Exercise & Fitness > Fitness Equipment': 'Fitness Equipment',
  'Toys & Games > Toys': "Toys & Kids' Gifts",
};

/**
 * Derive a badge string from an API product.
 */
function deriveBadge(apiProduct: { isFeatured?: boolean; stock?: number }): string | null {
  if (apiProduct.isFeatured) return 'Bestseller';
  if (apiProduct.stock !== undefined && apiProduct.stock > 0 && apiProduct.stock <= 5) return 'Sale';
  return null;
}

/**
 * Convert a full image URL to a relative path so images load from the local
 * public/ folder instead of fetching from the production domain.
 */
function toLocalImage(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.pathname; // e.g. "/Photos/20260311_111103.jpg"
  } catch {
    // Already a relative path or unrecognisable — use as-is
    return url;
  }
}

/**
 * Transform a single API product into the app's Product shape.
 */
export function transformApiProduct(apiProduct: import('../types').ApiProduct): import('../types').Product {
  const cat = apiProduct.googleProductCategory
    ? (GOOGLE_TO_INTERNAL_CATEGORY[apiProduct.googleProductCategory] ??
        apiProduct.googleProductCategory.split(' > ').pop()!)
    : apiProduct.category?.name ?? 'General';

  return {
    id: Number(apiProduct.externalId) || 0,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.comparePrice ?? null,
    category: cat,
    rating: 0,
    reviews: 0,
    image: toLocalImage(apiProduct.imageUrl || apiProduct.images?.[0] || ''),
    description: apiProduct.description,
    stock: apiProduct.stock ?? 0,
    badge: deriveBadge(apiProduct),
  };
}

/**
 * Fetch products from the API endpoint.
 */
export async function fetchProducts(): Promise<import('../types').Product[]> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/api/products?limit=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  const json: import('../types').ApiResponse = await res.json();
  if (!json.success) throw new Error('API returned unsuccessful response');
  return json.data.map(transformApiProduct);
}
