'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Category } from '@/lib/types';

interface SidebarItemProps {
  category: Category;
  currentPath: string;
}

export function SidebarItem({ category, currentPath }: SidebarItemProps) {
  const router = useRouter();
  const visibleSubs = category.subcategories
    .filter((s) => s.videoCount > 0)
    .sort((a, b) => {
      if (a.id === 'general') return 1;
      if (b.id === 'general') return -1;
      return 0;
    });
  const isInCategory = currentPath.startsWith(`/${category.id}`);
  const [expanded, setExpanded] = useState(isInCategory);

  useEffect(() => {
    if (isInCategory) setExpanded(true);
  }, [isInCategory]);

  const handleCategoryClick = () => {
    setExpanded(true);
    router.push(`/${category.id}/`);
  };

  return (
    <div>
      <div className={`sidebar-nav-item w-full ${isInCategory ? 'sidebar-nav-active' : ''}`}>
        <button
          onClick={handleCategoryClick}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
        >
          <span className="font-body text-[0.82rem] font-semibold text-[#5a4f47] relative z-[1] truncate">
            {category.name}
          </span>
        </button>
        <span className="text-[0.6rem] text-[#b0a494] relative z-[1] tabular-nums shrink-0 font-semibold">
          {category.videoCount.toLocaleString()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 rounded hover:bg-[#ede6da] transition-colors relative z-[1] shrink-0 cursor-pointer ml-0.5"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            className={`w-3 h-3 text-[#b0a494] transition-transform duration-200 ${
              expanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-5 pl-3 border-l border-[#e0d6c8] space-y-px py-1">
          {visibleSubs.map((sub) => {
            const subPath = `/${category.id}/${sub.id}/`;
            const isActive = currentPath === `/${category.id}/${sub.id}` || currentPath === subPath;

            return (
              <Link
                key={sub.id}
                href={subPath}
                className={`flex items-center justify-between px-2.5 py-[5px] text-[0.78rem] rounded
                           transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8b5a3c]/10 text-[#8b5a3c] font-semibold'
                    : 'text-[#8b7d6f] hover:text-[#5a4f47] hover:bg-[#f0e9de]'
                }`}
              >
                <span className="truncate leading-snug">{sub.name === 'General' ? 'Other Videos' : sub.name}</span>
                <span className={`text-[0.6rem] tabular-nums ml-2 ${
                  isActive ? 'text-[#8b5a3c]/60' : 'text-[#c4b9aa]'
                }`}>
                  {sub.videoCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
