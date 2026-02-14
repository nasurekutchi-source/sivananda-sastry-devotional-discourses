'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, CHANNEL_URL } from '@/lib/constants';
import type { CategoriesData, CompactVideo } from '@/lib/types';

export default function HomePage() {
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [recentVideos, setRecentVideos] = useState<CompactVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    Promise.all([
      fetch(`${basePath}/data/processed/categories.json`).then((r) => r.json()),
      fetch(`${basePath}/data/processed/recent.json`)
        .then((r) => r.json())
        .then((d) => d.videos),
    ])
      .then(([cats, recent]) => {
        setCategories(cats);
        setRecentVideos(recent);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const visibleCategories = categories?.categories.filter((c) => c.videoCount > 0) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-brand-300 to-transparent mx-auto mb-6" />
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gradient mb-3">
          {SITE_NAME}
        </h1>
        <p className="text-brand-400 text-lg tracking-widest uppercase mb-6">
          {SITE_TAGLINE}
        </p>
        <p className="max-w-2xl mx-auto text-brand-400 leading-relaxed mb-8">
          {SITE_DESCRIPTION}
        </p>

        {/* Stats */}
        {categories && (
          <div className="flex justify-center gap-8 sm:gap-12 flex-wrap">
            <div className="text-center">
              <span className="block font-heading text-3xl font-bold text-brand-300">
                {categories.totalVideos.toLocaleString()}
              </span>
              <span className="text-xs text-brand-500 uppercase tracking-widest">Videos</span>
            </div>
            <div className="text-center">
              <span className="block font-heading text-3xl font-bold text-brand-300">
                {visibleCategories.length}
              </span>
              <span className="text-xs text-brand-500 uppercase tracking-widest">Categories</span>
            </div>
            <div className="text-center">
              <span className="block font-heading text-3xl font-bold text-brand-300">
                {categories.languageCounts.english + categories.languageCounts.telugu > 0
                  ? '2'
                  : '1'}
              </span>
              <span className="text-xs text-brand-500 uppercase tracking-widest">Languages</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Visit YouTube Channel
          </a>
        </div>
      </section>

      {/* Category Grid */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-brand-300 mb-6">
          Browse by Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.id}/`}
              className="group flex items-start gap-4 p-4 bg-brand-800/50 border border-brand-700
                         rounded-lg hover:border-brand-500 hover:bg-brand-800 transition-all"
            >
              <span className="text-2xl shrink-0 mt-0.5">{cat.icon}</span>
              <div className="min-w-0">
                <h3 className="font-heading text-base font-medium text-brand-200 group-hover:text-brand-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-brand-500 mt-1">
                  {cat.videoCount} videos &middot;{' '}
                  {cat.subcategories.filter((s) => s.videoCount > 0).length} subcategories
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-semibold text-brand-300 mb-6">
            Recently Added
          </h2>
          <VideoGrid videos={recentVideos.slice(0, 12)} />
        </section>
      )}
    </div>
  );
}
