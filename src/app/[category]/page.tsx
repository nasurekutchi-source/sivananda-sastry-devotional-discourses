'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CategoriesData } from '@/lib/types';

export default function CategoryPage() {
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

  const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);

  return (
    <div>
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-medium">
        <span className="text-[3rem] text-accent-primary">{category.icon}</span>
        <div>
          <h1 className="font-heading text-[2.25rem] font-semibold text-accent-primary mb-1">
            {category.name}
          </h1>
          <p className="text-[0.95rem] text-text-tertiary">
            {category.videoCount.toLocaleString()} videos available
          </p>
        </div>
      </div>

      {/* Subcategory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleSubs.map((sub) => (
          <Link
            key={sub.id}
            href={`/${sub.slug}/`}
            className="group block p-6 bg-bg-tertiary border border-border-light rounded
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light"
          >
            <h2 className="font-heading text-[1.2rem] font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-2">
              {sub.name}
            </h2>
            <p className="text-[0.9rem] text-text-tertiary">
              {sub.videoCount} videos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
