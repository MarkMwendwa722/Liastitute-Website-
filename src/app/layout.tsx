import type { Metadata } from 'next'
import './globals.css'
import LayoutClient from './LayoutClient'
import { fetchProducts } from '@/utils/api'

const SITE_NAME = 'Lijustore'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lijustore.co.ke'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} Kenya | Home Appliances, Electronics, Furniture and More`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Shop practical home appliances, electronics, kitchen equipment, furniture, tools, and daily essentials at Lijustore Kenya.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: '/logo.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/logo.jpeg',
  },
}

// Cache products server-side for 5 minutes so every page load isn't blocked
// by a slow API call. Keeps product data in the SSR HTML (SEO) while staying fast.
let productsCache: { data: import('@/types').Product[]; at: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getProducts() {
  if (productsCache && Date.now() - productsCache.at < CACHE_TTL) {
    return productsCache.data
  }
  try {
    const data = await fetchProducts()
    productsCache = { data, at: Date.now() }
    return data
  } catch {
    return []
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const products = await getProducts()

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18336756304"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18336756304');
            `,
          }}
        />
      </head>
      <body>
        <LayoutClient initialProducts={products}>{children}</LayoutClient>
      </body>
    </html>
  )
}
