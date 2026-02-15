'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { Footer } from '@/components/layout/Footer';
import { SITE_DESCRIPTION, CHANNEL_URL } from '@/lib/constants';
import { getCategoryTheme } from '@/lib/categoryThemes';
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
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg mb-12" style={{
        background: 'linear-gradient(135deg, #8b5a3c 0%, #a06b4a 25%, #c17d4f 50%, #d4a574 75%, #e5d4c1 100%)',
      }}>
        {/* Decorative Om symbol */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 opacity-15">
          <DecorativeMotif type="om" color="#fef3c7" />
        </div>
        {/* Lotus on left (subtle) */}
        <div className="absolute -left-8 -bottom-8 w-40 h-40 opacity-10 rotate-12">
          <DecorativeMotif type="lotus" color="#fef3c7" />
        </div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 max-w-3xl">
          <div className="w-16 h-0.5 bg-amber-200/60 mb-6" />
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-amber-50 leading-[1.15] mb-5">
            About Sivananda Sastry
          </h2>
          <p className="text-base md:text-lg text-amber-100/90 leading-relaxed mb-4">
            Welcome to the comprehensive digital archive of Sivananda Sastry&apos;s spiritual
            teachings. This collection encompasses profound discourses on Vedic scriptures,
            sacred hymns, devotional songs, and timeless wisdom from ancient Indian spiritual
            traditions.
          </p>
          <p className="text-base md:text-lg text-amber-100/80 leading-relaxed mb-3">
            {SITE_DESCRIPTION}
          </p>
          <p className="text-sm text-amber-200/70 leading-relaxed">
            Each video is a gateway to deeper understanding and spiritual growth, offering
            insights into the rich heritage of Hindu philosophy, mythology, and devotional
            practices.
          </p>

          <div className="mt-8">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/15 text-amber-50
                         rounded-full text-sm font-semibold uppercase tracking-wider
                         border border-white/20 backdrop-blur-sm
                         hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-elevated
                         transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      {categories && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="relative overflow-hidden bg-bg-tertiary p-7 border border-border-light rounded-lg text-center
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light group">
            <div className="absolute -right-4 -top-4 w-20 h-20 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
              <DecorativeMotif type="mandala" color="#8b5a3c" />
            </div>
            <span className="block font-heading text-[2.75rem] font-bold text-accent-primary mb-1">
              {categories.totalVideos.toLocaleString()}
            </span>
            <span className="text-[0.8rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
              Total Videos
            </span>
          </div>
          <div className="relative overflow-hidden bg-bg-tertiary p-7 border border-border-light rounded-lg text-center
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light group">
            <div className="absolute -right-4 -top-4 w-20 h-20 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
              <DecorativeMotif type="lotus" color="#8b5a3c" />
            </div>
            <span className="block font-heading text-[2.75rem] font-bold text-accent-primary mb-1">
              {visibleCategories.length}
            </span>
            <span className="text-[0.8rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
              Categories
            </span>
          </div>
          <div className="relative overflow-hidden bg-bg-tertiary p-7 border border-border-light rounded-lg text-center
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light group">
            <div className="absolute -right-4 -top-4 w-20 h-20 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
              <DecorativeMotif type="wheel" color="#8b5a3c" />
            </div>
            <span className="block font-heading text-[2.75rem] font-bold text-accent-primary mb-1">
              {visibleCategories.reduce((sum, c) => sum + c.subcategories.filter(s => s.videoCount > 0).length, 0)}
            </span>
            <span className="text-[0.8rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
              Sub-sections
            </span>
          </div>
        </section>
      )}

      {/* Browse Categories - Premium Cards */}
      <section className="mb-14">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-0.5 bg-accent-primary" />
          <h2 className="font-heading text-[2rem] font-semibold text-accent-primary">
            Browse by Topic
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleCategories.map((cat) => {
            const theme = getCategoryTheme(cat.id);
            const visibleSubCount = cat.subcategories.filter((s) => s.videoCount > 0).length;
            return (
              <Link
                key={cat.id}
                href={`/${cat.id}/`}
                className="group relative block overflow-hidden rounded-lg
                           transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
              >
                {/* Gradient background */}
                <div className="absolute inset-0" style={{ background: theme.gradient }} />

                {/* Decorative motif */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 opacity-20 group-hover:opacity-30 transition-opacity">
                  <DecorativeMotif type={theme.motif} color={theme.textColor} />
                </div>

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl drop-shadow-sm">{cat.icon}</span>
                    <h3
                      className="font-heading text-xl md:text-2xl font-bold drop-shadow-sm"
                      style={{ color: theme.textColor }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                  <p
                    className="text-sm mt-1 max-w-md leading-relaxed opacity-80"
                    style={{ color: theme.textColor }}
                  >
                    {theme.description.split('—')[0].trim()}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        color: theme.textColor,
                      }}
                    >
                      {cat.videoCount.toLocaleString()} videos
                    </span>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        color: theme.textColor,
                      }}
                    >
                      {visibleSubCount} sections
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      style={{ color: theme.textColor }}
                    >
                      Explore
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-0.5 bg-accent-primary" />
            <h2 className="font-heading text-[2rem] font-semibold text-accent-primary">
              Recently Added
            </h2>
          </div>
          <VideoGrid videos={recentVideos.slice(0, 12)} />
        </section>
      )}

      <Footer />
    </div>
  );
}
