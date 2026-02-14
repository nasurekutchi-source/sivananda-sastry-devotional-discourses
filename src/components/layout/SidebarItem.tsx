'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface SidebarItemProps {
  category: Category;
  currentPath: string;
}

export function SidebarItem({ category, currentPath }: SidebarItemProps) {
  const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);
  const isInCategory = currentPath.startsWith(`/${category.id}`);
  const [expanded, setExpanded] = useState(isInCategory);

  useEffect(() => {
    if (isInCategory) setExpanded(true);
  }, [isInCategory]);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`nav-item w-full ${isInCategory ? 'nav-item-active' : ''}`}
      >
        <span className="text-lg shrink-0">{category.icon}</span>
        <span className="font-heading text-[1.05rem] font-medium text-text-primary flex-1 text-left relative z-[1]">
          {category.name}
        </span>
        <span className="text-[0.7rem] text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-xl relative z-[1] tabular-nums">
          {category.videoCount.toLocaleString()}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 relative z-[1] ${
            expanded ? 'rotate-90' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-9 pl-4 border-l border-border-light space-y-0.5 py-1">
          {visibleSubs.length > 1 && (
            <Link
              href={`/${category.id}/`}
              className={`block px-3 py-1.5 text-[0.85rem] text-text-secondary rounded-md
                         hover:bg-accent-light/40 hover:text-accent-primary transition-colors ${
                currentPath === `/${category.id}` || currentPath === `/${category.id}/`
                  ? 'bg-accent-light/40 text-accent-primary font-medium'
                  : ''
              }`}
            >
              All {category.name}
            </Link>
          )}

          {visibleSubs.map((sub) => {
            const subPath = `/${sub.slug}/`;
            const isActive = currentPath === `/${sub.slug}` || currentPath === subPath;

            return (
              <Link
                key={sub.id}
                href={subPath}
                className={`flex items-center justify-between px-3 py-1.5 text-[0.85rem] rounded-md
                           transition-colors ${
                  isActive
                    ? 'bg-accent-light/40 text-accent-primary font-medium'
                    : 'text-text-secondary hover:bg-accent-light/30 hover:text-accent-primary'
                }`}
              >
                <span className="truncate">{sub.name}</span>
                <span className="text-[0.7rem] text-text-tertiary tabular-nums ml-2">
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
