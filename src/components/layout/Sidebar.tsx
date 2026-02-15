'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarItem } from './SidebarItem';
import { SearchBar } from '@/components/ui/SearchBar';
import type { CategoriesData } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [data, setData] = useState<CategoriesData | null>(null);
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

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[1000] w-[300px] h-screen overflow-y-auto
        sidebar-panel
        border-r border-[#3d3228] shadow-elevated
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        max-lg:max-w-[85vw] max-lg:w-[280px] max-lg:z-[1001]
      `}
    >
      {/* Panel Header */}
      <div className="px-8 pt-10 pb-6 text-center border-b border-[#3d3228]/60">
        <Link href="/" className="block">
          <div className="w-10 h-0.5 bg-[#c9a96e] mx-auto mb-4" />
          <h1 className="font-heading text-[1.8rem] font-semibold text-[#e8d5b0] tracking-wide leading-tight">
            Sivananda Sastry
          </h1>
          <p className="text-[0.7rem] text-[#9a8b78] uppercase tracking-[3px] mt-2 font-semibold">
            Devotional Discourses
          </p>
        </Link>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-[#3d3228]/60">
        <SearchBar />
      </div>

      {/* Navigation */}
      <nav className="py-2">
        <Link
          href="/"
          className={`sidebar-nav-item ${pathname === '/' ? 'sidebar-nav-active' : ''}`}
        >
          <span className="text-lg shrink-0">🏠</span>
          <span className="font-heading text-[1.05rem] font-medium text-[#d4c4aa] relative z-[1]">
            Home
          </span>
        </Link>

        {visibleCategories.map((category) => (
          <SidebarItem
            key={category.id}
            category={category}
            currentPath={pathname}
          />
        ))}
      </nav>

      {data && (
        <div className="px-6 py-5 text-center text-[0.7rem] text-[#7a6d5e] border-t border-[#3d3228]/60 mt-auto font-semibold tracking-wider uppercase">
          <p>{data.totalVideos.toLocaleString()} videos &middot; {visibleCategories.length} categories</p>
        </div>
      )}
    </aside>
  );
}
