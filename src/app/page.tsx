'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Footer } from '@/components/layout/Footer';
import { SITE_DESCRIPTION, CHANNEL_URL } from '@/lib/constants';
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
      {/* About Section */}
      <section className="max-w-3xl mb-12">
        <div className="ornament mb-8" />
        <h2 className="font-heading text-[2.75rem] font-semibold text-accent-primary mb-5 leading-[1.2]">
          About Sivananda Sastry
        </h2>
        <p className="text-[1.05rem] leading-[1.8] text-text-secondary mb-4">
          Welcome to the comprehensive digital archive of Sivananda Sastry&apos;s spiritual
          teachings. This collection encompasses profound discourses on Vedic scriptures,
          sacred hymns, devotional songs, and timeless wisdom from ancient Indian spiritual
          traditions.
        </p>
        <p className="text-[1.05rem] leading-[1.8] text-text-secondary mb-4">
          {SITE_DESCRIPTION}
        </p>
        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          Each video is a gateway to deeper understanding and spiritual growth, offering
          insights into the rich heritage of Hindu philosophy, mythology, and devotional
          practices.
        </p>

        {/* Stats */}
        {categories && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-bg-tertiary p-6 border border-border-light rounded text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light">
              <span className="block font-heading text-[2.5rem] font-bold text-accent-primary mb-1">
                {categories.totalVideos.toLocaleString()}
              </span>
              <span className="text-[0.85rem] text-text-tertiary uppercase tracking-[1.5px]">
                Total Videos
              </span>
            </div>
            <div className="bg-bg-tertiary p-6 border border-border-light rounded text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light">
              <span className="block font-heading text-[2.5rem] font-bold text-accent-primary mb-1">
                {visibleCategories.length}
              </span>
              <span className="text-[0.85rem] text-text-tertiary uppercase tracking-[1.5px]">
                Categories
              </span>
            </div>
            <div className="bg-bg-tertiary p-6 border border-border-light rounded text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light">
              <span className="block font-heading text-[2.5rem] font-bold text-accent-primary mb-1">
                {visibleCategories.reduce((sum, c) => sum + c.subcategories.filter(s => s.videoCount > 0).length, 0)}
              </span>
              <span className="text-[0.85rem] text-text-tertiary uppercase tracking-[1.5px]">
                Sub-sections
              </span>
            </div>
          </div>
        )}

        <div className="mt-8">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-accent-primary text-white rounded
                       text-sm font-semibold uppercase tracking-wide
                       hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-card
                       transition-all duration-300"
          >
            Visit YouTube Channel
          </a>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="mb-12">
        <h2 className="font-heading text-[2.25rem] font-semibold text-accent-primary mb-6 pb-4 border-b border-border-medium">
          Browse by Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.id}/`}
              className="group flex items-start gap-4 p-5 bg-bg-tertiary border border-border-light rounded
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light"
            >
              <span className="text-3xl shrink-0">{cat.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-[1.15rem] font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-[0.85rem] text-text-tertiary">
                  {cat.videoCount.toLocaleString()} videos &middot;{' '}
                  {cat.subcategories.filter((s) => s.videoCount > 0).length} sections
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-[2.25rem] font-semibold text-accent-primary mb-6 pb-4 border-b border-border-medium">
            Recently Added
          </h2>
          <VideoGrid videos={recentVideos.slice(0, 12)} />
        </section>
      )}

      <Footer />
    </div>
  );
}
