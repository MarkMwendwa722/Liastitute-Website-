'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { CATEGORIES, getDisplayCategory, productMatchesCategory, fetchProducts } from '../utils/api';
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
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({
  children,
  initialProducts = [],
}: {
  children: ReactNode;
  initialProducts?: Product[];
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(CATEGORIES);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);

  // How often to quietly re-check the API so products added/edited there show
  // up on the storefront without a manual reload.
  const SYNC_INTERVAL_MS = 60_000;

  /** Drop products with no usable image and duplicates sharing an image. */
  const dedupeProducts = (all: Product[]): Product[] => {
    const seenImages = new Set<string>();
    return all.filter((p) => {
      if (typeof p.image !== 'string' || p.image.trim() === '') return false;
      if (seenImages.has(p.image)) return false;
      seenImages.add(p.image);
      return true;
    });
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await fetchProducts();
      setProducts(dedupeProducts(all));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Background sync — no loading flash, and never clears the current list if
  // the request fails. Lets newly added API products appear right away.
  const syncProducts = async () => {
    try {
      const all = await fetchProducts();
      setProducts(dedupeProducts(all));
    } catch {
      // keep showing the products we already have
    }
  };

  // First load: fetch client-side only when the server didn't provide products.
  useEffect(() => {
    if (initialProducts.length === 0) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the storefront fresh: reconcile shortly after hydration (the server
  // HTML may be a few minutes stale), then poll quietly and refresh whenever
  // the tab becomes visible/focused again.
  useEffect(() => {
    // Background sync targets the deployed API. In development the Next server
    // already renders fresh data on every request and the API doesn't allow
    // CORS from localhost, so only run this against the production origin.
    if (process.env.NODE_ENV !== 'production') return;

    const reconcile = window.setTimeout(() => {
      if (initialProducts.length > 0) syncProducts();
    }, 1500);

    const interval = window.setInterval(syncProducts, SYNC_INTERVAL_MS);

    const onWake = () => {
      if (document.visibilityState === 'visible') syncProducts();
    };
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('focus', onWake);

    return () => {
      window.clearTimeout(reconcile);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('focus', onWake);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = products.filter((p) => {
    const matchesQuery =
      query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      getDisplayCategory(p.category).toLowerCase().includes(query.toLowerCase());
    const matchesCategory = productMatchesCategory(p.category, selectedCategory);
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
        categories,
        loading,
        error,
        refetch: loadProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export { fetchProducts }; // re-export for convenience

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    if (typeof window === 'undefined') {
      return {
        query: '',
        setQuery: () => {},
        selectedCategory: 'All',
        setSelectedCategory: () => {},
        sortBy: 'featured',
        setSortBy: () => {},
        priceRange: [0, 100000],
        setPriceRange: () => {},
        filteredProducts: [],
        categories: [],
        loading: true,
        error: null,
        refetch: async () => {},
      };
    }
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}
