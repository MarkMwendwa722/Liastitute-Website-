'use client'

import { CartProvider } from '@/context/CartContext'
import { SearchProvider } from '@/context/SearchContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Product } from '@/types'

export default function LayoutClient({
  children,
  initialProducts,
}: {
  children: React.ReactNode
  initialProducts: Product[]
}) {
  return (
    <CartProvider>
      <SearchProvider initialProducts={initialProducts}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </SearchProvider>
    </CartProvider>
  )
}
