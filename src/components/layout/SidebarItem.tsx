'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface SidebarItemProps {
  category: Category;
  currentPath: string;
}

export function SidebarItem({ category, currentPath }: SidebarItemProps) {
  // Filter out subcategories with zero videos
  const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);

  // Auto-expand if current path is in this category
  const isInCategory = currentPath.startsWith(`/${category.id}`);
  const [expanded, setExpanded] = useState(isInCategory);

  useEffect(() => {
    if (isInCategory) setExpanded(true);
  }, [isInCategory]);

  return (
    <div>
      {/* Category header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full sidebar-link flex items-center gap-2 group ${
          isInCategory && !currentPath.includes('/') ? 'sidebar-link-active' : ''
        }`}
      >
        <span className="text-base shrink-0">{category.icon}</span>
        <span className="flex-1 text-left truncate">{category.name}</span>
        <span className="text-xs text-brand-500 tabular-nums">
          {category.videoCount}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-brand-500 transition-transform duration-200 ${
            expanded ? 'rotate-90' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Subcategories */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-5 pl-3 border-l border-brand-800 space-y-0.5 py-1">
          {/* "All in category" link */}
          {visibleSubs.length > 1 && (
            <Link
              href={`/${category.id}/`}
              className={`sidebar-link text-xs ${
                currentPath === `/${category.id}` || currentPath === `/${category.id}/`
                  ? 'sidebar-link-active'
                  : ''
              }`}
            >
              All {category.name}
            </Link>
          )}

          {visibleSubs.map((sub) => {
            const subPath = `/${sub.slug}/`;
            const isActive =
              currentPath === `/${sub.slug}` || currentPath === subPath;

            return (
              <Link
                key={sub.id}
                href={subPath}
                className={`sidebar-link text-xs flex items-center justify-between ${
                  isActive ? 'sidebar-link-active' : ''
                }`}
              >
                <span className="truncate">{sub.name}</span>
                <span className="text-brand-600 tabular-nums text-[11px] ml-1">
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
