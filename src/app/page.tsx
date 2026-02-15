'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { Footer } from '@/components/layout/Footer';
import { CHANNEL_URL } from '@/lib/constants';
import { getCategoryTheme } from '@/lib/categoryThemes';
import type { CategoriesData, CompactVideo, StatsData } from '@/lib/types';

export default function HomePage() {
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [recentVideos, setRecentVideos] = useState<CompactVideo[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    Promise.all([
      fetch(`${basePath}/data/processed/categories.json`).then((r) => r.json()),
      fetch(`${basePath}/data/processed/recent.json`)
        .then((r) => r.json())
        .then((d) => d.videos),
      fetch(`${basePath}/data/processed/stats.json`).then((r) => r.json()),
    ])
      .then(([cats, recent, s]) => {
        setCategories(cats);
        setRecentVideos(recent);
        setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const visibleCategories = categories?.categories.filter((c) => c.videoCount > 0) || [];
  const totalSubsections = visibleCategories.reduce(
    (sum, c) => sum + c.subcategories.filter((s) => s.videoCount > 0).length,
    0
  );

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section - Spiritual themed */}
      <section
        className="relative overflow-hidden rounded-xl mb-10"
        style={{
          background:
            'linear-gradient(135deg, #3d2914 0%, #5c3d1e 20%, #8b5a3c 45%, #a06b4a 65%, #c17d4f 85%, #d4a574 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
          <DecorativeMotif type="om" color="#fef3c7" />
        </div>
        <div className="absolute -left-8 -bottom-8 w-36 h-36 opacity-[0.06] rotate-12">
          <DecorativeMotif type="lotus" color="#fef3c7" />
        </div>
        <div className="absolute left-1/3 -top-6 w-20 h-20 opacity-[0.05]">
          <DecorativeMotif type="mandala" color="#fef3c7" />
        </div>

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
          <div className="w-16 h-0.5 bg-amber-200/50 mb-6" />
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-amber-50 leading-[1.15] mb-4">
            Sivananda Sastry
          </h2>
          <p className="text-lg md:text-xl text-amber-100/90 font-heading mb-3">
            Sacred Teachings &amp; Spiritual Wisdom
          </p>
          <p className="text-sm md:text-base text-amber-100/70 leading-relaxed max-w-2xl mb-8">
            A comprehensive digital archive of profound discourses on Vedic scriptures,
            sacred epics, devotional songs, and timeless wisdom from ancient Indian
            spiritual traditions — available in English and Telugu.
          </p>

          {/* Quick stats row in hero */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { value: categories?.totalVideos.toLocaleString() || '0', label: 'Videos' },
              { value: visibleCategories.length.toString(), label: 'Categories' },
              { value: totalSubsections.toString(), label: 'Sections' },
              {
                value: stats ? `${Math.round((stats.languageCounts.english / stats.totalVideos) * 100)}%` : '--',
                label: 'English',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
              >
                <span className="font-heading text-xl font-bold text-amber-100">{stat.value}</span>
                <span className="text-xs text-amber-200/70 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/15 text-amber-50
                       rounded-full text-sm font-semibold
                       border border-white/20 backdrop-blur-sm
                       hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-elevated
                       transition-all duration-300"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Visit YouTube Channel
          </a>
        </div>
      </section>

      {/* Category Cards - Full-width immersive */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-10 h-0.5 bg-accent-primary" />
          <h2 className="font-heading text-2xl font-semibold text-accent-primary">
            Browse by Topic
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleCategories.map((cat) => {
            const theme = getCategoryTheme(cat.id);
            const visibleSubCount = cat.subcategories.filter((s) => s.videoCount > 0).length;
            // Show top 3 subcategories (exclude General/Other Videos)
            const topSubs = cat.subcategories
              .filter((s) => s.videoCount > 0 && s.id !== 'general')
              .sort((a, b) => b.videoCount - a.videoCount)
              .slice(0, 3);

            return (
              <Link
                key={cat.id}
                href={`/${cat.id}/`}
                className="group relative block overflow-hidden rounded-xl
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                {/* Gradient background */}
                <div className="absolute inset-0" style={{ background: theme.gradient }} />

                {/* Decorative motif */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 opacity-15 group-hover:opacity-25 transition-opacity">
                  <DecorativeMotif type={theme.motif} color={theme.textColor} />
                </div>

                {/* Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                <div className="relative z-10 p-6 md:p-7">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl drop-shadow-sm">{cat.icon}</span>
                    <h3
                      className="font-heading text-xl md:text-2xl font-bold drop-shadow-sm"
                      style={{ color: theme.textColor }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                  <p
                    className="text-xs mt-1 max-w-md leading-relaxed opacity-70"
                    style={{ color: theme.textColor }}
                  >
                    {theme.description}
                  </p>

                  {/* Top subcategories preview */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {topSubs.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-semibold"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          color: theme.textColor,
                        }}
                      >
                        {sub.name === 'General' ? 'Others' : sub.name}
                        <span className="ml-1.5 opacity-60">{sub.videoCount}</span>
                      </span>
                    ))}
                    {visibleSubCount > 3 && (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-semibold opacity-60"
                        style={{ color: theme.textColor }}
                      >
                        +{visibleSubCount - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: theme.textColor }}
                    >
                      {cat.videoCount.toLocaleString()} videos
                    </span>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: theme.textColor }}
                    >
                      {visibleSubCount} sections
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      style={{ color: theme.textColor }}
                    >
                      Explore
                      <svg
                        className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
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

      {/* Language & Stats Section */}
      {stats && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-10 h-0.5 bg-accent-primary" />
            <h2 className="font-heading text-2xl font-semibold text-accent-primary">
              Collection Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Videos */}
            <div className="relative overflow-hidden bg-bg-tertiary p-6 border border-border-light rounded-xl text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light group">
              <div className="absolute -right-3 -top-3 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <DecorativeMotif type="mandala" color="#8b5a3c" />
              </div>
              <svg className="w-8 h-8 mx-auto mb-3 text-accent-primary opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="block font-heading text-[2.25rem] font-bold text-accent-primary mb-0.5">
                {stats.totalVideos.toLocaleString()}
              </span>
              <span className="text-[0.7rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
                Total Videos
              </span>
            </div>

            {/* English */}
            <div className="relative overflow-hidden bg-bg-tertiary p-6 border border-border-light rounded-xl text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-blue-300 group">
              <div className="absolute -right-3 -top-3 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <DecorativeMotif type="wheel" color="#3b82f6" />
              </div>
              <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">EN</span>
              </div>
              <span className="block font-heading text-[2.25rem] font-bold text-blue-600 mb-0.5">
                {stats.languageCounts.english.toLocaleString()}
              </span>
              <span className="text-[0.7rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
                English
              </span>
              <div className="mt-2">
                <div className="h-1 bg-blue-100 rounded-full overflow-hidden mx-auto max-w-[80px]">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.round((stats.languageCounts.english / stats.totalVideos) * 100)}%` }}
                  />
                </div>
                <span className="text-[0.65rem] text-text-tertiary mt-1 block">
                  {Math.round((stats.languageCounts.english / stats.totalVideos) * 100)}%
                </span>
              </div>
            </div>

            {/* Telugu */}
            <div className="relative overflow-hidden bg-bg-tertiary p-6 border border-border-light rounded-xl text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-emerald-300 group">
              <div className="absolute -right-3 -top-3 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <DecorativeMotif type="lotus" color="#059669" />
              </div>
              <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-600">TE</span>
              </div>
              <span className="block font-heading text-[2.25rem] font-bold text-emerald-600 mb-0.5">
                {stats.languageCounts.telugu.toLocaleString()}
              </span>
              <span className="text-[0.7rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
                Telugu
              </span>
              <div className="mt-2">
                <div className="h-1 bg-emerald-100 rounded-full overflow-hidden mx-auto max-w-[80px]">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.round((stats.languageCounts.telugu / stats.totalVideos) * 100)}%` }}
                  />
                </div>
                <span className="text-[0.65rem] text-text-tertiary mt-1 block">
                  {Math.round((stats.languageCounts.telugu / stats.totalVideos) * 100)}%
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="relative overflow-hidden bg-bg-tertiary p-6 border border-border-light rounded-xl text-center
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-accent-light group">
              <div className="absolute -right-3 -top-3 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <DecorativeMotif type="om" color="#8b5a3c" />
              </div>
              <svg className="w-8 h-8 mx-auto mb-3 text-accent-primary opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="block font-heading text-[2.25rem] font-bold text-accent-primary mb-0.5">
                {totalSubsections}
              </span>
              <span className="text-[0.7rem] text-text-tertiary uppercase tracking-[2px] font-semibold">
                Sub-sections
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Category Breakdown - Horizontal bars */}
      {visibleCategories.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-10 h-0.5 bg-accent-primary" />
            <h2 className="font-heading text-2xl font-semibold text-accent-primary">
              Videos by Category
            </h2>
          </div>
          <div className="bg-bg-tertiary border border-border-light rounded-xl p-6">
            <div className="space-y-4">
              {visibleCategories
                .sort((a, b) => b.videoCount - a.videoCount)
                .map((cat) => {
                  const theme = getCategoryTheme(cat.id);
                  const pct = Math.round((cat.videoCount / (categories?.totalVideos || 1)) * 100);
                  return (
                    <Link
                      key={cat.id}
                      href={`/${cat.id}/`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-tertiary">
                            {cat.videoCount.toLocaleString()} videos
                          </span>
                          <span className="text-xs font-bold text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-full">
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{
                            width: `${pct}%`,
                            background: theme.gradient,
                          }}
                        />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-10 h-0.5 bg-accent-primary" />
            <h2 className="font-heading text-2xl font-semibold text-accent-primary">
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
