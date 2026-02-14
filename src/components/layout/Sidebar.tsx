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
  const pathname = usePathname();

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/processed/categories.json`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {
        // Silently fail if data not available yet
      });
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter out categories with zero videos
  const visibleCategories = data?.categories.filter((c) => c.videoCount > 0) || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-40
          w-72 h-[calc(100vh-4rem)] overflow-y-auto
          bg-brand-950 border-r border-brand-700
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:block
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-1">
          {/* Home link */}
          <Link
            href="/"
            className={`sidebar-link flex items-center gap-2 ${
              pathname === '/' ? 'sidebar-link-active' : ''
            }`}
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </Link>

          {/* Stats */}
          {data && (
            <div className="px-3 py-2 text-xs text-brand-500">
              {data.totalVideos.toLocaleString()} videos &middot;{' '}
              {visibleCategories.length} categories
            </div>
          )}

          <div className="border-t border-brand-800 my-2" />

          {/* Categories */}
          {visibleCategories.map((category) => (
            <SidebarItem
              key={category.id}
              category={category}
              currentPath={pathname}
            />
          ))}

          {/* About link */}
          <div className="border-t border-brand-800 my-2" />
          <Link
            href="/about/"
            className={`sidebar-link flex items-center gap-2 ${
              pathname === '/about' || pathname === '/about/' ? 'sidebar-link-active' : ''
            }`}
          >
            <span className="text-base">ℹ️</span>
            <span>About</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
