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
      .catch(() => {});
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleCategories = data?.categories.filter((c) => c.videoCount > 0) || [];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[1000] w-[260px] h-screen overflow-y-auto
        bg-[#faf6f0] border-r border-[#e0d6c8]
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        max-lg:max-w-[85vw] max-lg:w-[260px] max-lg:z-[1001]
      `}
    >
      {/* Brand Header */}
      <div className="px-6 pt-7 pb-5">
        <Link href="/" className="block group">
          <div className="w-8 h-[1px] bg-[#8b5a3c]/30 mb-4 group-hover:w-12 transition-all duration-500" />
          <h1 className="font-heading text-[1.4rem] font-bold text-[#3d2914] tracking-[0.02em] leading-tight">
            Sivananda Sastry
          </h1>
          <p className="text-[0.55rem] text-[#8b7d6f] uppercase tracking-[4px] mt-1.5 font-semibold">
            Spiritual Teacher
          </p>
        </Link>
      </div>

      <div className="h-[1px] bg-[#e0d6c8] mx-5" />

      {/* Navigation */}
      <nav className="py-3 px-2.5">
        <Link
          href="/"
          className={`sidebar-nav-item ${pathname === '/' ? 'sidebar-nav-active' : ''}`}
        >
          <span className="font-body text-[0.82rem] font-semibold text-[#5a4f47] relative z-[1]">
            Home
          </span>
        </Link>

        <div className="h-[1px] bg-[#e0d6c8]/60 mx-2 my-1" />

        {visibleCategories.map((category) => (
          <SidebarItem
            key={category.id}
            category={category}
            currentPath={pathname}
          />
        ))}
      </nav>

      {data && (
        <div className="px-5 py-3 mt-auto">
          <p className="text-[0.55rem] text-[#b0a494] font-semibold tracking-[2px] uppercase">
            {data.totalVideos.toLocaleString()} teachings
          </p>
        </div>
      )}
    </aside>
  );
}
