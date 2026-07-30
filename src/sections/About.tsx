import { Award, CheckCircle2, HeartHandshake, ShieldCheck, Truck, Users } from 'lucide-react';
import Seo from '../components/Seo';

const VALUES = [
  {
    icon: Award,
    title: 'Curated quality',
    text: 'We stock practical products that are useful, durable, and priced fairly for everyday buyers.',
  },
  {
    icon: Truck,
    title: 'Reliable delivery',
    text: 'Orders are handled with the goal of getting products to customers quickly and safely.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust first',
    text: 'We focus on clear product information, honest pricing, and a smooth buying experience.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer care',
    text: 'Support does not end at checkout. We aim to help customers choose the right product.',
  },
];

const STATS = [
  { value: '100+', label: 'Products curated' },
  { value: 'Fast', label: 'Order handling' },
  { value: 'Kenya', label: 'Local focus' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pb-16">
      <Seo
        title="About Lijustore"
        description="Learn about Lijustore, a Kenya-based store focused on practical, reliable products for homes, work, and everyday life."
        canonicalPath="/about"
      />
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand">
            <Users size={16} />
            About Lijustore
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
            Practical products for homes, work, and everyday life.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Lijustore is built around the idea that shopping should be straightforward: clear choices,
            fair value, and products that solve real problems. From kitchen equipment to electronics,
            we aim to make it easy to find items that fit daily needs without the noise.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-dark"
            >
              Shop Products
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-navy no-underline transition-colors hover:border-brand hover:text-brand"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-gray-50 p-4 text-center">
                <p className="text-2xl font-black text-navy">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-navy p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-white/60">Our promise</p>
            <p className="mt-3 text-lg font-semibold leading-7 text-white/90">
              We want every visit to feel dependable, from discovery to checkout and after-sales support.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-brand">
                <Icon size={20} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-gradient-to-r from-navy to-slate-800 px-6 py-8 text-white sm:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/90">
            <CheckCircle2 size={16} />
            Built for customers in Kenya
          </p>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl">A store that keeps things simple.</h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            We keep the catalog focused on practical categories and make it easier to browse by
            grouping items into useful collections. The goal is less friction and a clearer path to
            the right product.
          </p>
        </div>
      </section>
    </div>
  );
}