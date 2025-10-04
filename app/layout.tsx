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

