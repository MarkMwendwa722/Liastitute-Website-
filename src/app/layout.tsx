import type { Metadata } from 'next'
import './globals.css'
import LayoutClient from './LayoutClient'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
