import ProductsPage from '@/sections/Products'

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const { q, cat } = await searchParams
  return <ProductsPage initialQuery={q ?? ''} initialCategory={cat ?? 'All'} />
}

