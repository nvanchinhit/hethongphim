import React from 'react'
import type { Metadata } from 'next'
// Removed Google Fonts to avoid network errors; use system fonts via Tailwind
import './globals.css'
import '../styles/movie-card.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { ReactNode } from 'react'

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
    <html lang="vi" className="dark" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={`bg-slate-900 text-white min-h-screen`}>
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
