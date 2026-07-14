import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import { getDisplayCategory } from '../utils/api';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const shipping   = totalPrice >= 50 ? 0 : 5.99;
  const tax        = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Seo
          title="Your Cart"
          description="Review the items in your Lijustore cart before checkout."
          canonicalPath="/cart"
          noindex
          nofollow
        />
        <div className="text-center">
          <ShoppingBag size={80} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-navy mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-7">Looks like you haven&apos;t added anything yet.</p>
          <Link
            to="/products"
            className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-bold transition-colors no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <Seo
        title="Your Cart"
        description="Review the items in your Lijustore cart before checkout."
        canonicalPath="/cart"
        noindex
        nofollow
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-2xl font-black text-navy">
          Shopping Cart <span className="font-normal text-gray-400 text-lg">({totalItems} items)</span>
        </h1>
        <Link to="/products" className="flex items-center gap-1.5 text-brand font-semibold text-sm no-underline hover:underline">
          <ArrowLeft size={15} /> Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-7 items-start">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex justify-end px-5 py-3.5 border-b border-gray-100">
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-gray-400 hover:text-brand text-xs font-medium transition-colors"
            >
              <Trash2 size={13} /> Clear Cart
            </button>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-[80px_1fr_auto] gap-4 px-5 py-5 border-b border-gray-100 last:border-0 items-start sm:items-center"
            >
              <Link to={`/product/${item.id}`} className="block rounded-xl overflow-hidden w-20 h-20">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover block" />
              </Link>

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{getDisplayCategory(item.category)}</span>
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm font-semibold text-navy no-underline hover:text-brand line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <span className="text-xs text-gray-400">KSh {item.price.toFixed(2)} each</span>

                <div className="sm:hidden mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-navy">
                      KSh {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-brand transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                {/* Qty */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-sm font-bold text-navy w-16 text-right">
                  KSh {(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-300 hover:text-brand transition-colors"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-32">
          <h3 className="text-lg font-black text-navy mb-5">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} items)</span>
              <span>KSh {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-success font-bold' : ''}>
                {shipping === 0 ? 'FREE' : `KSh ${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brand bg-blue-50 px-3 py-2 rounded-lg">
                Add KSh {(50 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>KSh {tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 mb-5">
            <div className="flex justify-between font-black text-navy text-base">
              <span>Total</span>
              <span>KSh {grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-brand hover:bg-brand-dark text-white text-center py-3.5 rounded-xl font-bold transition-colors no-underline mb-3"
          >
            Make an Order
          </Link>
          <p className="text-center text-xs text-gray-400 mb-4">🔒 Secure Checkout — SSL Encrypted</p>

          <div className="flex gap-2 justify-center flex-wrap">
            {['VISA', 'Mastercard', 'M-Pesa', 'PayPal'].map((m) => (
              <span key={m} className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
