'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { getCategoryTheme } from '@/lib/categoryThemes';
import type { CategoriesData, CompactVideo } from '@/lib/types';

export default function CategoryClient() {
  const params = useParams();
  const categoryId = params.category as string;

  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(null);
  const [previewVideos, setPreviewVideos] = useState<Record<string, CompactVideo[]>>({});
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/processed/categories.json`)
      .then((r) => r.json())
      .then(setCategoriesData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load preview thumbnails for top subcategories (first 3 videos each)
  useEffect(() => {
    if (!categoriesData) return;
    const category = categoriesData.categories.find((c) => c.id === categoryId);
    if (!category) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const visibleSubs = category.subcategories.filter((s) => s.videoCount > 0);
    const topSubs = visibleSubs.slice(0, 12); // Load previews for top 12

    Promise.all(
      topSubs.map((sub) =>
        fetch(`${basePath}/data/processed/videos-by-category/${categoryId}/${sub.id}.json`)
          .then((r) => r.json())
          .then((d) => ({ id: sub.id, videos: (d.videos as CompactVideo[]).slice(0, 3) }))
          .catch(() => ({ id: sub.id, videos: [] as CompactVideo[] }))
      )
    ).then((results) => {
      const map: Record<string, CompactVideo[]> = {};
      for (const r of results) map[r.id] = r.videos;
      setPreviewVideos(map);
    });
  }, [categoriesData, categoryId]);

  const category = categoriesData?.categories.find((c) => c.id === categoryId);
  const theme = getCategoryTheme(categoryId);

  const { visibleSubs, langStats, totalEnglish, totalTelugu } = useMemo(() => {
    if (!category) return { visibleSubs: [], langStats: {}, totalEnglish: 0, totalTelugu: 0 };
    const subs = category.subcategories.filter((s) => s.videoCount > 0);
    // Aggregate language info from loaded previews
    let en = 0, te = 0;
    for (const videos of Object.values(previewVideos)) {
      for (const v of videos) {
        if (v.l === 'en') en++;
        else if (v.l === 'te') te++;
      }
    }
    return { visibleSubs: subs, langStats: {}, totalEnglish: en, totalTelugu: te };
  }, [category, previewVideos]);

  if (loading) return <LoadingSpinner />;

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

  // Sort subcategories: largest first, but "General" (Other Videos) always at bottom
  const sortedSubs = [...visibleSubs]
    .filter((s) => {
      if (!nameFilter.trim()) return true;
      const display = s.name === 'General' ? 'Other Videos' : s.name;
      return display.toLowerCase().includes(nameFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (a.id === 'general') return 1;
      if (b.id === 'general') return -1;
      return b.videoCount - a.videoCount;
    });
  const maxCount = sortedSubs[0]?.videoCount || 1;

  return (
    <div className="animate-fade-in-up">
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-xl mb-10"
        style={{ background: theme.gradient }}
      >
        {/* Decorative motif */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 opacity-20">
          <DecorativeMotif type={theme.motif} color={theme.textColor} />
        </div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl md:text-5xl drop-shadow-sm">{category.icon}</span>
            <div>
              <h1
                className="font-heading text-3xl md:text-[2.75rem] font-bold drop-shadow-sm leading-tight"
                style={{ color: theme.textColor }}
              >
                {category.name}
              </h1>
              <p
                className="text-sm mt-1 opacity-70"
                style={{ color: theme.textColor }}
              >
                {theme.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {category.videoCount.toLocaleString()} videos
            </span>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {visibleSubs.length} sections
            </span>
          </div>

          {/* Horizontal Journey Milestone */}
          <div className="mt-6 flex items-center gap-0 max-w-xl">
            {(() => {
              const start = new Date(theme.journeyStarted + 'T00:00:00');
              const now = new Date();
              const milestones: { label: string; isEnd?: boolean }[] = [];
              milestones.push({ label: start.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) });
              let yr = start.getFullYear() + 3;
              while (yr < now.getFullYear()) {
                milestones.push({ label: yr.toString() });
                yr += 3;
              }
              milestones.push({ label: 'Present', isEnd: true });
              return milestones.map((m, i) => (
                <div key={i} className="flex items-center" style={{ flex: i < milestones.length - 1 ? 1 : undefined }}>
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-3 h-3 rounded-full border-2"
                      style={{
                        borderColor: theme.textColor,
                        background: m.isEnd ? theme.accentColor : 'rgba(255,255,255,0.25)',
                      }}
                    />
                    <span className="text-[0.6rem] mt-1 font-semibold whitespace-nowrap" style={{ color: theme.textColor, opacity: m.isEnd ? 1 : 0.7 }}>
                      {m.label}
                    </span>
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="flex-1 h-px min-w-[24px] mx-1" style={{ background: `linear-gradient(90deg, ${theme.textColor}40, ${theme.accentColor})` }} />
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Content area with sidebar */}
      <div className="flex gap-8">
        {/* Main - Subcategory cards */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-text-primary font-semibold">
              Browse Sections
            </h2>
            <span className="text-xs text-text-tertiary">
              {visibleSubs.length} sections &middot; {category.videoCount.toLocaleString()} videos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedSubs.map((sub) => {
              const previews = previewVideos[sub.id] || [];
              const barWidth = Math.max(8, (sub.videoCount / maxCount) * 100);
              const displayName = sub.name === 'General' ? 'Other Videos' : sub.name;

              return (
                <Link
                  key={sub.id}
                  href={`/${categoryId}/${sub.id}/`}
                  className="group relative block overflow-hidden rounded-xl border border-border-light bg-bg-tertiary
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-accent-light"
                >
                  {/* Thumbnail strip - shows 3 preview thumbnails */}
                  {previews.length > 0 && (
                    <div className="flex h-[72px] overflow-hidden">
                      {previews.map((v, i) => (
                        <div
                          key={v.id}
                          className="flex-1 relative overflow-hidden"
                          style={{ borderRight: i < previews.length - 1 ? '1px solid rgba(0,0,0,0.1)' : undefined }}
                        >
                          <img
                            src={v.th || `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      ))}
                      {/* Gradient overlay on thumbnails */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-tertiary" />
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-[1.05rem] font-semibold text-text-primary leading-snug group-hover:text-accent-primary transition-colors">
                        {displayName}
                      </h3>
                      <span className="shrink-0 text-xs font-bold text-text-tertiary bg-bg-secondary px-2.5 py-1 rounded-full">
                        {sub.videoCount.toLocaleString()}
                      </span>
                    </div>

                    {/* Visual bar showing relative size */}
                    <div className="mt-3 h-1 bg-bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: theme.gradient,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[0.7rem] text-text-tertiary">
                        {sub.videoCount === 1 ? '1 video' : `${sub.videoCount} videos`}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-accent-secondary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>

        {/* Right sidebar - overview & quick nav */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Search / Filter by name */}
            <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
              <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-3">
                Filter Sections
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 pr-8 bg-bg-secondary border border-border-medium rounded-lg
                             text-sm text-text-primary font-body
                             placeholder:text-text-tertiary
                             focus:outline-none focus:border-accent-primary/50
                             transition-all duration-200"
                />
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {nameFilter && (
                <p className="text-xs text-text-tertiary mt-2">
                  {sortedSubs.length} of {visibleSubs.length} sections
                </p>
              )}
            </div>

            {/* Category overview */}
            <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
              <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-4">
                Overview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Total Videos</span>
                  <span className="font-bold text-text-primary">{category.videoCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Sections</span>
                  <span className="font-bold text-text-primary">{visibleSubs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Largest Section</span>
                  <span className="font-bold text-text-primary">{sortedSubs[0]?.videoCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Smallest Section</span>
                  <span className="font-bold text-text-primary">{sortedSubs[sortedSubs.length - 1]?.videoCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Distribution chart */}
            <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
              <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-4">
                Video Distribution
              </h3>
              <div className="space-y-2">
                {sortedSubs.slice(0, 8).map((sub) => {
                  const pct = Math.round((sub.videoCount / category.videoCount) * 100);
                  const displayName = sub.name === 'General' ? 'Others' : sub.name;
                  return (
                    <Link
                      key={sub.id}
                      href={`/${categoryId}/${sub.id}/`}
                      className="block group/bar"
                    >
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="text-text-secondary truncate mr-2 group-hover/bar:text-accent-primary transition-colors">
                          {displayName}
                        </span>
                        <span className="text-text-tertiary shrink-0">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300 group-hover/bar:opacity-80"
                          style={{
                            width: `${Math.max(3, pct)}%`,
                            background: theme.gradient,
                          }}
                        />
                      </div>
                    </Link>
                  );
                })}
                {sortedSubs.length > 8 && (
                  <p className="text-xs text-text-tertiary text-center mt-2">
                    + {sortedSubs.length - 8} more sections
                  </p>
                )}
              </div>
            </div>

            {/* Quick jump list */}
            <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
              <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-3">
                Quick Jump
              </h3>
              <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                {visibleSubs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${categoryId}/${sub.id}/`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm
                               text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                  >
                    <span className="truncate mr-2">
                      {sub.name === 'General' ? 'Other Videos' : sub.name}
                    </span>
                    <span className="text-xs text-text-tertiary shrink-0">{sub.videoCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
