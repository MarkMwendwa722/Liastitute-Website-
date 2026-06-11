import type { CartItem } from '../types';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  townCity: string;
  notes?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  paymentMethod: string;
  orderTotal: number;
}

export function buildOrderEmailSubject(orderNumber: string) {
  return `New Liastute Order ${orderNumber}`;
}

export function buildOrderEmailHtml(order: OrderEmailData) {
  const deliveryNotes = order.customer.notes?.trim() || 'None provided';
  const customerEmail = order.customer.email?.trim() || 'Not provided';
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">KSh ${formatMoney(item.price)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">KSh ${formatMoney(item.price * item.quantity)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h1 style="margin:0 0 8px;font-size:24px;">New order received</h1>
      <p style="margin:0 0 24px;color:#475569;">Order number: <strong>${escapeHtml(order.orderNumber)}</strong></p>

      <h2 style="font-size:18px;margin:0 0 12px;">Customer details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:#64748b;">Name</td><td style="padding:8px 0;"><strong>${escapeHtml(order.customer.name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;"><strong>${escapeHtml(order.customer.phone)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${escapeHtml(customerEmail)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Town/City</td><td style="padding:8px 0;">${escapeHtml(order.customer.townCity)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Exact location / notes</td><td style="padding:8px 0;">${escapeHtml(deliveryNotes)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Payment</td><td style="padding:8px 0;">${escapeHtml(order.paymentMethod)}</td></tr>
      </table>

      <h2 style="font-size:18px;margin:0 0 12px;">Items bought</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:12px;text-align:left;">Item</th>
            <th style="padding:12px;text-align:center;">Quantity</th>
            <th style="padding:12px;text-align:right;">Price</th>
            <th style="padding:12px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="margin:20px 0 0;font-size:18px;text-align:right;">
        Total: <strong>KSh ${formatMoney(order.orderTotal)}</strong>
      </p>
    </div>
  `;
}

function formatMoney(value: number) {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
