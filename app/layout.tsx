import React from 'react'
import type { Metadata } from 'next'
import { Inter, Anton } from 'next/font/google'
import './globals.css'
import '../styles/movie-card.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })
const anton = Anton({ subsets: ['latin'], weight: '400' })
export const metadata: Metadata = {
  title: 'PhimChill - Xem Phim Online Miễn Phí',
  description: 'Website xem phim online miễn phí chất lượng cao, cập nhật phim mới nhất',
  keywords: 'xem phim online, phim hay, phim mới, phim hd',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        <div className="min-h-screen">
          <Header />
          <main className="pt-16 md:pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
