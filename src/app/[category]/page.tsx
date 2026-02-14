'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CategoriesData, Category } from '@/lib/types';

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
        <h1 className="font-heading text-2xl text-brand-300 mb-4">Category Not Found</h1>
        <Link href="/" className="text-brand-400 hover:text-brand-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);

  return (
    <div>
      <Breadcrumbs items={[{ label: category.name }]} />

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-300">
            {category.name}
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            {category.videoCount} videos across {visibleSubs.length} subcategories
          </p>
        </div>
      </div>

      {/* Subcategory cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSubs.map((sub) => (
          <Link
            key={sub.id}
            href={`/${sub.slug}/`}
            className="group block p-5 bg-brand-800/50 border border-brand-700 rounded-lg
                       hover:border-brand-500 hover:bg-brand-800 transition-all"
          >
            <h2 className="font-heading text-lg font-medium text-brand-200 group-hover:text-brand-300 transition-colors mb-2">
              {sub.name}
            </h2>
            <p className="text-sm text-brand-500">
              {sub.videoCount} videos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
