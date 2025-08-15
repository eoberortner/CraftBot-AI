import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Craft Brewing AI Agent',
  description: 'AI-powered craft brewing assistant with recipe analysis and taproom curation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
