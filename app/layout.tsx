import Header from '@/components/Header'
import './globals.css'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'
import { LocationFilterProvider } from '@/components/LocationFilterProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import StructuredData from '@/components/StructuredData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
    template: '%s | Balık Nerede'
  },
  description: 'Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş. Diğer avcılarla deneyimlerini paylaş ve yeni av noktaları keşfet.',
  keywords: ['balık avı', 'balık avcılığı', 'sosyal platform', 'av noktaları', 'balık türleri', 'av deneyimleri', 'fishing', 'türkiye balık avı'],
  authors: [{ name: 'Balık Nerede' }],
  creator: 'Balık Nerede',
  publisher: 'Balık Nerede',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://baliknerde.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://baliknerde.com',
    title: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
    description: 'Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş. Diğer avcılarla deneyimlerini paylaş ve yeni av noktaları keşfet.',
    siteName: 'Balık Nerede',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
    description: 'Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console'dan alınacak
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" type="image/png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <LocationFilterProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </LocationFilterProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

