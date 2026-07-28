export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  stock: number;
  badge: string | null;
}

/** Raw product shape returned by the API */
export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string;
  imageUrl: string;
  images: string[];
  categoryId: string;
  brand: string;
  googleProductCategory: string;
  externalId: string;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    _id: string;
    name: string;
    slug: string;
    id: string;
  };
  id: string;
}

export interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
