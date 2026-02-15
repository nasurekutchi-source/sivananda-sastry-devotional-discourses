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
        bg-gradient-to-b from-bg-tertiary to-bg-secondary
        border-r border-border-light shadow-card
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        max-lg:max-w-[85vw] max-lg:w-[280px] max-lg:z-[1001]
      `}
    >
      {/* Panel Header */}
      <div className="px-8 pt-10 pb-6 text-center border-b border-border-light bg-bg-tertiary">
        <Link href="/" className="block">
          <h1 className="font-heading text-[1.75rem] font-semibold text-accent-primary tracking-wide leading-tight">
            Sivananda Sastry
          </h1>
          <p className="text-[0.75rem] text-text-tertiary uppercase tracking-[2px] mt-1 font-light">
            Spiritual Teachings
          </p>
        </Link>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-border-light">
        <SearchBar />
      </div>

      {/* Navigation */}
      <nav className="py-2">
        <Link
          href="/"
          className={`nav-item ${pathname === '/' ? 'nav-item-active' : ''}`}
        >
          <span className="text-lg shrink-0">🏠</span>
          <span className="font-heading text-[1.05rem] font-medium text-text-primary relative z-[1]">
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
        <div className="px-6 py-5 text-center text-[0.75rem] text-text-tertiary border-t border-border-light mt-auto">
          <p>{data.totalVideos.toLocaleString()} videos &middot; {visibleCategories.length} categories</p>
        </div>
      )}
    </aside>
  );
}
