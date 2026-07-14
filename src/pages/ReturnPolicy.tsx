import { ArrowLeft, Gift, Package, RefreshCw, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-16">
      <Seo
        title="Return &amp; Shipping Policy"
        description="Learn about Lijustore's return policy, shipping information, and product exchange guidelines."
        canonicalPath="/returns"
      />

      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand transition-colors no-underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand">
        <ShieldCheck size={16} />
        Policies
      </span>

      <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
        Return &amp; Shipping Policy
      </h1>
      <p className="mt-2 text-gray-500 text-sm">
        Last updated: July 2026
      </p>

      <div className="mt-10 space-y-10">
        {/* ── Shipping ──────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand">
              <Truck size={20} />
            </div>
            <h2 className="text-xl font-bold text-navy">Shipping Policy</h2>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              We strive to process and dispatch all orders within <strong>1–3 business days</strong>{' '}
              after payment confirmation. Delivery timelines vary depending on your location:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Nairobi &amp; surrounding areas:</strong> 1–3 business days after dispatch.
              </li>
              <li>
                <strong>Other regions in Kenya:</strong> 3–7 business days after dispatch.
              </li>
            </ul>
            <p>
              Shipping costs are calculated at checkout based on your delivery address and the
              weight of the items in your order. We partner with reliable courier services to
              ensure your products arrive safely and on time.
            </p>
            <p>
              Once your order is dispatched, you will receive a confirmation with tracking
              information (where available). Please ensure the delivery address provided at
              checkout is accurate — we are not responsible for orders delivered to an
              incorrectly provided address.
            </p>
          </div>
        </section>

        {/* ── Returns & Exchanges ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand">
              <RotateCcw size={20} />
            </div>
            <h2 className="text-xl font-bold text-navy">Returns &amp; Exchanges</h2>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              Your satisfaction is important to us. If you are not completely happy with your
              purchase, you may be eligible for a return or exchange under the following
              conditions:
            </p>
            <h3 className="font-bold text-navy mt-6">Eligibility</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Items must be returned within <strong>7 days</strong> of delivery.
              </li>
              <li>
                Products must be unused, in their original packaging, and in the same
                condition as received.
              </li>
              <li>
                Certain items such as consumables, perishable goods, and personal hygiene
                products are non-returnable for health and safety reasons.
              </li>
            </ul>
            <h3 className="font-bold text-navy mt-6">How to Initiate a Return</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Contact us via phone at <strong>+254 712 775 426</strong> or email us at{' '}
                <strong>info@lijustores.co.ke</strong> within 7 days of receiving
                your order.
              </li>
              <li>
                Provide your order number and a brief description of the issue.
              </li>
              <li>
                We will guide you through the return process, including any pickup
                arrangements if applicable.
              </li>
            </ol>
            <h3 className="font-bold text-navy mt-6">Refunds</h3>
            <p>
              Once we receive and inspect the returned item, we will notify you of the
              status. Approved refunds will be processed within <strong>5–7 business days</strong>{' '}
              and credited back to your original payment method. Shipping costs are
              non-refundable unless the return is due to an error on our part (e.g.,
              wrong or defective item).
            </p>
          </div>
        </section>

        {/* ── Damaged / Defective Items ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand">
              <RefreshCw size={20} />
            </div>
            <h2 className="text-xl font-bold text-navy">Damaged or Defective Items</h2>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              If you receive a damaged or defective item, please contact us immediately.
              We will arrange a replacement or full refund, including any shipping costs,
              at no extra charge to you.
            </p>
            <p>
              We may request photographic evidence of the damage to help us resolve the
              issue as quickly as possible and improve our packaging processes.
            </p>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand">
              <Gift size={20} />
            </div>
            <h2 className="text-xl font-bold text-navy">Questions?</h2>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              If you have any questions about our return or shipping policy, feel free to
              reach out. We are happy to help.
            </p>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
              <p>
                <strong>Phone:</strong> +254 712 775 426
              </p>
              <p>
                <strong>Email:</strong> info@lijustoreenterprises.co.ke
              </p>
              <p>
                <strong>Visit us:</strong> Gaberone plaza, third floor shop T1, Nairobi, Kenya
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
