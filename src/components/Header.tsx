import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { getDisplayCategory } from "../utils/api";

export default function Header() {
  const { totalItems } = useCart();
  const { query, setQuery, setSelectedCategory, categories, filteredProducts } =
    useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = query.trim().toLowerCase();
  const searchSuggestions = trimmedQuery
    ? filteredProducts
        .filter((product) => {
          const hasImage =
            typeof product.image === "string" && product.image.trim() !== "";
          const haystack =
            `${product.name} ${product.category} ${getDisplayCategory(product.category)} ${product.description}`.toLowerCase();
          return hasImage && haystack.includes(trimmedQuery);
        })
        .slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      query.trim()
        ? `/products?q=${encodeURIComponent(query.trim())}`
        : "/products",
    );
  };

  const goToCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCatMenuOpen(false);
    setMenuOpen(false);
    navigate("/products");
  };

  const goToProduct = (id: number) => {
    setMenuOpen(false);
    setSearchFocused(false);
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div ref={searchRef} className="relative max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 no-underline">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-brand shadow-md">
                <img
                  src="/logo.jpeg"
                  alt="Liastute Entreprises"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="hidden md:block flex-1 max-w-2xl">
              {/* Desktop Search */}
              <form onSubmit={handleSearch}>
                <div
                  className={`flex items-center rounded-full overflow-hidden border-2 transition-colors ${
                    searchFocused
                      ? "border-brand bg-white"
                      : "border-transparent bg-gray-100"
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
                      onClick={() => setQuery("")}
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
                    {totalItems > 99 ? "99+" : totalItems}
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
                  searchFocused
                    ? "border-brand bg-white"
                    : "border-transparent bg-gray-100"
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
                    onClick={() => setQuery("")}
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

          {searchFocused && trimmedQuery && searchSuggestions.length > 0 && (
            <div className="absolute left-4 right-4 top-[calc(100%-0.25rem)] md:left-1/2 md:right-auto md:w-[min(42rem,calc(100vw-2rem))] md:-translate-x-1/2 z-50">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  Suggestions
                </div>
                <div className="max-h-80 overflow-auto">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToProduct(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {getDisplayCategory(product.category)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-navy shrink-0">
                        KSh {product.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchFocused(false);
                    navigate(
                      trimmedQuery
                        ? `/products?q=${encodeURIComponent(query.trim())}`
                        : "/products",
                    );
                  }}
                  className="w-full border-t border-gray-100 px-4 py-3 text-sm font-semibold text-brand hover:bg-blue-50 transition-colors"
                >
                  View all results for “{query.trim()}”
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className={`bg-navy ${menuOpen ? "block" : "hidden md:block"}`}>
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
              <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden md:absolute md:top-full md:left-0 md:min-w-72">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => goToCategory(cat)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
                  >
                    <span>{cat}</span>
                    {cat !== "All" && (
                      <ChevronRight size={14} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/products" },
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

          {[
            "Electronics & Entertainment",
            "Kitchen & Commercial Equipment",
            "Home Appliances Kenya",
            "Tools, Electrical & Automotive",
          ].map((cat) => (
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
