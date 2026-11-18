import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JsonLd } from '@/components/json-ld'
import { LanguageProvider } from '@/components/language-provider'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { organizationJsonLd, pageMetadata, siteUrl, staticPage } from '@/lib/seo'
import './globals.css'
import './brochure.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(staticPage('ar', 'home')),
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        url: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <JsonLd data={organizationJsonLd} />
        <LanguageProvider>
          {children}
          <WhatsAppFloat />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
