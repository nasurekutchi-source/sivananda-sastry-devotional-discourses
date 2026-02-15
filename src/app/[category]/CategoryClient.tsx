'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { getCategoryTheme } from '@/lib/categoryThemes';
import type { CategoriesData } from '@/lib/types';

export default function CategoryClient() {
  const params = useParams();
  const categoryId = params.category as string;

  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/processed/categories.json`)
      .then((r) => r.json())
      .then(setCategoriesData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const category = categoriesData?.categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="text-center py-16">
        <h1 className="font-heading text-2xl text-accent-primary mb-4">Category Not Found</h1>
        <Link href="/" className="text-accent-secondary hover:text-accent-primary transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const theme = getCategoryTheme(categoryId);
  const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);

  return (
    <div className="animate-fade-in-up">
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-lg mb-10"
        style={{ background: theme.gradient }}
      >
        {/* Decorative motif (positioned right) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 opacity-30">
          <DecorativeMotif type={theme.motif} color={theme.textColor} />
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl md:text-5xl drop-shadow-sm">{category.icon}</span>
            <h1
              className="font-heading text-3xl md:text-[2.75rem] font-bold drop-shadow-sm"
              style={{ color: theme.textColor }}
            >
              {category.name}
            </h1>
          </div>
          <p
            className="text-base md:text-lg max-w-2xl leading-relaxed mt-2 opacity-90"
            style={{ color: theme.textColor }}
          >
            {theme.description}
          </p>
          <div className="flex items-center gap-6 mt-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: theme.textColor,
                backdropFilter: 'blur(4px)',
              }}
            >
              {category.videoCount.toLocaleString()} videos
            </span>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: theme.textColor,
                backdropFilter: 'blur(4px)',
              }}
            >
              {visibleSubs.length} sections
            </span>
          </div>
        </div>
      </div>

      {/* Subcategory Cards */}
      <h2 className="font-heading text-xl text-text-primary font-semibold mb-5">
        Browse Sections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleSubs.map((sub) => (
          <Link
            key={sub.id}
            href={`/${categoryId}/${sub.id}/`}
            className="group relative block overflow-hidden rounded-lg border border-border-light
                       transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated hover:border-accent-light"
          >
            {/* Themed gradient top bar */}
            <div className="h-1.5" style={{ background: theme.gradient }} />

            <div className="p-6 bg-bg-tertiary">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-[1.15rem] font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                  {sub.name === 'General' ? 'Other Videos' : sub.name}
                </h3>
                <span className="text-xs font-bold text-text-tertiary bg-bg-secondary px-2.5 py-1 rounded-full">
                  {sub.videoCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-sm text-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore videos</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
