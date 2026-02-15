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
          <span className="text-[1.1rem] shrink-0 opacity-80">{category.icon}</span>
          <span className="font-body text-[0.88rem] font-semibold text-[#c4b59e] relative z-[1] truncate tracking-wide">
            {category.name}
          </span>
        </button>
        <span className="text-[0.6rem] text-[#8a7b68] relative z-[1] tabular-nums shrink-0 font-bold tracking-wider">
          {category.videoCount.toLocaleString()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1.5 rounded hover:bg-[#352a20] transition-colors relative z-[1] shrink-0 cursor-pointer ml-1"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            className={`w-3 h-3 text-[#7a6d5e] transition-transform duration-200 ${
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
        <div className="ml-10 pl-3.5 border-l border-[#3a2f24] space-y-px py-1.5">
          {visibleSubs.map((sub) => {
            const subPath = `/${category.id}/${sub.id}/`;
            const isActive = currentPath === `/${category.id}/${sub.id}` || currentPath === subPath;

            return (
              <Link
                key={sub.id}
                href={subPath}
                className={`flex items-center justify-between px-3 py-[5px] text-[0.8rem] rounded
                           transition-all duration-200 ${
                  isActive
                    ? 'bg-[#b8976a]/12 text-[#b8976a] font-semibold'
                    : 'text-[#8a7b68] hover:text-[#c4b59e] hover:bg-[#2a2118]/80'
                }`}
              >
                <span className="truncate leading-snug">{sub.name === 'General' ? 'Other Videos' : sub.name}</span>
                <span className={`text-[0.6rem] tabular-nums ml-2 font-semibold ${
                  isActive ? 'text-[#b8976a]/60' : 'text-[#5e5347]'
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
