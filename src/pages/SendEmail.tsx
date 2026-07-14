import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import Seo from '../components/Seo';
import { useCart } from '../context/CartContext';
import { buildOrderEmailHtml, buildOrderEmailSubject } from '../utils/orderEmail';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const EMAIL_ENDPOINT =
  import.meta.env.VITE_RESEND_EMAIL_ENDPOINT ||
  `${API_BASE_URL.replace(/\/$/, '')}/api/send-email`;
const ORDER_EMAIL = import.meta.env.VITE_ORDER_EMAIL || 'maxmark722@gmail.com';
const RESEND_FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  townCity: string;
  notes: string;
}

const initialForm: OrderForm = {
  name: '',
  phone: '',
  email: '',
  townCity: '',
  notes: '',
};

export default function SendEmailPage() {
  const { items, totalPrice } = useCart();
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber] = useState(`LIA-${Date.now().toString().slice(-6)}`);

  const formComplete =
    form.name.trim() &&
    form.phone.trim() &&
    form.townCity.trim() &&
    items.length > 0;

  const updateField = (field: keyof OrderForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || !formComplete) return;

    setIsSending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: ORDER_EMAIL,
          subject: buildOrderEmailSubject(orderNumber),
          html: buildOrderEmailHtml({
            orderNumber,
            customer: form,
            items,
            paymentMethod: 'Not selected',
            orderTotal: totalPrice,
          }),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Email could not be sent.');
      }

      setMessage(result.id ? `Order email sent successfully. Resend id: ${result.id}` : 'Order email sent successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email could not be sent.');
    } finally {
      setIsSending(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 placeholder-gray-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand';
  const labelClass = 'block text-sm font-bold text-navy mb-2';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-16">
      <Seo
        title="Send Order Email"
        description="Submit your Lijustore order details through the secure email workflow."
        canonicalPath="/send-email"
        noindex
        nofollow
      />
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand">
          <Mail size={16} />
          Order Email
        </div>
        <h1 className="mt-4 text-3xl font-black text-navy">Send order details</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-gray-500">
          This sends the customer name, phone number, location, and cart items through the server-side Resend endpoint.
        </p>
      </section>

      <form onSubmit={sendEmail} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Customer Name</label>
            <input
              value={form.name}
              onChange={updateField('name')}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              value={form.phone}
              onChange={updateField('phone')}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Customer Email</label>
            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Town/City</label>
            <input
              value={form.townCity}
              onChange={updateField('townCity')}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>Exact Location / Notes</label>
          <textarea
            value={form.notes}
            onChange={updateField('notes')}
            rows={4}
            className={`${inputClass} resize-y leading-6`}
          />
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-sm font-black uppercase text-navy">Items Bought</h2>
            <strong className="text-sm text-navy">KSh {formatMoney(totalPrice)}</strong>
          </div>

          {items.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
                  <div>
                    <p className="font-bold text-navy">{item.name}</p>
                    <p className="font-semibold text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <strong className="text-navy">KSh {formatMoney(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-4 text-sm font-semibold text-gray-500">
              Your cart is empty. <Link to="/products" className="text-brand">Add products</Link> before sending an order email.
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-gray-600">
          Email will be sent to <strong className="text-navy">{ORDER_EMAIL}</strong> from{' '}
          <strong className="text-navy">{RESEND_FROM_EMAIL}</strong>.
        </div>

        <button
          type="submit"
          disabled={isSending || !formComplete}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Send size={17} />
          {isSending ? 'Sending...' : 'Send Order Email'}
        </button>

        {message && (
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </p>
        )}

        {error && (
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </form>
    </div>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
