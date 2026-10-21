import { redirect } from 'next/navigation'

/**
 * Checkout now happens directly on the cart page, so the old standalone
 * checkout route simply sends customers there.
 */
export default function CheckoutPage() {
  redirect('/cart')
}
