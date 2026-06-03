import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Heart, ChevronDown, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

export default function Header() {
  const { totalItems } = useCart();
  const { query, setQuery, setSelectedCategory, categories } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products');
  };

  const goToCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCatMenuOpen(false);
    setMenuOpen(false);
    navigate('/products');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div ref={searchRef} className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 no-underline">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-brand shadow-md">
                <img src="/logo.jpeg" alt="Liastute Entreprises" className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="hidden md:block flex-1 max-w-2xl">
              {/* Desktop Search */}
              <form onSubmit={handleSearch}>
                <div
                  className={`flex items-center rounded-full overflow-hidden border-2 transition-colors ${
                    searchFocused ? 'border-brand bg-white' : 'border-transparent bg-gray-100'
                  }`}
                >
                  <Search size={18} className="ml-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search products, brands and categories..."
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="flex items-center px-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <Link
                to="/wishlist"
                className="hidden sm:inline-flex p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-brand transition-colors"
              >
                <Heart size={22} />
              </Link>
              <Link
                to="/cart"
                className="relative p-2 rounded-full bg-blue-50 text-brand hover:bg-blue-100 transition-colors"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden p-2 text-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div
                className={`flex items-center rounded-full overflow-hidden border-2 transition-colors ${
                  searchFocused ? 'border-brand bg-white' : 'border-transparent bg-gray-100'
                }`}
              >
                <Search size={17} className="ml-3 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent px-2.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="flex items-center px-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-brand hover:bg-brand-dark text-white px-4 py-2.5 text-sm font-semibold transition-colors shrink-0"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className={`bg-navy ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:flex-wrap md:items-center gap-1">
          {/* Categories dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setCatMenuOpen(!catMenuOpen)}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 bg-brand hover:bg-brand-dark text-white px-4 py-2.5 rounded text-sm font-semibold transition-colors"
            >
              All Categories <ChevronDown size={15} />
            </button>
            {catMenuOpen && (
              <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden md:absolute md:top-full md:left-0 md:min-w-52">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => goToCategory(cat)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/products' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="w-full md:w-auto px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {['Electronics', 'Kitchen Appliances', 'Home Appliances', 'Automotive Accessories', 'Lighting'].map((cat) => (
            <button
              key={cat}
              onClick={() => goToCategory(cat)}
              className="hidden lg:inline-flex px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-colors"
            >
              {cat}
            </button>
          ))}

          <span className="hidden md:inline-flex md:ml-auto text-gold text-sm font-semibold items-center gap-1.5">
            <Flame size={14} /> Mid Year Sale - Up to 50% off
          </span>
          <span className="text-gold text-xs font-semibold flex items-center gap-1.5 md:hidden px-1 py-2">
            <Flame size={13} /> Mid Year Sale - Up to 50% off
          </span>
        </div>
      </nav>
    </header>
  );
}
