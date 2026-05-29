import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { products } from '../data/products';
import type { Product } from '../types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  filteredProducts: Product[];
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filtered = products.filter((p) => {
    const matchesQuery =
      query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesQuery && matchesCategory && matchesPrice;
  });

  const filteredProducts: Product[] = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating':     return b.rating - a.rating;
      case 'reviews':    return b.reviews - a.reviews;
      default:           return 0;
    }
  });

  return (
    <SearchContext.Provider
      value={{
        query, setQuery,
        selectedCategory, setSelectedCategory,
        sortBy, setSortBy,
        priceRange, setPriceRange,
        filteredProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
