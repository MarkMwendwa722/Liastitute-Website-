import type { Metadata } from 'next'
import Script from 'next/script'
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

// Cache products server-side briefly so every page load isn't blocked by a
// slow API call, while still letting newly added products appear quickly. The
// client also reconciles in the background (see SearchContext), so this only
// keeps the SSR HTML reasonably fresh.
let productsCache: { data: import('@/types').Product[]; at: number } | null = null
const CACHE_TTL = 60 * 1000 // 60 seconds

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
      <body>
        {/* Google Ads tag — next/script (instead of raw <script> tags) so React
            doesn't warn about scripts rendered inside the component tree. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18336756304"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18336756304');
            `,
          }}
        />
        <LayoutClient initialProducts={products}>{children}</LayoutClient>
      </body>
    </html>
  )
}
