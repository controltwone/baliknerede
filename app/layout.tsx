import Header from '@/components/Header'
import './globals.css'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'
import { LocationFilterProvider } from '@/components/LocationFilterProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

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

