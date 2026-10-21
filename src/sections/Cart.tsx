'use client'

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types';
import Seo from '../components/Seo';
import { getDisplayCategory } from '../utils/api';
import { buildOrderEmailHtml, buildOrderEmailSubject } from '../utils/orderEmail';
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  WHATSAPP_DISPLAY,
} from '../utils/whatsapp';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.lijustore.co.ke';
const EMAIL_ENDPOINT = `${API_BASE_URL}/api/send-email`;
const ORDER_EMAIL = process.env.NEXT_PUBLIC_ORDER_EMAIL || 'kobiajohn7@gmail.com';
const RESEND_FROM_EMAIL = process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || 'info@lijustore.co.ke';
const SHOP_LOCATION = 'Gaberone plaza, third floor shop T3L Nairobi, Kenya';

const DELIVERY_NOTES = [
  { label: 'Delivery outside Nairobi', fee: 400, description: 'Prepay the delivery fee — pay the rest when the order arrives' },
  { label: 'Delivery within Nairobi', fee: 400, description: 'Delivery handled within Nairobi' },
  { label: 'Delivery within Nairobi CBD', fee: 0, description: 'Free delivery within the CBD' },
] as const;

const PAYMENT_OPTIONS = [
  { id: 'mpesa', label: 'Lipa na M-Pesa' },
  { id: 'cash', label: 'Pay with cash upon delivery' },
] as const;

type PaymentId = (typeof PAYMENT_OPTIONS)[number]['id'];

interface CheckoutDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const TRACKING_FIELDS = [
  'trackingNumber',
  'tracking_number',
  'orderNumber',
  'order_number',
  'orderId',
  'order_id',
  'id',
  '_id',
] as const;

function extractOrderTrackingNumber(response: unknown): string | null {
  const findField = (value: unknown): string | null => {
    if (!value || typeof value !== 'object') return null;
    const obj = value as Record<string, unknown>;
    for (const field of TRACKING_FIELDS) {
      const fieldValue = obj[field];
      if (typeof fieldValue === 'string' && fieldValue.trim()) {
        return fieldValue.trim();
      }
    }
    return null;
  };

  const direct = findField(response);
  if (direct) return direct;

  // The API typically wraps results as { success, data: { order: {...} } }
  if (response && typeof response === 'object') {
    const data = (response as Record<string, unknown>).data;
    const nested = findField(data);
    if (nested) return nested;

    const order = data && typeof data === 'object'
      ? (data as Record<string, unknown>).order
      : undefined;
    const nestedOrder = findField(order);
    if (nestedOrder) return nestedOrder;
  }

  return null;
}

function formatMoney(value: number) {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderTotal, setPlacedOrderTotal] = useState<number | null>(null);
  const [placedOrderItems, setPlacedOrderItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Tracking number returned by the orders API once the order is booked.
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  // Client-generated reference sent with the request; only a fallback.
  const [clientOrderId] = useState(() => `LIA-${Date.now().toString().slice(-6)}`);
  const [details, setDetails] = useState<CheckoutDetails>({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [paymentId, setPaymentId] = useState<PaymentId>('cash');

  const selectedPayment =
    PAYMENT_OPTIONS.find((option) => option.id === paymentId) ?? PAYMENT_OPTIONS[1];
  const grandTotal = totalPrice;
  const detailsComplete = Boolean(
    details.name.trim() &&
    details.address.trim() &&
    details.phone.trim() &&
    details.email.trim(),
  );

  const whatsappUrl = buildWhatsAppUrl(
    buildOrderMessage(items, grandTotal, details),
  );

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const placeApiOrder = async (orderItems: CartItem[], orderTotal: number) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: clientOrderId,
        name: details.name,
        address: details.address,
        townCity: details.address,
        phoneNumber: details.phone,
        emailAddress: details.email,
        items: orderItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: selectedPayment.label,
        orderTotal,
      }),
    });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      throw new Error(result.error || `Order API error: ${res.status}`);
    }
    return res.json();
  };

  const sendOrderEmail = async (
    finalOrderNumber: string,
    orderItems: CartItem[],
    orderTotal: number,
  ) => {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: ORDER_EMAIL,
        subject: buildOrderEmailSubject(finalOrderNumber),
        html: buildOrderEmailHtml({
          orderNumber: finalOrderNumber,
          customer: {
            name: details.name,
            phone: details.phone,
            email: details.email,
            townCity: details.address,
          },
          items: orderItems,
          paymentMethod: selectedPayment.label,
          orderTotal,
        }),
      }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || `Email API error: ${response.status}`);
    }
    return response.json();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !detailsComplete || items.length === 0) return;

    const orderItems = [...items];
    const orderTotal = grandTotal;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiResult = await placeApiOrder(orderItems, orderTotal);
      const finalOrderNumber = extractOrderTrackingNumber(apiResult) || clientOrderId;
      setOrderNumber(finalOrderNumber);
      // Best-effort notification email — the order is already booked.
      try {
        await sendOrderEmail(finalOrderNumber, orderItems, orderTotal);
      } catch {
        // Email failure should not fail the order.
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    setPlacedOrderItems(orderItems);
    setPlacedOrderTotal(orderTotal);
    setOrderPlaced(true);
    setIsSubmitting(false);
    clearCart();
  };

  /* ── Empty cart ──────────────────────────────────────────────────────── */
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Seo
          title="Your Cart"
          description="Review the items in your Lijustore cart and complete your order."
          canonicalPath="/cart"
          noindex
          nofollow
        />
        <div className="text-center">
          <ShoppingBag size={80} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-navy mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-7">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/products"
            className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-bold transition-colors no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Order received ──────────────────────────────────────────────────── */
  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <Seo
          title="Order Received"
          description="Your Lijustore order was received successfully."
          canonicalPath="/cart"
          noindex
          nofollow
        />
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-navy mb-1">Order Received!</h2>
          <p className="text-brand font-bold mb-4">
            Order #{orderNumber ?? clientOrderId}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Thank you, <strong>{details.name}</strong>. Someone from Lijustore
            will reach out to you on <strong>{details.phone}</strong> to discuss
            delivery details and how your parcel will arrive.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-gray-600 text-left">
            <p className="font-bold text-navy mb-1">Prefer to visit the shop?</p>
            <p className="flex gap-2">
              <MapPin size={16} className="text-brand shrink-0 mt-0.5" />
              <span>{SHOP_LOCATION}</span>
            </p>
          </div>
          {placedOrderItems.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-left">
              <p className="font-bold text-navy mb-2">Order items</p>
              <div className="space-y-1 text-gray-600">
                {placedOrderItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <strong className="text-navy shrink-0">
                      KSh {formatMoney(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
            Order total:{' '}
            <strong className="text-navy">
              KSh {formatMoney(placedOrderTotal ?? grandTotal)}
            </strong>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={buildWhatsAppUrl(
                buildOrderMessage(placedOrderItems, placedOrderTotal ?? grandTotal, details),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-3 rounded-xl font-bold transition-colors no-underline"
            >
              <MessageCircle size={18} /> Chat with us on WhatsApp
            </a>
            <Link
              href="/"
              className="bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-colors no-underline"
            >
              Back to Home
            </Link>
            <Link
              href="/products"
              className="border border-gray-200 hover:border-brand text-gray-700 hover:text-brand py-3 rounded-xl font-semibold transition-colors no-underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 placeholder-gray-400 outline-none rounded-xl focus:border-brand focus:ring-1 focus:ring-brand';
  const labelClass = 'block text-sm font-bold text-navy mb-2';

  return (
    <form onSubmit={handlePlaceOrder} className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <Seo
        title="Your Cart & Checkout"
        description="Review your Lijustore cart, enter your delivery details and complete your order."
        canonicalPath="/cart"
        noindex
        nofollow
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-2xl font-black text-navy">
          Shopping Cart{' '}
          <span className="font-normal text-gray-400 text-lg">({totalItems} items)</span>
        </h1>
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-brand font-semibold text-sm no-underline hover:underline"
        >
          <ArrowLeft size={15} /> Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-7 items-start">
        <div className="space-y-7">
          {/* ── Cart items ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex justify-end px-5 py-3.5 border-b border-gray-100">
              <button
                type="button"
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
                <Link href={`/products/${item.id}`} className="block rounded-xl overflow-hidden w-20 h-20">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover block" />
                </Link>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                    {getDisplayCategory(item.category)}
                  </span>
                  <Link
                    href={`/products/${item.id}`}
                    className="text-sm font-semibold text-navy no-underline hover:text-brand line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-gray-400">KSh {formatMoney(item.price)} each</span>

                  <div className="sm:hidden mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-navy">
                        KSh {formatMoney(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
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
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-navy w-20 text-right">
                    KSh {formatMoney(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
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

          {/* ── Checkout details (same page) ───────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7">
            <h2 className="text-lg font-black text-navy uppercase mb-1">
              Checkout Details
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We only need a few details to deliver your order.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={details.name}
                  onChange={handleDetailsChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={details.phone}
                  onChange={handleDetailsChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={details.address}
                  onChange={handleDetailsChange}
                  placeholder="Town / city, estate, street, apartment or floor"
                  rows={2}
                  className={`${inputClass} resize-y leading-relaxed`}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={details.email}
                  onChange={handleDetailsChange}
                  placeholder="Enter your email address"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Summary / payment ─────────────────────────────────────── */}
        <aside className="bg-white rounded-2xl border-2 border-navy p-6 lg:sticky lg:top-32">
          <h2 className="text-lg font-black text-navy mb-5 uppercase">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} items)</span>
              <span>KSh {formatMoney(totalPrice)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="font-bold text-gray-600 mb-3 text-sm">Delivery</p>
            <div className="space-y-2.5 rounded-xl bg-gray-50 p-4">
              {DELIVERY_NOTES.map((note) => (
                <div key={note.label} className="text-xs text-gray-700">
                  <p className="font-bold">
                    {note.label}
                    {note.fee > 0 ? (
                      <span>: KSh {formatMoney(note.fee)}</span>
                    ) : (
                      <span> — FREE</span>
                    )}
                  </p>
                  <p className="text-gray-500">{note.description}</p>
                </div>
              ))}
              <p className="text-[11px] text-gray-400 pt-1">
                Delivery fee is confirmed with you before dispatch.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 mb-5">
            <div className="flex justify-between font-black text-navy text-base">
              <span>Total</span>
              <span>KSh {formatMoney(grandTotal)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 text-sm font-bold text-navy"
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={paymentId === option.id}
                  onChange={() => setPaymentId(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={!detailsComplete || isSubmitting}
            className="mt-6 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Sending order...' : 'Place Order'}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-[#1DA851] no-underline"
          >
            <MessageCircle size={18} /> Order on WhatsApp
          </a>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Chat with us on {WHATSAPP_DISPLAY}
          </p>

          {submitError && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <AlertCircle size={16} /> {submitError}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-gray-400">
            🔒 Secure Checkout — SSL Encrypted
          </p>
        </aside>
      </div>
    </form>
  );
}
