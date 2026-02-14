'use client';

import Link from 'next/link';
import { SearchBar } from '@/components/ui/SearchBar';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-brand-950/95 backdrop-blur-md border-b border-brand-700">
      <div className="flex items-center h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 mr-2 text-brand-200 hover:text-brand-300 hover:bg-brand-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 mr-6 shrink-0">
          <span className="text-2xl">🕉️</span>
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-semibold text-brand-300 leading-tight">
              Sivananda Sastry
            </h1>
            <p className="text-xs text-brand-500 tracking-widest uppercase">
              Sacred Teachings
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="font-heading text-base font-semibold text-brand-300">
              Sivananda Sastry
            </h1>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl ml-auto">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
