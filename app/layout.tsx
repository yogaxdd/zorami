import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zorami - Anime Streaming',
  description: 'Watch your favorite anime series and movies on Zorami - the ultimate anime streaming platform',
  keywords: 'anime, streaming, watch anime, anime online, zorami, blue sky',
  authors: [{ name: 'Zorami Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/img/zorami.ico',
    shortcut: '/img/zorami.ico',
    apple: '/img/zorami.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {children}
        </div>
      </body>
    </html>
  )
}
