/**
 * WhatsApp ordering helpers.
 *
 * Customers are redirected to the shop's WhatsApp number with a pre-filled
 * message that highlights the product(s) they want to order.
 */

/** Order line shown on WhatsApp (works for both cart items and single products). */
export interface WhatsAppOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface WhatsAppCustomerDetails {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

/** Shop WhatsApp number in international format (no +, spaces or dashes). */
export const WHATSAPP_NUMBER = '254712775426';

/** Human readable version of the shop WhatsApp number. */
export const WHATSAPP_DISPLAY = '+254 712 775426';

function formatMoney(value: number) {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Build a wa.me link for the shop number with the given message pre-filled. */
export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build the opening WhatsApp message. The first line always highlights the
 * product the customer wants so the shop knows immediately what the chat is about.
 */
export function buildOrderMessage(
  items: WhatsAppOrderItem[],
  total: number,
  details: WhatsAppCustomerDetails = {},
) {
  const firstItem = items[0];

  const opening =
    items.length === 1 && firstItem
      ? `Hello Lijustore! 👋 I would like to order *${firstItem.name}* x${firstItem.quantity} (KSh ${formatMoney(
          firstItem.price * firstItem.quantity,
        )}).`
      : 'Hello Lijustore! 👋 I would like to order the following:';

  const lines: string[] = [opening];

  if (items.length > 1) {
    lines.push(
      '',
      ...items.map(
        (item) =>
          `• *${item.name}* x${item.quantity} — KSh ${formatMoney(item.price * item.quantity)}`,
      ),
    );
  }

  lines.push('', `*Order total:* KSh ${formatMoney(total)}`);

  const customerLines = [
    details.name?.trim() ? `Name: ${details.name.trim()}` : null,
    details.address?.trim() ? `Delivery address: ${details.address.trim()}` : null,
    details.phone?.trim() ? `Phone: ${details.phone.trim()}` : null,
    details.email?.trim() ? `Email: ${details.email.trim()}` : null,
  ].filter(Boolean) as string[];

  if (customerLines.length > 0) {
    lines.push('', '*My details:*', ...customerLines);
  }

  lines.push('', 'Please confirm availability and delivery. Thank you!');

  return lines.join('\n');
}
