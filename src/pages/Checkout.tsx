import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types";
import Seo from '../components/Seo';
import {
  buildOrderEmailHtml,
  buildOrderEmailSubject,
} from "../utils/orderEmail";

const ORDER_EMAIL = import.meta.env.VITE_ORDER_EMAIL || "kobiajohn7@gmail.com";
const RESEND_FROM_EMAIL =
  import.meta.env.VITE_RESEND_FROM_EMAIL || "info@lijustore.co.ke";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const EMAIL_ENDPOINT =
  import.meta.env.VITE_RESEND_EMAIL_ENDPOINT ||
  `${API_BASE_URL.replace(/\/$/, "")}/api/send-email`;
const SHOP_LOCATION = "Gaberone plaza, third floor shop T3 Nairobi, Kenya";

const SHIPMENT_NOTES = [
  {
    label: "Delivery Outside Nairobi",
    description: "Prepay delivery fee - pay the rest when the order arrives",
    fee: 400,
  },
  {
    label: "Delivery within Nairobi",
    description: "Delivery handled within Nairobi",
    fee: 400,
  },
  {
    label: "Delivery within Nairobi CBD",
    description: "Free delivery within the CBD",
    fee: 0,
  },
] as const;

const PAYMENT_OPTIONS = [
  { id: "mpesa", label: "Lipa na M-Pesa" },
  { id: "cash", label: "Pay with cash upon delivery" },
] as const;

type PaymentId = (typeof PAYMENT_OPTIONS)[number]["id"];

interface CheckoutDetails {
  name: string;
  townCity: string;
  phone: string;
  email: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderTotal, setPlacedOrderTotal] = useState<number | null>(null);
  const [placedOrderItems, setPlacedOrderItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderNumber] = useState(`LIA-${Date.now().toString().slice(-6)}`);
  const [details, setDetails] = useState<CheckoutDetails>({
    name: "",
    townCity: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [paymentId, setPaymentId] = useState<PaymentId>("cash");

  const selectedPayment =
    PAYMENT_OPTIONS.find((option) => option.id === paymentId) ??
    PAYMENT_OPTIONS[1];
  const grandTotal = totalPrice;
  const detailsComplete =
    details.name.trim() &&
    details.townCity.trim() &&
    details.phone.trim() &&
    details.email.trim();

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const sendOrderEmail = async (orderItems: CartItem[], orderTotal: number) => {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: ORDER_EMAIL,
        subject: buildOrderEmailSubject(orderNumber),
        html: buildOrderEmailHtml({
          orderNumber,
          customer: details,
          items: orderItems,
          paymentMethod: selectedPayment.label,
          orderTotal,
        }),
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || "Order email could not be sent.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !detailsComplete) return;

    const orderItems = [...items];
    const orderTotal = grandTotal;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendOrderEmail(orderItems, orderTotal);
    } catch {
      setSubmitError("We could not send the order email. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setPlacedOrderItems(orderItems);
    setPlacedOrderTotal(orderTotal);
    setOrderPlaced(true);
    setIsSubmitting(false);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Seo
          title="Checkout"
          description="Complete your Lijustore order and choose a payment method."
          canonicalPath="/checkout"
          noindex
          nofollow
        />
        <h2 className="text-2xl font-bold text-navy mb-4">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full font-bold no-underline transition-colors"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <Seo
          title="Order Received"
          description="Your Lijustore order was received successfully."
          canonicalPath="/checkout"
          noindex
          nofollow
        />
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-navy mb-1">
            Order Received!
          </h2>
          <p className="text-brand font-bold mb-4">Order #{orderNumber}</p>
          <p className="text-gray-500 text-sm mb-4">
            Thank you, <strong>{details.name}</strong>. Someone from Lijustore
            will reach out to you on <strong>{details.phone}</strong> to discuss
            delivery details, how your parcel will arrive, and anything else you
            need to know.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-gray-600 text-left">
            <p className="font-bold text-navy mb-1">
              Prefer to visit the shop?
            </p>
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
                      KSh {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
            Order total:{" "}
            <strong className="text-navy">
              KSh {(placedOrderTotal ?? grandTotal).toFixed(2)}
            </strong>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-colors no-underline"
            >
              Back to Home
            </Link>
            <Link
              to="/products"
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
    "w-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 placeholder-gray-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand";
  const labelClass = "block text-sm font-bold text-navy mb-2";

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="max-w-7xl mx-auto px-4 py-10 pb-16"
    >
      <Seo
        title="Checkout"
        description="Complete your Lijustore order and choose a payment method."
        canonicalPath="/checkout"
        noindex
        nofollow
      />
      <div className="grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-10 items-start">
        <section className="border-t border-gray-200 pt-8">
          <h1 className="text-xl font-black text-navy mb-5 uppercase">
            Checkout Details
          </h1>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Name</label>
              <input
                name="name"
                value={details.name}
                onChange={handleDetailsChange}
                placeholder="Enter your full name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Town/City</label>
              <input
                name="townCity"
                value={details.townCity}
                onChange={handleDetailsChange}
                placeholder="Enter your town or city"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                name="phone"
                value={details.phone}
                onChange={handleDetailsChange}
                placeholder="Enter your phone number"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                value={details.email}
                onChange={handleDetailsChange}
                placeholder="Enter your email address"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Special notes for delivery and Exact location (optional)
              </label>
              <textarea
                name="notes"
                value={details.notes}
                onChange={handleDetailsChange}
                placeholder="Apartment / Floor (if any) - Add apartment name, floor, or unit number to help the rider find you easily"
                rows={5}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </div>
          </div>
        </section>

        <aside className="border-2 border-navy bg-white p-6 sm:p-8 lg:sticky lg:top-32">
          <h2 className="text-xl font-black text-navy mb-5 uppercase">
            Your Order
          </h2>

          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-gray-100 pb-3 text-sm font-black uppercase text-navy">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto] gap-4 py-4 text-sm"
              >
                <div className="font-semibold leading-snug text-gray-600">
                  {item.name}{" "}
                  <span className="text-navy">x {item.quantity}</span>
                </div>
                <strong className="text-navy">
                  KSh {formatMoney(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 py-3 space-y-3 text-sm">
            <div className="flex justify-between font-bold text-navy">
              <span>Subtotal</span>
              <span>KSh {formatMoney(totalPrice)}</span>
            </div>

            <div>
              <p className="font-bold text-gray-600 mb-3">Shipment</p>
              <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                {SHIPMENT_NOTES.map((note) => (
                  <div
                    key={note.label}
                    className="text-sm font-semibold text-gray-700"
                  >
                    <p>
                      {note.label}
                      {note.fee > 0 ? (
                        <span>: KSh {formatMoney(note.fee)}</span>
                      ) : (
                        <span> - FREE</span>
                      )}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      {note.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-3 font-black text-navy">
              <span>Total</span>
              <span>KSh {formatMoney(grandTotal)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
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
            className="mt-7 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending order..." : "Make an Order"}
          </button>

          {submitError && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <AlertCircle size={16} /> {submitError}
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
