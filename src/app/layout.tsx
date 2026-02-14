'use client';

import { Cormorant_Garamond, Lato } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { useState } from 'react';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <head>
        <title>Sivananda Sastry - Spiritual Teachings</title>
        <meta
          name="description"
          content="Explore the comprehensive digital archive of Sivananda Sastry's spiritual teachings — Vedic scriptures, sacred hymns, devotional discourses, and timeless wisdom."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-4 left-4 z-[2000] lg:hidden w-14 h-14 rounded-xl
                     bg-accent-primary border-2 border-white/20
                     flex flex-col items-center justify-center gap-[5px]
                     shadow-[0_4px_12px_rgba(139,90,60,0.4)]
                     transition-all duration-300 active:scale-[0.92]
                     touch-manipulation select-none ${sidebarOpen ? 'bg-accent-secondary' : ''}`}
          aria-label="Toggle menu"
        >
          <span className={`block w-7 h-[3px] bg-white rounded-sm transition-all duration-300 ${sidebarOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-7 h-[3px] bg-white rounded-sm transition-all duration-300 ${sidebarOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-7 h-[3px] bg-white rounded-sm transition-all duration-300 ${sidebarOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[999] lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 lg:ml-[300px] min-h-screen bg-bg-primary">
            <div className="px-4 py-8 sm:px-6 lg:px-12 lg:py-10 max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
