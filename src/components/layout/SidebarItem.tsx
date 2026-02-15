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
          className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
        >
          <span className="text-lg shrink-0">{category.icon}</span>
          <span className="font-heading text-[1.05rem] font-medium text-[#d4c4aa] relative z-[1] truncate">
            {category.name}
          </span>
        </button>
        <span className="text-[0.65rem] text-[#9a8b78] bg-[#3d3228] px-2 py-0.5 rounded-full relative z-[1] tabular-nums shrink-0 font-semibold">
          {category.videoCount.toLocaleString()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 rounded-md hover:bg-[#3d3228] transition-colors relative z-[1] shrink-0 cursor-pointer"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            className={`w-3.5 h-3.5 text-[#9a8b78] transition-transform duration-200 ${
              expanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-9 pl-4 border-l border-[#3d3228] space-y-0.5 py-1">
          {visibleSubs.map((sub) => {
            const subPath = `/${category.id}/${sub.id}/`;
            const isActive = currentPath === `/${category.id}/${sub.id}` || currentPath === subPath;

            return (
              <Link
                key={sub.id}
                href={subPath}
                className={`flex items-center justify-between px-3 py-1.5 text-[0.85rem] rounded-md
                           transition-colors ${
                  isActive
                    ? 'bg-[#c9a96e]/15 text-[#c9a96e] font-medium'
                    : 'text-[#9a8b78] hover:bg-[#3d3228]/60 hover:text-[#d4c4aa]'
                }`}
              >
                <span className="truncate">{sub.name === 'General' ? 'Other Videos' : sub.name}</span>
                <span className="text-[0.65rem] text-[#7a6d5e] tabular-nums ml-2">
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
