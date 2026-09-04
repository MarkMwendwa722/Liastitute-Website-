'use client'

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { Product, CartItem } from '../types';

// ─── State & Actions ───────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'CLEAR_CART' };

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'HYDRATE':
      return { items: action.items };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty on both the server and the first client render so the hydrated
  // HTML always matches (reading localStorage here would make the server and
  // client disagree whenever a saved cart exists → hydration error). The saved
  // cart is loaded from localStorage right after mount instead.
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  // Load the persisted cart after hydration (localStorage is client-only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        if (Array.isArray(items)) dispatch({ type: 'HYDRATE', items });
      }
    } catch {
      // ignore missing/corrupted storage
    }
    setHydrated(true);
  }, []);

  // Persist changes — but only after hydration, so the empty initial state is
  // never written over an existing saved cart on first mount.
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch {
        // storage may be unavailable (private browsing, etc.)
      }
    }
  }, [state.items, hydrated]);

  const addToCart = (product: Product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (id: number) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const updateQuantity = (id: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Return a default/empty context during SSR / prerendering
    if (typeof window === 'undefined') {
      return {
        items: [],
        addToCart: () => {},
        removeFromCart: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        totalItems: 0,
        totalPrice: 0,
      };
    }
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
