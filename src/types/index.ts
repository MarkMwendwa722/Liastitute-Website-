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

export interface CartItem extends Product {
  quantity: number;
}
