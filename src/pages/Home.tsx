import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones, Flame, Laptop, Home as HomeIcon, Dumbbell, Sparkles, LayoutGrid, Tag, ChevronLeft, ChevronRight, Car, Droplets, Armchair, Baby, ChefHat, Lightbulb, Wifi, Camera, Sun, Gift, Plug } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useSearch } from '../context/SearchContext';

const FEATURES = [
  { Icon: Truck,        title: 'Free Shipping',   desc: 'On orders over KSh 50' },
  { Icon: RotateCcw,    title: 'Easy Returns',     desc: '30-day return policy' },
  { Icon: ShieldCheck,  title: 'Secure Payment',   desc: '256-bit SSL encryption' },
  { Icon: Headphones,   title: '24/7 Support',     desc: 'Always here to help' },
];

// Category icons mapping (optional, fallback to text if not found)
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Automotive Accessories': Car,
  'Bathroom Organizers': Droplets,
  'Electronics': Laptop,
  'Fitness Equipment': Dumbbell,
  'Furniture': Armchair,
  'Home & Living': HomeIcon,
  'Home Appliances': Plug,
  'Kids & Baby': Baby,
  'Kitchen Appliances': ChefHat,
  'Lighting': Lightbulb,
  'Networking & Communication': Wifi,
  'Security Cameras & Surveillance Systems': Camera,
  'Solar & Power Backup': Sun,
  'Toys & Kids\' Gifts': Gift,
  'All': LayoutGrid,
};

const SLIDES = [
  {
    badge: { icon: Flame, color: 'text-gold', label: 'Summer Sale' },
    headline: ['Up to 50% Off', 'Electronics'],
    headlineAccent: 1,
    body: 'Shop the biggest deals on headphones, smartwatches, TVs and more.',
    cta: { label: 'Shop Electronics', category: 'Electronics' },
    overlay: 'from-blue-950/80 via-blue-950/60 to-transparent',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  },
  {
    badge: { icon: ChefHat, color: 'text-orange-300', label: 'Best Deals' },
    headline: ['Over 14 Products', 'Kitchen Appliances'],
    headlineAccent: 1,
    body: 'Find everything you need to equip your kitchen with top-quality appliances.',
    cta: { label: 'Shop Kitchen', category: 'Kitchen Appliances' },
    overlay: 'from-orange-950/80 via-orange-950/60 to-transparent',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80',
  },
  {
    badge: { icon: Sparkles, color: 'text-amber-300', label: 'Top Picks' },
    headline: ['Power Up Your', 'Home Appliances'],
    headlineAccent: 1,
    body: 'Premium home appliances designed to make everyday living easier.',
    cta: { label: 'Shop Appliances', category: 'Home Appliances' },
    overlay: 'from-emerald-950/80 via-emerald-950/60 to-transparent',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80',
  },
  {
    badge: { icon: Car, color: 'text-slate-300', label: 'Drive Ready' },
    headline: ['Premium', 'Automotive Accessories'],
    headlineAccent: 1,
    body: 'From car care to tech upgrades — everything for your ride.',
    cta: { label: 'Shop Automotive', category: 'Automotive Accessories' },
    overlay: 'from-slate-950/80 via-slate-950/60 to-transparent',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function HomePage() {
  const { setSelectedCategory, filteredProducts, categories, loading, error } = useSearch();
  const navigate = useNavigate();

  // ── Carousel state ──────────────────────────────────────────────────────
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const goToCategory = (cat: string) => {
    setSelectedCategory(cat);
    navigate('/products');
  };

  const bestsellers = filteredProducts.filter((p) => p.badge === 'Bestseller');
  const onSale      = filteredProducts.filter((p) => p.badge === 'Sale');
  const topRated    = [...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (error) return <div className="text-center py-24 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen">
      {/* ── Hero Carousel ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => {
            const BadgeIcon = slide.badge.icon;
            return (
              <div
                key={i}
                className="min-w-full text-white py-20 relative bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                {/* dark gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} pointer-events-none`} />

                <div className="max-w-7xl mx-auto px-4 items-center relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-white/15 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                      <BadgeIcon size={15} className={slide.badge.color} /> {slide.badge.label}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                      {slide.headline.map((line, li) => (
                        <React.Fragment key={li}>
                          {li === slide.headlineAccent
                            ? <span className="text-brand">{line}</span>
                            : line}
                          {li < slide.headline.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h1>
                    <p className="text-white/75 text-lg max-w-md mb-8">{slide.body}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => { setSelectedCategory(slide.cta.category); navigate('/products'); }}
                        className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full font-bold transition-colors"
                      >
                        {slide.cta.label} <ArrowRight size={18} />
                      </button>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white px-6 py-3 rounded-full font-bold transition-colors no-underline"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-6 h-2.5' : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Features bar ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-3">
              <Icon size={26} className="text-brand shrink-0" />
              <div>
                <p className="text-sm font-bold text-navy m-0">{title}</p>
                <p className="text-xs text-gray-500 m-0">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-black text-navy">Shop by Category</h2>
            <Link to="/products" className="flex items-center gap-1 text-brand font-semibold text-sm hover:gap-2 transition-all no-underline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || LayoutGrid;
              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(cat)}
                  className={`bg-gray-50 flex flex-col items-center gap-2 py-5 px-2 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200`}
                >
                  <Icon size={28} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-black text-navy">Bestsellers</h2>
            <Link to="/products" className="flex items-center gap-1 text-brand font-semibold text-sm hover:gap-2 transition-all no-underline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...bestsellers, ...topRated.filter((p) => !bestsellers.find((b) => b.id === p.id))]
              .slice(0, 8)
              .filter((p) => p.image && p.image.toString().trim() !== '')
              .map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Promo banner ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-brand to-brand-dark py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-3">New Arrivals Just Dropped</h2>
          <p className="text-white/80 text-lg mb-7">
            Explore the latest electronics, fashion, and home essentials.
          </p>
          <button
            onClick={() => goToCategory('All')}
            className="inline-flex items-center gap-2 bg-white text-brand hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors"
          >
            Shop Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── On Sale ───────────────────────────────────────────────────────── */}
      {onSale.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-2xl font-black text-navy flex items-center gap-2"><Tag size={22} className="text-brand" /> On Sale</h2>
              <Link to="/products" className="flex items-center gap-1 text-brand font-semibold text-sm hover:gap-2 transition-all no-underline">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {onSale
                .filter((p) => p.image && p.image.toString().trim() !== '')
                .map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
