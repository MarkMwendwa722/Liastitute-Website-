import { Link } from 'react-router-dom';
import { Share2, MessageCircle, Camera, Play, Mail, Phone, MapPin } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export default function Footer() {
  const { categories } = useSearch();
  const footerCategories = categories.filter((cat) => cat !== 'All').slice(0, 6);

  return (
    <footer className="bg-navy text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand shadow-md">
              <img src="/logo.jpeg" alt="Liastute Entreprises" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 mb-5 max-w-xs">
            Your one-stop destination for quality products at unbeatable prices.
            Shop with confidence and enjoy fast, reliable delivery.
          </p>
          <div className="flex gap-2">
            {[Share2, MessageCircle, Camera, Play].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', to: '/' },
              { label: 'All Products', to: '/products' },
              { label: 'Shopping Cart', to: '/cart' },
              { label: 'My Account', to: '/account' },
              { label: 'Wishlist', to: '/wishlist' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-400 hover:text-brand transition-colors no-underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {footerCategories.map((cat) => (
              <li key={cat}>
                <Link to={`/products?cat=${encodeURIComponent(cat)}`} className="text-gray-400 hover:text-brand transition-colors no-underline">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm mb-5">
            {[
              { Icon: MapPin, text: 'Gaberone plaza, third floor shop T1 Nairobi, Kenya' },
              { Icon: Phone, text: '+254 712 775 426' },
              { Icon: Mail, text: ' info@liastuteenterprises.co.ke' },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2">
                <Icon size={14} className="text-brand mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mb-2">Subscribe for deals &amp; updates</p>
          <form
            className="flex rounded-lg overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white/10 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white px-3 py-2 text-xs font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Liastute. All rights reserved.
          </p>
          <div className="flex gap-2">
            {['VISA', 'Mastercard', 'M-Pesa', 'PayPal'].map((m) => (
              <span key={m} className="bg-white/10 text-gray-400 text-[10px] font-semibold px-2.5 py-1 rounded">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
