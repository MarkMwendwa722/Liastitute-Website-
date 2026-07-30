import { Suspense } from 'react'
import ProductsPage from '@/sections/Products'

export default function Products() {
  return (
    <Suspense fallback={<div className="text-center py-24">Loading...</div>}>
      <ProductsPage />
    </Suspense>
  )
}

