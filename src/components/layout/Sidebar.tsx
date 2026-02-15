'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarItem } from './SidebarItem';
import type { CategoriesData } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [data, setData] = useState<CategoriesData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/processed/categories.json`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleCategories = data?.categories.filter((c) => c.videoCount > 0) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/search/?q=${encodeURIComponent(trimmed)}`;
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[1000] w-[280px] h-screen overflow-y-auto
        sidebar-panel
        border-r border-[#2a2118]
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        max-lg:max-w-[85vw] max-lg:w-[280px] max-lg:z-[1001]
      `}
    >
      {/* Brand Header */}
      <div className="px-6 pt-8 pb-5 text-center">
        <Link href="/" className="block group">
          <div className="w-6 h-px bg-[#b8976a]/60 mx-auto mb-4 group-hover:w-10 transition-all duration-500" />
          <h1 className="font-heading text-[1.5rem] font-bold text-[#e8dcc8] tracking-[0.03em] leading-tight">
            Sivananda Sastry
          </h1>
          <p className="text-[0.55rem] text-[#6b5d4e] uppercase tracking-[5px] mt-2 font-bold">
            Spiritual Teacher
          </p>
          <div className="w-6 h-px bg-[#b8976a]/60 mx-auto mt-4 group-hover:w-10 transition-all duration-500" />
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teachings..."
            className="w-full px-3.5 py-2 pr-9 bg-[#1a150f] border border-[#352a20] rounded
                       text-[#c4b59e] text-[0.8rem] font-body
                       placeholder:text-[#4e4238]
                       focus:outline-none focus:border-[#b8976a]/40
                       transition-all duration-300"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e5347] hover:text-[#b8976a] transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="h-px bg-[#352a20] mx-4" />

      {/* Navigation */}
      <nav className="py-2 px-1.5">
        <Link
          href="/"
          className={`sidebar-nav-item ${pathname === '/' ? 'sidebar-nav-active' : ''}`}
        >
          <span className="text-sm shrink-0 opacity-60">🏠</span>
          <span className="font-body text-[0.85rem] font-semibold text-[#c4b59e] relative z-[1] tracking-wide">
            Home
          </span>
        </Link>

        <div className="h-px bg-[#352a20]/60 mx-3 my-1.5" />

        {visibleCategories.map((category) => (
          <SidebarItem
            key={category.id}
            category={category}
            currentPath={pathname}
          />
        ))}
      </nav>

      {data && (
        <div className="px-4 py-3.5 text-center border-t border-[#352a20]/50 mt-auto">
          <p className="text-[0.55rem] text-[#4e4238] font-bold tracking-[3px] uppercase">
            {data.totalVideos.toLocaleString()} teachings
          </p>
        </div>
      )}
    </aside>
  );
}
