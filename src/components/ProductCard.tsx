import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface Props {
  product: Product;
}

const badgeStyles: Record<string, string> = {
  Sale: 'bg-brand text-white',
  New: 'bg-success text-white',
  Bestseller: 'bg-gold text-gray-800',
};

export default function ProductCard({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.id === product.id);
  const hasImage = typeof product.image === 'string' && product.image.trim() !== '';

  // Hide cards that have no image path or an image that failed to load.
  if (!hasImage || imageFailed) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col no-underline text-inherit"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeStyles[product.badge] ?? 'bg-gray-200'}`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2.5 right-9 bg-navy text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        <button
          title="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-brand shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand truncate">
          {product.category}
        </span>
        <h3 className="text-base sm:text-sm font-semibold text-navy leading-snug line-clamp-2 m-0">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
          <span className="text-[13px] sm:text-xs font-semibold text-gray-700">{product.rating}</span>
          <span className="text-[13px] sm:text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-lg sm:text-base font-bold text-navy">KSh {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm sm:text-xs text-gray-400 line-through">
                KSh {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`w-full sm:w-auto justify-center sm:justify-start flex items-center gap-1 px-3 py-2 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold transition-colors ${
              inCart
                ? 'bg-success text-white hover:bg-success-dark'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
          >
            <ShoppingCart size={13} />
            {inCart ? 'In Cart' : 'Add'}
          </button>
        </div>

        {product.stock <= 20 && (
          <p className="text-[11px] font-semibold text-brand m-0">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </Link>
  );
}
