import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, ArrowLeft,
  Check, Truck, RotateCcw, ShieldCheck,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const { filteredProducts, loading, error } = useSearch();

  const product = filteredProducts.find((p) => p.id === Number(id));

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (error) return <div className="text-center py-24 text-red-500">{error}</div>;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Product not found</h2>
        <Link to="/products" className="text-brand font-semibold no-underline hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const related = filteredProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inCart  = items.some((i) => i.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-7 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-7 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-brand font-semibold bg-none border-none cursor-pointer p-0"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <span className="text-gray-300">›</span>
        <Link to="/products" className="text-gray-500 hover:text-brand no-underline">Products</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-500">{product.category}</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </div>

      {/* Main */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="md:sticky md:top-32 self-start">
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                product.badge === 'Sale' ? 'bg-brand text-white' :
                product.badge === 'New' ? 'bg-success text-white' :
                'bg-gold text-gray-800'
              }`}>
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">{product.category}</span>
            <h1 className="text-3xl font-black text-navy mt-1 leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={17}
                  fill={s <= Math.round(product.rating) ? '#fbbf24' : 'transparent'}
                  stroke={s <= Math.round(product.rating) ? '#fbbf24' : '#ddd'}
                />
              ))}
            </div>
            <span className="font-semibold text-sm">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-black text-navy">KSh {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">KSh {product.originalPrice.toFixed(2)}</span>
                <span className="bg-blue-50 text-brand px-3 py-1 rounded-lg text-sm font-bold">
                  Save KSh {(product.originalPrice - product.price).toFixed(2)} ({discount}%)
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div>
            {product.stock > 20 ? (
              <span className="flex items-center gap-1.5 text-success font-semibold text-sm">
                <Check size={15} /> In Stock
              </span>
            ) : (
              <span className="text-brand font-bold text-sm">Only {product.stock} left!</span>
            )}
          </div>

          {/* Add to cart row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg font-bold transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg font-bold transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-colors ${
                addedMsg ? 'bg-success' : 'bg-brand hover:bg-brand-dark'
              }`}
            >
              {addedMsg ? <><Check size={18}/> Added!</> : <><ShoppingCart size={18}/> Add to Cart</>}
            </button>

            <button
              className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand hover:text-brand transition-colors"
              title="Add to wishlist"
            >
              <Heart size={19} />
            </button>
          </div>

          {inCart && !addedMsg && (
            <Link to="/cart" className="text-brand font-semibold text-sm no-underline hover:underline">
              View in Cart →
            </Link>
          )}

          {/* Guarantees */}
          <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5 bg-gray-50">
            {[
              { Icon: Truck,        text: 'Free shipping on orders over KSh 50' },
              { Icon: RotateCcw,    text: '30-day easy returns' },
              { Icon: ShieldCheck,  text: 'Secure checkout — SSL encrypted' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                <Icon size={16} className="text-brand shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-black text-navy mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {related
              .filter((p) => p.image && p.image.toString().trim() !== '')
              .map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;