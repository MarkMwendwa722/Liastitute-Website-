import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { useSearch } from '../context/SearchContext';
// categories now comes from useSearch context

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'reviews',    label: 'Most Reviewed' },
] as const;

export default function ProductsPage() {
  const {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    priceRange, setPriceRange,
    filteredProducts,
    categories,
    loading,
    error,
  } = useSearch();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q   = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q)   setQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceRange([0, 100000]);
  };

  const hasFilters =
    query !== '' ||
    selectedCategory !== 'All' ||
    sortBy !== 'featured' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100000;

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (error) return <div className="text-center py-24 text-red-500">{error}</div>;

  const hasSearchFilters = searchParams.toString().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16 min-h-[70vh]">
      <Seo
        title={hasSearchFilters ? 'Filtered Products' : 'Shop Products'}
        description="Browse Liastute products by category, price, rating, and search terms."
        canonicalPath="/products"
        noindex={hasSearchFilters}
      />
      <div className="flex gap-7 items-start">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="w-56 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-32 hidden md:block">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 font-bold text-navy text-sm">
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-brand text-xs font-semibold hover:bg-blue-50 px-2 py-1 rounded-full transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Category */}
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</p>
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-50 text-brand font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price range */}
          <div className="px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-brand"
                placeholder="Min"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                min={priceRange[0]}
                max={100000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-brand"
                placeholder="Max"
              />
            </div>
            <p className="text-xs text-gray-400">KSh {priceRange[0]} – KSh {priceRange[1]}</p>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {query && (
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600">
                  &ldquo;<strong>{query}</strong>&rdquo;
                  <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                    <X size={13} />
                  </button>
                </span>
              )}
              <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              Sort by:
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-brand cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'All' && (
                <span className="flex items-center gap-1.5 bg-blue-50 text-brand px-3 py-1 rounded-full text-xs font-semibold">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}><X size={11} /></button>
                </span>
              )}
              {query && (
                <span className="flex items-center gap-1.5 bg-red-50 text-brand px-3 py-1 rounded-full text-xs font-semibold">
                  Search: {query}
                  <button onClick={() => setQuery('')}><X size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-navy mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={clearFilters}
                className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts
                .filter((p) => p.image && p.image.toString().trim() !== '')
                .map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
