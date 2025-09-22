import Header from '@/components/Header'
import './globals.css'
import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"> 
      <div className='flex flex-col min-h-screen'>

        <Header />

        <main className='flex-grow container mx-auto py-4'>
          {children}  
        </main>

        <Footer />
      </div>
      <body>
        

      </body>
    </html>
  )
}