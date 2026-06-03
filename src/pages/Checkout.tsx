import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STEPS = ['Shipping', 'Payment', 'Review'] as const;

type PaymentMethod = 'card' | 'mpesa' | 'bank';

interface ShippingForm {
  firstName: string; lastName: string;
  email: string;     phone: string;
  address: string;   city: string;
  country: string;   zip: string;
}

interface PaymentForm {
  cardNumber: string; cardName: string;
  expiry: string;     cvv: string;
  mpesa: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(`LIA-${Date.now().toString().slice(-6)}`);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: 'Kenya', zip: '',
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '', cardName: '', expiry: '', cvv: '', mpesa: '',
  });

  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  const tax          = totalPrice * 0.08;
  const grandTotal   = totalPrice + shippingCost + tax;

  const handleSF = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handlePF = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full font-bold no-underline transition-colors">
          Go Shopping
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-navy mb-1">Order Confirmed!</h2>
          <p className="text-brand font-bold mb-4">Order #{orderNumber}</p>
          <p className="text-gray-500 text-sm mb-4">
            Thank you! A confirmation email has been sent to <strong>{shipping.email || 'your email'}</strong>.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
            Total paid: <strong className="text-navy">KSh {grandTotal.toFixed(2)}</strong>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/" className="bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-colors no-underline">
              Back to Home
            </Link>
            <Link to="/products" className="border border-gray-200 hover:border-brand text-gray-700 hover:text-brand py-3 rounded-xl font-semibold transition-colors no-underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-brand transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left: Steps */}
        <div>
          {/* Step indicators */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-brand' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    i < step  ? 'bg-brand border-brand text-white' :
                    i === step ? 'border-brand text-brand bg-blue-50' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-brand' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-7">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input name="firstName" value={shipping.firstName} onChange={handleSF} placeholder="John" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input name="lastName" value={shipping.lastName} onChange={handleSF} placeholder="Doe" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" value={shipping.email} onChange={handleSF} placeholder="john@example.com" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Phone Number *</label>
                    <input name="phone" value={shipping.phone} onChange={handleSF} placeholder="+254 700 000 000" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address *</label>
                    <input name="address" value={shipping.address} onChange={handleSF} placeholder="123 Main Street" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input name="city" value={shipping.city} onChange={handleSF} placeholder="Nairobi" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input name="zip" value={shipping.zip} onChange={handleSF} placeholder="00100" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Country</label>
                    <select name="country" value={shipping.country} onChange={handleSF} className={inputClass}>
                      {['Kenya','Uganda','Tanzania','Ethiopia','United States','United Kingdom','Other'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!shipping.firstName || !shipping.email || !shipping.address}
                  className="mt-6 w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-6">Payment Method</h2>
                <div className="flex gap-3 mb-6 flex-wrap">
                  {([
                    { id: 'card' as PaymentMethod,  label: 'Card',          Icon: CreditCard  },
                    { id: 'mpesa' as PaymentMethod, label: 'M-Pesa',        Icon: Smartphone  },
                    { id: 'bank' as PaymentMethod,  label: 'Bank Transfer', Icon: Building2   },
                  ]).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
                        paymentMethod === id
                          ? 'border-brand bg-blue-50 text-brand'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={17} /> {label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Card Number</label>
                      <input name="cardNumber" value={payment.cardNumber} onChange={handlePF} placeholder="1234 5678 9012 3456" maxLength={19} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Cardholder Name</label>
                      <input name="cardName" value={payment.cardName} onChange={handlePF} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Expiry Date</label>
                      <input name="expiry" value={payment.expiry} onChange={handlePF} placeholder="MM/YY" maxLength={5} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CVV</label>
                      <input name="cvv" value={payment.cvv} onChange={handlePF} placeholder="123" maxLength={4} type="password" className={inputClass} />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mpesa' && (
                  <div>
                    <label className={labelClass}>M-Pesa Phone Number</label>
                    <input name="mpesa" value={payment.mpesa} onChange={handlePF} placeholder="+254 7XX XXX XXX" className={inputClass} />
                    <p className="text-xs text-gray-500 mt-2">You will receive an M-Pesa prompt to complete payment.</p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                    <p className="font-semibold text-gray-700 mb-3">Transfer to:</p>
                    {[['Bank', 'Equity Bank Kenya'], ['Account Name', 'Liastute Ltd'], ['Account No.', '0123456789'], ['Reference', orderNumber]].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-500 w-28 shrink-0">{k}:</span>
                        <span className="font-semibold text-navy">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:border-gray-300 transition-colors">
                    ← Back
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-colors">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-6">Review Your Order</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      title: 'Shipping to',
                      body: `${shipping.firstName} ${shipping.lastName} · ${shipping.address}, ${shipping.city}, ${shipping.country} · ${shipping.email}`,
                      onEdit: () => setStep(0),
                    },
                    {
                      title: 'Payment',
                      body: paymentMethod === 'card' ? `Card ending in ${payment.cardNumber.slice(-4) || '****'}` :
                            paymentMethod === 'mpesa' ? `M-Pesa: ${payment.mpesa}` : 'Bank Transfer',
                      onEdit: () => setStep(1),
                    },
                  ].map(({ title, body, onEdit }) => (
                    <div key={title} className="bg-gray-50 rounded-xl p-4 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-navy">{title}</span>
                        <button onClick={onEdit} className="text-brand text-xs font-semibold hover:underline">Edit</button>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-navy">KSh {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:border-gray-300 transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Place Order — KSh {grandTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-32">
          <h3 className="text-base font-black text-navy mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="truncate flex-1 pr-2">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                <span className="font-semibold shrink-0">KSh {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>KSh {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'text-success font-bold' : ''}>
                {shippingCost === 0 ? 'FREE' : `KSh ${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span><span>KSh {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-navy text-base pt-2 border-t border-gray-100">
              <span>Total</span><span>KSh {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
