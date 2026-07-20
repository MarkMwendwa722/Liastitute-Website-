import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import Seo from '../components/Seo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const EMAIL_ENDPOINT =
  import.meta.env.VITE_RESEND_EMAIL_ENDPOINT ||
  `${API_BASE_URL.replace(/\/$/, '')}/api/send-email`;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@lijustoreenterprises.co.ke';
const RESEND_FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'info@lijustore.co.ke';

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    title: 'Visit us',
    text: 'Gaberone plaza, third floor shop T1 Nairobi, Kenya',
  },
  {
    icon: Phone,
    title: 'Call us',
    text: '+254 712 775 426',
  },
  {
    icon: Mail,
    title: 'Email us',
    text: 'info@lijustoreenterprises.co.ke',
  },
  {
    icon: Clock,
    title: 'Working hours',
    text: 'Mon - Sat, 8:00 AM - 6:00 PM',
  },
];

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pb-16">
      <Seo
        title="Contact Lijustore"
        description="Contact Lijustore for product questions, order support, or general inquiries by phone, email, or the website form."
        canonicalPath="/contact"
      />
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand">
            <MessageSquare size={16} />
            Contact Us
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
            Talk to us about products, orders, or support.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
            If you need help choosing a product, want to ask about availability, or need support
            after checkout, reach out using any of the details below.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CONTACT_ITEMS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-brand">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-base font-bold text-navy">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-navy">Send a message</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Send your inquiry directly through the website. We will email the message to our support inbox.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (isSending) return;

              const form = new FormData(e.currentTarget);
              const name = String(form.get('name') ?? '').trim();
              const email = String(form.get('email') ?? '').trim();
              const phone = String(form.get('phone') ?? '').trim();
              const subjectValue = String(form.get('subject') ?? '').trim();
              const messageValue = String(form.get('message') ?? '').trim();

              setIsSending(true);
              setMessage(null);
              setError(null);

              try {
                const response = await fetch(EMAIL_ENDPOINT, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    from: RESEND_FROM_EMAIL,
                    to: CONTACT_EMAIL,
                    subject: subjectValue || `Contact inquiry from ${name || 'website visitor'}`,
                    html: buildContactEmailHtml({ name, email, phone, subject: subjectValue, message: messageValue }),
                  }),
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                  throw new Error(result.error || 'Message could not be sent.');
                }

                e.currentTarget.reset();
                setMessage(result.id ? `Message sent successfully. Resend id: ${result.id}` : 'Message sent successfully.');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Message could not be sent.');
              } finally {
                setIsSending(false);
              }
            }}
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-navy">Name</label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-navy">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-navy">Phone</label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="Optional phone number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-navy">Subject</label>
              <input
                name="subject"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-navy">Message</label>
              <textarea
                name="message"
                rows={6}
                required
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="Tell us how we can help..."
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {isSending ? 'Sending...' : 'Send Message'}
            </button>

            {message && (
              <p className="flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </p>
            )}

            {error && (
              <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function buildContactEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 16px; color: #0f172a;">New contact inquiry</h2>
      <p style="margin: 0 0 12px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p style="margin: 0 0 12px;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p style="margin: 0 0 12px;"><strong>Phone:</strong> ${escapeHtml(data.phone || 'Not provided')}</p>
      <p style="margin: 0 0 12px;"><strong>Subject:</strong> ${escapeHtml(data.subject || 'General inquiry')}</p>
      <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 12px;">
        <strong>Message</strong>
        <p style="margin: 10px 0 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}